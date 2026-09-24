# NASIJ Store — WordPress theme

The NASIJ storefront and its dashboard, running on WordPress.

## Install
1. wp-admin → **Appearance → Themes → Add New → Upload Theme** → choose `nasij-wordpress-theme.zip` → **Install** → **Activate**.
   (If the upload is too big for your host, unzip it and upload the `nasij` folder to `wp-content/themes/` with FTP or the host's File Manager, then activate.)
2. wp-admin → **Settings → Permalinks** → any setting except "Plain" → **Save** (this makes `/nasij-admin/` work; with Plain permalinks the dashboard is at `/?nasij_admin=1`).
3. Open the dashboard from the **NASIJ Store** item in the wp-admin menu.

## How it works
- **Who can open the dashboard:** Administrators and Editors (WordPress accounts, no separate password).
- **Publish:** edits are a draft in your browser until you press *Publish*; new images go to the Media Library and the store updates instantly.
- **Orders, custom requests, visits:** saved in the site database (tables `wp_nasij_orders`, `wp_nasij_requests`, `wp_nasij_sessions`). Every new order and request is emailed to the admin email (Settings → General). Change the address with the `nasij_notify_email` filter.
- **Access level:** filter `nasij_manage_cap` (default `edit_others_posts`).

## التثبيت (عربي)
١. لوحة ووردبريس ← المظهر ← القوالب ← إضافة ← رفع قالب ← اختار `nasij-wordpress-theme.zip` ← تثبيت ← تفعيل.
٢. الإعدادات ← الروابط الدائمة ← أي اختيار غير «عادي» ← حفظ.
٣. افتح لوحة التحكم من «NASIJ Store» في قائمة ووردبريس. أي مدير أو محرر يقدر يدخل بحسابه.
الطلبات وطلبات التخصيص والزيارات بتتسجل في قاعدة بيانات الموقع، وكل طلب جديد بيوصل على إيميل الأدمن.
