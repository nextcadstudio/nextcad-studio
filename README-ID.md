# RenderHub Admin + Database (Next.js App Router)

Paket ini menambahkan dashboard admin dan CRUD proyek memakai Supabase.
Cocok untuk proyek Next.js yang memakai folder `app/` dan TypeScript.

## 1. Pasang paket
Di Command Prompt:
```bat
cd C:\Users\LENOVO\renderhub
npm install @supabase/supabase-js @supabase/ssr
```

## 2. Buat project Supabase
Buka https://supabase.com, buat project, lalu buka SQL Editor dan jalankan seluruh isi `supabase/schema.sql`.

Di Supabase > Project Settings > API, salin Project URL dan anon/public key.

## 3. Buat `.env.local`
Salin `.env.local.example` menjadi `.env.local`, lalu isi nilai URL dan anon key milik project kamu. Jangan pernah memasukkan `service_role` key ke browser.

## 4. Salin file
Salin isi folder `app` dan `lib` dari paket ini ke folder proyek yang sama. Jika `app/page.tsx` sudah ada, backup dulu; file ini adalah contoh beranda yang membaca proyek terpublikasi dari database.

## 5. Buat admin
Di Supabase > Authentication > Users, tambahkan user admin. Salin UUID user tersebut.
Di SQL Editor jalankan:
```sql
insert into public.admin_users (user_id) values ('GANTI-DENGAN-UUID-USER-ADMIN');
```
Jangan biarkan user publik dapat menambahkan dirinya sendiri ke `admin_users`.

## 6. Jalankan
```bat
npm run dev
```
Buka http://localhost:3000/admin/login lalu login dengan email dan password yang dibuat di Supabase Auth.

## Catatan
- CRUD menggunakan sesi Supabase dan pemeriksaan admin di server.
- RLS mengizinkan publik membaca proyek berstatus published, sedangkan admin yang terdaftar bisa mengelola proyek.
- Upload gambar belum disertakan; isi `image_url` dengan URL gambar yang dapat diakses publik.
- Sebelum deploy, gunakan password kuat, aktifkan verifikasi email sesuai kebutuhan, dan jangan pernah mengekspos secret/service-role key.
