<?php
/**
 * NASIJ Store — WordPress theme.
 *
 * The storefront and the dashboard are the same single-page apps as the static
 * build; this file gives them a WordPress backend:
 *  - GET/POST /wp-json/nasij/v1/content            the CMS content (JSON, stored in an option)
 *  - POST     /wp-json/nasij/v1/orders             new order from the checkout (public, rate-limited)
 *  - GET      /wp-json/nasij/v1/orders             all orders (dashboard)
 *  - POST     /wp-json/nasij/v1/orders/{id}        update / DELETE an order (dashboard)
 *  - same three for /requests (custom & bulk requests) and /reviews (pending reviews)
 *  - POST/GET /wp-json/nasij/v1/track              visit sessions for the analytics
 *  - /nasij-admin/ (or /?nasij_admin=1)            the dashboard, for Administrators and Editors
 *
 * @package nasij
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

define( 'NASIJ_VER', '2.1.0' );
define( 'NASIJ_DB_VER', '2' );

/* ─────────────────────────── access ─────────────────────────── */

/** Who may open the dashboard and read orders (Administrators + Editors by default). */
function nasij_can() {
	return current_user_can( apply_filters( 'nasij_manage_cap', 'edit_others_posts' ) );
}

/** Publishing content writes raw HTML (policies, journal) — also require unfiltered_html. */
function nasij_can_publish() {
	return nasij_can() && current_user_can( 'unfiltered_html' );
}

function nasij_admin_url() {
	return get_option( 'permalink_structure' ) ? home_url( '/nasij-admin/' ) : add_query_arg( 'nasij_admin', '1', home_url( '/' ) );
}

/* ─────────────────────────── database ─────────────────────────── */

function nasij_tables() {
	global $wpdb;
	return array(
		'orders'   => $wpdb->prefix . 'nasij_orders',
		'requests' => $wpdb->prefix . 'nasij_requests',
		'sessions' => $wpdb->prefix . 'nasij_sessions',
		'reviews'  => $wpdb->prefix . 'nasij_reviews',
	);
}

function nasij_install() {
	global $wpdb;
	$t  = nasij_tables();
	$cs = $wpdb->get_charset_collate();
	require_once ABSPATH . 'wp-admin/includes/upgrade.php';
	dbDelta(
		"CREATE TABLE {$t['orders']} (
		id varchar(40) NOT NULL,
		created bigint(20) unsigned NOT NULL DEFAULT 0,
		updated bigint(20) unsigned NOT NULL DEFAULT 0,
		status varchar(20) NOT NULL DEFAULT '',
		phone varchar(32) NOT NULL DEFAULT '',
		total decimal(12,2) NOT NULL DEFAULT 0,
		data longtext NOT NULL,
		PRIMARY KEY  (id),
		KEY created (created)
		) $cs;"
	);
	dbDelta(
		"CREATE TABLE {$t['requests']} (
		id varchar(40) NOT NULL,
		created bigint(20) unsigned NOT NULL DEFAULT 0,
		updated bigint(20) unsigned NOT NULL DEFAULT 0,
		status varchar(20) NOT NULL DEFAULT '',
		phone varchar(32) NOT NULL DEFAULT '',
		data longtext NOT NULL,
		PRIMARY KEY  (id),
		KEY created (created)
		) $cs;"
	);
	dbDelta(
		"CREATE TABLE {$t['reviews']} (
		id varchar(40) NOT NULL,
		created bigint(20) unsigned NOT NULL DEFAULT 0,
		updated bigint(20) unsigned NOT NULL DEFAULT 0,
		status varchar(20) NOT NULL DEFAULT '',
		phone varchar(32) NOT NULL DEFAULT '',
		data longtext NOT NULL,
		PRIMARY KEY  (id),
		KEY created (created)
		) $cs;"
	);
	dbDelta(
		"CREATE TABLE {$t['sessions']} (
		sid varchar(64) NOT NULL,
		t bigint(20) unsigned NOT NULL DEFAULT 0,
		last bigint(20) unsigned NOT NULL DEFAULT 0,
		data text NOT NULL,
		PRIMARY KEY  (sid),
		KEY t (t)
		) $cs;"
	);
	update_option( 'nasij_db_ver', NASIJ_DB_VER );
}
add_action( 'after_switch_theme', 'nasij_install' );
add_action(
	'init',
	function () {
		if ( get_option( 'nasij_db_ver' ) !== NASIJ_DB_VER ) {
			nasij_install();
		}
	}
);

/* ─────────────────────────── theme setup ─────────────────────────── */

add_action(
	'after_setup_theme',
	function () {
		add_theme_support( 'post-thumbnails' );
	}
);

/* The storefront has its own fixed header — keep the admin bar out of it. */
add_filter( 'show_admin_bar', '__return_false' );

/* Keep the page lean: no block-library CSS or emoji scripts on the storefront. */
add_action(
	'wp_enqueue_scripts',
	function () {
		foreach ( array( 'wp-block-library', 'wp-block-library-theme', 'global-styles', 'classic-theme-styles' ) as $h ) {
			wp_dequeue_style( $h );
		}
	},
	100
);
remove_action( 'wp_head', 'print_emoji_detection_script', 7 );
remove_action( 'wp_print_styles', 'print_emoji_styles' );

/** Prints window.NZ_WP — the app switches to the WordPress backend when it sees it. */
function nasij_config( $admin = false ) {
	$cfg = array(
		'rest' => esc_url_raw( rest_url() ),
		'base' => trailingslashit( get_template_directory_uri() ),
		'home' => home_url( '/' ),
		'ver'  => NASIJ_VER,
		'admin' => nasij_admin_url(),
	);
	if ( $admin ) {
		$u              = wp_get_current_user();
		$cfg['nonce']   = wp_create_nonce( 'wp_rest' );
		$cfg['user']    = array(
			'email' => $u->user_email,
			'name'  => $u->display_name,
			'role'  => current_user_can( 'manage_options' ) ? 'owner' : 'staff',
		);
		$cfg['logout']  = wp_logout_url( home_url( '/' ) );
		$cfg['wpadmin'] = admin_url();
	}
	echo '<script>window.NZ_WP = ' . wp_json_encode( $cfg ) . ";</script>\n";
}

/* ─────────────────────────── dashboard route ─────────────────────────── */

add_action(
	'init',
	function () {
		add_rewrite_rule( '^nasij-admin/?$', 'index.php?nasij_admin=1', 'top' );
		if ( get_option( 'nasij_rewrite' ) !== NASIJ_VER ) {
			flush_rewrite_rules( false );
			update_option( 'nasij_rewrite', NASIJ_VER );
		}
	}
);
add_filter(
	'query_vars',
	function ( $vars ) {
		$vars[] = 'nasij_admin';
		return $vars;
	}
);
add_action(
	'template_redirect',
	function () {
		if ( ! get_query_var( 'nasij_admin' ) && ! isset( $_GET['nasij_admin'] ) ) { // phpcs:ignore WordPress.Security.NonceVerification
			return;
		}
		if ( ! is_user_logged_in() ) {
			auth_redirect();
			exit;
		}
		if ( ! nasij_can() ) {
			wp_die( esc_html__( 'You do not have access to the NASIJ dashboard.', 'nasij' ), '', array( 'response' => 403 ) );
		}
		nocache_headers();
		header( 'X-Robots-Tag: noindex, nofollow', true );
		include get_template_directory() . '/dashboard.php';
		exit;
	}
);

/* wp-admin menu + admin bar shortcuts */
add_action(
	'admin_menu',
	function () {
		add_menu_page( 'NASIJ Store', 'NASIJ Store', apply_filters( 'nasij_manage_cap', 'edit_others_posts' ), 'nasij', 'nasij_menu_page', 'dashicons-store', 3 );
	}
);
function nasij_menu_page() {
	echo '<div class="wrap"><h1>NASIJ Store</h1><p><a class="button button-primary button-hero" href="' . esc_url( nasij_admin_url() ) . '">' . esc_html__( 'Open the NASIJ dashboard', 'nasij' ) . '</a></p></div>';
}
add_action(
	'admin_init',
	function () {
		if ( isset( $_GET['page'] ) && 'nasij' === $_GET['page'] && nasij_can() ) { // phpcs:ignore WordPress.Security.NonceVerification
			wp_safe_redirect( nasij_admin_url() );
			exit;
		}
	}
);

/* ─────────────────────────── helpers ─────────────────────────── */

function nasij_ms() {
	return (int) round( microtime( true ) * 1000 );
}

function nasij_clean_id( $id ) {
	return substr( preg_replace( '/[^A-Za-z0-9_-]/', '', (string) $id ), 0, 40 );
}

/** Simple per-IP rate limit for the public endpoints. */
function nasij_rate( $bucket, $max, $window ) {
	$ip  = isset( $_SERVER['REMOTE_ADDR'] ) ? sanitize_text_field( wp_unslash( $_SERVER['REMOTE_ADDR'] ) ) : '0';
	$key = 'nasij_rl_' . $bucket . '_' . md5( $ip );
	$n   = (int) get_transient( $key );
	if ( $n >= $max ) {
		return false;
	}
	set_transient( $key, $n + 1, $window );
	return true;
}

/** Strip tags from every string in a decoded JSON payload (images must be data URLs). */
function nasij_clean_deep( $v, $depth = 0 ) {
	if ( $depth > 8 ) {
		return null;
	}
	if ( is_array( $v ) ) {
		$out = array();
		foreach ( $v as $k => $x ) {
			$key         = is_int( $k ) ? $k : substr( preg_replace( '/[^A-Za-z0-9_]/', '', (string) $k ), 0, 40 );
			$out[ $key ] = nasij_clean_deep( $x, $depth + 1 );
		}
		return $out;
	}
	if ( is_string( $v ) ) {
		if ( 0 === strpos( $v, 'data:image/' ) ) {
			return preg_match( '#^data:image/(jpeg|png|webp|gif);base64,[A-Za-z0-9+/=]+$#', $v ) && strlen( $v ) < 3000000 ? $v : '';
		}
		return substr( wp_strip_all_tags( $v ), 0, 4000 );
	}
	if ( is_bool( $v ) || is_int( $v ) || is_float( $v ) || null === $v ) {
		return $v;
	}
	return null;
}

function nasij_json( $data ) {
	return wp_json_encode( $data, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES );
}

function nasij_nocache( $data ) {
	$res = new WP_REST_Response( $data );
	$res->header( 'Cache-Control', 'no-store, max-age=0' );
	return $res;
}

function nasij_err( $code, $msg, $status ) {
	return new WP_Error( $code, $msg, array( 'status' => $status ) );
}

/* ─────────────────────────── REST API ─────────────────────────── */

add_action(
	'rest_api_init',
	function () {
		$ns = 'nasij/v1';
		register_rest_route(
			$ns,
			'/content',
			array(
				array(
					'methods'             => 'GET',
					'callback'            => 'nasij_get_content',
					'permission_callback' => '__return_true',
				),
				array(
					'methods'             => 'POST',
					'callback'            => 'nasij_put_content',
					'permission_callback' => 'nasij_can_publish',
				),
			)
		);
		foreach ( array( 'orders', 'requests', 'reviews' ) as $kind ) {
			register_rest_route(
				$ns,
				'/' . $kind,
				array(
					array(
						'methods'             => 'GET',
						'callback'            => function () use ( $kind ) {
							return nasij_list( $kind );
						},
						'permission_callback' => 'nasij_can',
					),
					array(
						'methods'             => 'POST',
						'callback'            => function ( WP_REST_Request $req ) use ( $kind ) {
							return nasij_create( $kind, $req );
						},
						'permission_callback' => '__return_true',
					),
				)
			);
			register_rest_route(
				$ns,
				'/' . $kind . '/(?P<id>[A-Za-z0-9_-]{3,40})',
				array(
					array(
						'methods'             => 'POST',
						'callback'            => function ( WP_REST_Request $req ) use ( $kind ) {
							return nasij_update( $kind, $req );
						},
						'permission_callback' => 'nasij_can',
					),
					array(
						'methods'             => 'DELETE',
						'callback'            => function ( WP_REST_Request $req ) use ( $kind ) {
							return nasij_delete( $kind, $req );
						},
						'permission_callback' => 'nasij_can',
					),
				)
			);
		}
		register_rest_route(
			$ns,
			'/track',
			array(
				array(
					'methods'             => 'GET',
					'callback'            => 'nasij_list_sessions',
					'permission_callback' => 'nasij_can',
				),
				array(
					'methods'             => 'POST',
					'callback'            => 'nasij_track',
					'permission_callback' => '__return_true',
				),
			)
		);
	}
);

/* content */

function nasij_get_content() {
	$raw  = get_option( 'nasij_content', '' );
	$data = $raw ? json_decode( $raw ) : null;
	return nasij_nocache( is_object( $data ) ? $data : new stdClass() );
}

function nasij_put_content( WP_REST_Request $req ) {
	$body = $req->get_body();
	if ( strlen( $body ) > 6 * 1024 * 1024 ) {
		return nasij_err( 'nasij_too_big', 'The content is too large.', 413 );
	}
	$data = json_decode( $body );
	if ( ! is_object( $data ) ) {
		return nasij_err( 'nasij_bad_content', 'Invalid content.', 400 );
	}
	update_option( 'nasij_content', nasij_json( $data ), false );
	update_option( 'nasij_content_at', time(), false );
	return array(
		'ok' => true,
		'at' => time(),
	);
}

/* orders + custom requests */

function nasij_list( $kind ) {
	global $wpdb;
	$t    = nasij_tables();
	$rows = $wpdb->get_col( "SELECT data FROM {$t[$kind]} ORDER BY created DESC LIMIT 5000" ); // phpcs:ignore WordPress.DB.PreparedSQL.InterpolatedNotPrepared
	$out  = array();
	foreach ( (array) $rows as $r ) {
		$d = json_decode( $r, true );
		if ( is_array( $d ) ) {
			$out[] = $d;
		}
	}
	return nasij_nocache( $out );
}

function nasij_create( $kind, WP_REST_Request $req ) {
	$orders = 'orders' === $kind;
	$rev    = 'reviews' === $kind;
	if ( ! nasij_rate( $orders ? 'o' : ( $rev ? 'v' : 'r' ), $orders ? 20 : ( $rev ? 6 : 10 ), HOUR_IN_SECONDS ) ) {
		return nasij_err( 'nasij_slow', 'Too many submissions — please try again later.', 429 );
	}
	$body = $req->get_body();
	if ( strlen( $body ) > ( $orders ? 200000 : ( $rev ? 20000 : 8 * 1024 * 1024 ) ) ) {
		return nasij_err( 'nasij_too_big', 'The submission is too large.', 413 );
	}
	$d = json_decode( $body, true );
	if ( ! is_array( $d ) || empty( $d['id'] ) ) {
		return nasij_err( 'nasij_bad', 'Invalid submission.', 400 );
	}
	if ( $orders && ( empty( $d['items'] ) || ! is_array( $d['items'] ) || empty( $d['customer']['phone'] ) ) ) {
		return nasij_err( 'nasij_bad', 'Invalid order.', 400 );
	}
	$d  = nasij_clean_deep( $d );
	if ( $rev ) {
		$d['rating'] = max( 1, min( 5, round( (float) ( isset( $d['rating'] ) ? $d['rating'] : 0 ) * 2 ) / 2 ) );
		if ( empty( $d['text'] ) || empty( $d['pid'] ) || empty( $d['name'] ) ) {
			return nasij_err( 'nasij_bad', 'Invalid review.', 400 );
		}
		unset( $d['images'], $d['verified'] );
	}
	$id = nasij_clean_id( $d['id'] );
	if ( strlen( $id ) < 3 ) {
		return nasij_err( 'nasij_bad', 'Invalid id.', 400 );
	}
	global $wpdb;
	$t = nasij_tables();
	if ( $wpdb->get_var( $wpdb->prepare( "SELECT id FROM {$t[$kind]} WHERE id = %s", $id ) ) ) { // phpcs:ignore WordPress.DB.PreparedSQL.InterpolatedNotPrepared
		return array(
			'ok'  => true,
			'id'  => $id,
			'dup' => true,
		);
	}
	$now     = nasij_ms();
	$d['id'] = $id;
	$d['date'] = $now;
	if ( $orders ) {
		$d['status'] = in_array( isset( $d['status'] ) ? $d['status'] : '', array( 'pending', 'reserved' ), true ) ? $d['status'] : 'pending';
		$d['log']    = array( array( 's' => $d['status'], 't' => $now ) );
		$phone       = isset( $d['customer']['phone'] ) ? $d['customer']['phone'] : '';
	} else {
		$d['status'] = $rev ? 'pending' : 'new';
		$phone       = isset( $d['phone'] ) ? $d['phone'] : '';
	}
	$row = array(
		'id'      => $id,
		'created' => $now,
		'updated' => $now,
		'status'  => $d['status'],
		'phone'   => substr( (string) $phone, 0, 32 ),
		'data'    => nasij_json( $d ),
	);
	$fmt = array( '%s', '%d', '%d', '%s', '%s', '%s' );
	if ( $orders ) {
		$row['total'] = isset( $d['totals']['total'] ) ? (float) $d['totals']['total'] : 0;
		$fmt[]        = '%f';
	}
	if ( false === $wpdb->insert( $t[ $kind ], $row, $fmt ) ) {
		return nasij_err( 'nasij_db', 'Could not save.', 500 );
	}
	nasij_notify( $kind, $d );
	return array(
		'ok' => true,
		'id' => $id,
	);
}

function nasij_update( $kind, WP_REST_Request $req ) {
	$id = nasij_clean_id( $req['id'] );
	$d  = json_decode( $req->get_body(), true );
	if ( ! is_array( $d ) ) {
		return nasij_err( 'nasij_bad', 'Invalid data.', 400 );
	}
	$d       = nasij_clean_deep( $d );
	$d['id'] = $id;
	global $wpdb;
	$t   = nasij_tables();
	$row = array(
		'updated' => nasij_ms(),
		'status'  => substr( (string) ( isset( $d['status'] ) ? $d['status'] : '' ), 0, 20 ),
		'data'    => nasij_json( $d ),
	);
	$fmt = array( '%d', '%s', '%s' );
	if ( 'orders' === $kind ) {
		$row['total'] = isset( $d['totals']['total'] ) ? (float) $d['totals']['total'] : 0;
		$fmt[]        = '%f';
	}
	$n = $wpdb->update( $t[ $kind ], $row, array( 'id' => $id ), $fmt, array( '%s' ) );
	if ( false === $n ) {
		return nasij_err( 'nasij_db', 'Could not save.', 500 );
	}
	return array( 'ok' => true );
}

function nasij_delete( $kind, WP_REST_Request $req ) {
	global $wpdb;
	$t = nasij_tables();
	$wpdb->delete( $t[ $kind ], array( 'id' => nasij_clean_id( $req['id'] ) ), array( '%s' ) );
	return array( 'ok' => true );
}

/** Email the site admin about every new order / custom request. */
function nasij_notify( $kind, $d ) {
	$to = apply_filters( 'nasij_notify_email', get_option( 'admin_email' ) );
	if ( ! $to ) {
		return;
	}
	$link = nasij_admin_url() . '#' . ( 'orders' === $kind ? 'orders/' . rawurlencode( $d['id'] ) : ( 'reviews' === $kind ? 'reviews?t=pending' : 'requests' ) );
	if ( 'reviews' === $kind ) {
		wp_mail( $to, '[NASIJ] New review waiting for approval', 'New ' . $d['rating'] . '-star review from ' . ( isset( $d['name'] ) ? $d['name'] : '' ) . ":\n\n" . ( isset( $d['text'] ) ? $d['text'] : '' ) . "\n\nApprove or reject it: " . $link );
		return;
	}
	if ( 'orders' === $kind ) {
		$lines = array();
		foreach ( (array) $d['items'] as $i ) {
			$lines[] = sprintf( '- %s / %s / %s x %d%s', isset( $i['title_en'] ) ? $i['title_en'] : '', isset( $i['color_en'] ) ? $i['color_en'] : '', isset( $i['size'] ) ? $i['size'] : '', isset( $i['qty'] ) ? (int) $i['qty'] : 1, ! empty( $i['pre'] ) ? ' (pre-order)' : '' );
		}
		$tot  = isset( $d['totals'] ) ? $d['totals'] : array();
		$body = 'New order ' . $d['id'] . "\n\n" . implode( "\n", $lines )
			. "\n\nTotal: " . ( isset( $tot['total'] ) ? $tot['total'] : '' ) . ' EGP'
			. "\nDue now: " . ( isset( $tot['dueNow'] ) ? $tot['dueNow'] : '' ) . ' EGP'
			. "\nPayment: " . ( isset( $d['payment'] ) ? $d['payment'] : '' )
			. "\nCustomer: " . ( isset( $d['customer']['name'] ) ? $d['customer']['name'] : '' ) . ' · ' . ( isset( $d['customer']['phone'] ) ? $d['customer']['phone'] : '' )
			. "\n\nOpen in the dashboard: " . $link;
		wp_mail( $to, '[NASIJ] New order ' . $d['id'], $body );
	} else {
		$body = 'New custom request ' . $d['id']
			. "\n\nName: " . ( isset( $d['name'] ) ? $d['name'] : '' )
			. "\nPhone: " . ( isset( $d['phone'] ) ? $d['phone'] : '' )
			. "\nSize: " . ( isset( $d['width'] ) ? $d['width'] : '' ) . ' x ' . ( isset( $d['height'] ) ? $d['height'] : '' ) . ' cm · qty ' . ( isset( $d['qty'] ) ? $d['qty'] : '' )
			. "\n\nOpen in the dashboard: " . $link;
		wp_mail( $to, '[NASIJ] New custom request ' . $d['id'], $body );
	}
}

/* visits (one row per session, upserted as the visitor browses) */

function nasij_track( WP_REST_Request $req ) {
	if ( ! nasij_rate( 't', 600, HOUR_IN_SECONDS ) ) {
		return nasij_err( 'nasij_slow', 'Slow down.', 429 );
	}
	$body = $req->get_body();
	if ( strlen( $body ) > 30000 ) {
		return nasij_err( 'nasij_too_big', 'Too large.', 413 );
	}
	$p = json_decode( $body, true );
	if ( ! is_array( $p ) || empty( $p['s'] ) || ! is_array( $p['s'] ) || empty( $p['s']['id'] ) ) {
		return nasij_err( 'nasij_bad', 'Invalid.', 400 );
	}
	$s   = nasij_clean_deep( $p['s'] );
	$vid = isset( $p['vid'] ) ? nasij_clean_id( $p['vid'] ) : '';
	$sid = substr( $vid . '-' . nasij_clean_id( $s['id'] ), 0, 64 );
	$now = nasij_ms();
	$t0  = isset( $s['t'] ) ? (int) $s['t'] : $now;
	if ( $t0 > $now + DAY_IN_SECONDS * 1000 || $t0 < $now - 30 * DAY_IN_SECONDS * 1000 ) {
		$t0 = $now;
	}
	$s['t']    = $t0;
	$s['last'] = min( $now, max( $t0, isset( $s['last'] ) ? (int) $s['last'] : $now ) );
	global $wpdb;
	$t = nasij_tables();
	$wpdb->replace(
		$t['sessions'],
		array(
			'sid'  => $sid,
			't'    => $t0,
			'last' => $s['last'],
			'data' => nasij_json( $s ),
		),
		array( '%s', '%d', '%d', '%s' )
	);
	if ( 1 === wp_rand( 1, 300 ) ) {
		$wpdb->query( $wpdb->prepare( "DELETE FROM {$t['sessions']} WHERE t < %d", $now - 400 * DAY_IN_SECONDS * 1000 ) ); // phpcs:ignore WordPress.DB.PreparedSQL.InterpolatedNotPrepared
	}
	return array( 'ok' => true );
}

function nasij_list_sessions() {
	global $wpdb;
	$t    = nasij_tables();
	$rows = $wpdb->get_col( $wpdb->prepare( "SELECT data FROM {$t['sessions']} WHERE t > %d ORDER BY t DESC LIMIT 40000", nasij_ms() - 400 * DAY_IN_SECONDS * 1000 ) ); // phpcs:ignore WordPress.DB.PreparedSQL.InterpolatedNotPrepared
	$out  = array();
	foreach ( array_reverse( (array) $rows ) as $r ) {
		$d = json_decode( $r, true );
		if ( is_array( $d ) ) {
			$out[] = $d;
		}
	}
	return nasij_nocache( $out );
}
