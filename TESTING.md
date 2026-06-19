# Testing Guide — Biro Perjalanan Mlaku-Mulu

Panduan testing lengkap semua endpoint menggunakan Postman.

---

## Persiapan

### 1. Pastikan App Berjalan

```bash
# Jalankan database
docker start mlaku-mulu-db

# Jalankan app
npm run start:dev
```

App berjalan di `http://localhost:3000/api`.

---

### 2. Setup Postman Environment

1. Buka Postman → **Environments** → **+**
2. Nama: `Mlaku-Mulu`
3. Tambah variables:

| Variable | Value |
|---|---|
| `base_url` | `http://localhost:3000/api` |
| `token_pegawai` | *(kosong)* |
| `token_turis` | *(kosong)* |
| `turis_id` | *(kosong)* |
| `perjalanan_id` | *(kosong)* |

4. **Save** lalu aktifkan environment tersebut.

---

### 3. Seed Akun Pegawai

Jalankan di terminal untuk generate hash password:

```bash
node -e "require('bcrypt').hash('password123', 10).then(console.log)"
```

Masuk ke database:

```bash
docker exec -it mlaku-mulu-db psql -U postgres -d mlaku_mulu
```

Insert pegawai:

```sql
INSERT INTO pegawai (id, nama, email, password, "createdAt", "updatedAt")
VALUES (
  gen_random_uuid(),
  'Admin Biro',
  'admin@mlakumulu.com',
  '<hash_dari_terminal>',
  NOW(),
  NOW()
);
```

---

## Urutan Testing

Ikuti urutan ini karena setiap step bergantung pada data dari step sebelumnya.

---

## 1. Login Pegawai

**Method:** `POST`
**URL:** `{{base_url}}/auth/login/pegawai`
**Body (raw JSON):**
```json
{
  "email": "admin@mlakumulu.com",
  "password": "password123"
}
```

**Script (Post-response):**
```js
const res = pm.response.json();
pm.environment.set("token_pegawai", res.access_token);
```

**Expected Response `200`:**
```json
{
  "access_token": "eyJhbGci...",
  "role": "pegawai"
}
```

**Cek:** Variable `token_pegawai` di environment terisi otomatis.

---

## 2. Buat Turis Baru

**Method:** `POST`
**URL:** `{{base_url}}/turis`
**Authorization:** `Bearer {{token_pegawai}}`
**Body (raw JSON):**
```json
{
  "nama": "Budi Santoso",
  "email": "budi@email.com",
  "password": "password123",
  "telepon": "081234567890",
  "alamat": "Yogyakarta"
}
```

**Script (Post-response):**
```js
const res = pm.response.json();
pm.environment.set("turis_id", res.id);
```

**Expected Response `201`:**
```json
{
  "id": "550e8400-...",
  "nama": "Budi Santoso",
  "email": "budi@email.com",
  "telepon": "081234567890",
  "alamat": "Yogyakarta",
  "createdAt": "...",
  "updatedAt": "..."
}
```

**Cek:** Tidak ada field `password` di response. Variable `turis_id` terisi.

---

## 3. Ambil Semua Turis

**Method:** `GET`
**URL:** `{{base_url}}/turis`
**Authorization:** `Bearer {{token_pegawai}}`

**Expected Response `200`:**
```json
[
  {
    "id": "550e8400-...",
    "nama": "Budi Santoso",
    "email": "budi@email.com",
    "telepon": "081234567890",
    "alamat": "Yogyakarta",
    "createdAt": "...",
    "updatedAt": "..."
  }
]
```

**Cek:** Array berisi turis yang baru dibuat. Tidak ada field `password`.

---

## 4. Ambil Satu Turis by ID

**Method:** `GET`
**URL:** `{{base_url}}/turis/{{turis_id}}`
**Authorization:** `Bearer {{token_pegawai}}`

**Expected Response `200`:**
```json
{
  "id": "550e8400-...",
  "nama": "Budi Santoso",
  "email": "budi@email.com",
  "telepon": "081234567890",
  "alamat": "Yogyakarta",
  "createdAt": "...",
  "updatedAt": "..."
}
```

---

## 5. Update Data Turis

**Method:** `PUT`
**URL:** `{{base_url}}/turis/{{turis_id}}`
**Authorization:** `Bearer {{token_pegawai}}`
**Body (raw JSON):**
```json
{
  "nama": "Budi Santoso Updated",
  "alamat": "Jakarta"
}
```

**Expected Response `200`:**
```json
{
  "id": "550e8400-...",
  "nama": "Budi Santoso Updated",
  "email": "budi@email.com",
  "telepon": "081234567890",
  "alamat": "Jakarta",
  "createdAt": "...",
  "updatedAt": "..."
}
```

**Cek:** Field `nama` dan `alamat` berubah. Field yang tidak dikirim (`telepon`, `email`) tetap sama.

---

## 6. Login Turis

**Method:** `POST`
**URL:** `{{base_url}}/auth/login/turis`
**Body (raw JSON):**
```json
{
  "email": "budi@email.com",
  "password": "password123"
}
```

**Script (Post-response):**
```js
const res = pm.response.json();
pm.environment.set("token_turis", res.access_token);
```

**Expected Response `200`:**
```json
{
  "access_token": "eyJhbGci...",
  "role": "turis"
}
```

---

## 7. Turis Lihat Profil Sendiri

**Method:** `GET`
**URL:** `{{base_url}}/turis/me`
**Authorization:** `Bearer {{token_turis}}`

**Expected Response `200`:**
```json
{
  "id": "550e8400-...",
  "nama": "Budi Santoso Updated",
  "email": "budi@email.com",
  "telepon": "081234567890",
  "alamat": "Jakarta",
  "createdAt": "...",
  "updatedAt": "..."
}
```

---

## 8. Tambah Perjalanan

**Method:** `POST`
**URL:** `{{base_url}}/perjalanan`
**Authorization:** `Bearer {{token_pegawai}}`
**Body (raw JSON):**
```json
{
  "turisId": "{{turis_id}}",
  "tanggalMulaiPerjalanan": "2024-06-01T08:00:00.000Z",
  "tanggalBerakhirPerjalanan": "2024-06-10T18:00:00.000Z",
  "destinasiPerjalanan": {
    "kota": "Bali",
    "negara": "Indonesia"
  }
}
```

**Script (Post-response):**
```js
const res = pm.response.json();
pm.environment.set("perjalanan_id", res.id);
```

**Expected Response `201`:**
```json
{
  "id": "660e8400-...",
  "turisId": "550e8400-...",
  "tanggalMulaiPerjalanan": "2024-06-01T08:00:00.000Z",
  "tanggalBerakhirPerjalanan": "2024-06-10T18:00:00.000Z",
  "destinasiPerjalanan": {
    "kota": "Bali",
    "negara": "Indonesia"
  },
  "createdAt": "...",
  "updatedAt": "..."
}
```

**Cek:** Variable `perjalanan_id` terisi.

---

## 9. Turis Lihat Riwayat Perjalanan Sendiri

**Method:** `GET`
**URL:** `{{base_url}}/turis/me/perjalanan`
**Authorization:** `Bearer {{token_turis}}`

**Expected Response `200`:**
```json
[
  {
    "id": "660e8400-...",
    "turisId": "550e8400-...",
    "tanggalMulaiPerjalanan": "2024-06-01T08:00:00.000Z",
    "tanggalBerakhirPerjalanan": "2024-06-10T18:00:00.000Z",
    "destinasiPerjalanan": {
      "kota": "Bali",
      "negara": "Indonesia"
    },
    "createdAt": "...",
    "updatedAt": "..."
  }
]
```

**Cek:** Hanya perjalanan milik turis ini yang muncul.

---

## 10. Ambil Semua Perjalanan

**Method:** `GET`
**URL:** `{{base_url}}/perjalanan`
**Authorization:** `Bearer {{token_pegawai}}`

**Expected Response `200`:**
```json
[
  {
    "id": "660e8400-...",
    "turisId": "550e8400-...",
    "tanggalMulaiPerjalanan": "2024-06-01T08:00:00.000Z",
    "tanggalBerakhirPerjalanan": "2024-06-10T18:00:00.000Z",
    "destinasiPerjalanan": { "kota": "Bali", "negara": "Indonesia" },
    "createdAt": "...",
    "updatedAt": "...",
    "turis": {
      "id": "550e8400-...",
      "nama": "Budi Santoso Updated",
      "email": "budi@email.com",
      "telepon": "081234567890",
      "alamat": "Jakarta"
    }
  }
]
```

**Cek:** Objek `turis` muncul di dalam response. Tidak ada field `password` di dalam `turis`.

---

## 11. Ambil Satu Perjalanan by ID

**Method:** `GET`
**URL:** `{{base_url}}/perjalanan/{{perjalanan_id}}`
**Authorization:** `Bearer {{token_pegawai}}`

**Expected Response `200`:** Sama seperti satu objek dari endpoint sebelumnya.

---

## 12. Update Perjalanan

**Method:** `PUT`
**URL:** `{{base_url}}/perjalanan/{{perjalanan_id}}`
**Authorization:** `Bearer {{token_pegawai}}`
**Body (raw JSON):**
```json
{
  "tanggalBerakhirPerjalanan": "2024-06-15T18:00:00.000Z",
  "destinasiPerjalanan": "Lombok, Indonesia"
}
```

**Expected Response `200`:**
```json
{
  "id": "660e8400-...",
  "turisId": "550e8400-...",
  "tanggalMulaiPerjalanan": "2024-06-01T08:00:00.000Z",
  "tanggalBerakhirPerjalanan": "2024-06-15T18:00:00.000Z",
  "destinasiPerjalanan": "Lombok, Indonesia",
  "createdAt": "...",
  "updatedAt": "..."
}
```

**Cek:** `tanggalBerakhirPerjalanan` berubah. `destinasiPerjalanan` berubah dari objek menjadi string.

---

## 13. Hapus Perjalanan

**Method:** `DELETE`
**URL:** `{{base_url}}/perjalanan/{{perjalanan_id}}`
**Authorization:** `Bearer {{token_pegawai}}`

**Expected Response `200`:**
```json
{
  "message": "Perjalanan berhasil dihapus"
}
```

**Cek:** Jalankan `GET {{base_url}}/perjalanan/{{perjalanan_id}}` → harus `404`.

---

## 14. Hapus Turis

**Method:** `DELETE`
**URL:** `{{base_url}}/turis/{{turis_id}}`
**Authorization:** `Bearer {{token_pegawai}}`

**Expected Response `200`:**
```json
{
  "message": "Turis berhasil dihapus"
}
```

**Cek:** Jalankan `GET {{base_url}}/turis/{{turis_id}}` → harus `404`.

---

## Testing Error Cases

### 401 — Tanpa Token

**Request:** `GET {{base_url}}/turis` tanpa Authorization header.

**Expected:**
```json
{
  "message": "Unauthorized",
  "statusCode": 401
}
```

---

### 403 — Role Salah

**Request:** `GET {{base_url}}/turis` menggunakan `{{token_turis}}`.

**Expected:**
```json
{
  "statusCode": 403,
  "message": "Akses ditolak"
}
```

---

### 404 — Data Tidak Ada

**Request:** `GET {{base_url}}/turis/id-yang-tidak-ada`.

**Expected:**
```json
{
  "statusCode": 404,
  "message": "Turis tidak ditemukan"
}
```

---

### 409 — Email Duplikat

**Request:** `POST {{base_url}}/turis` dengan email yang sudah terdaftar.

**Expected:**
```json
{
  "statusCode": 409,
  "message": "Email sudah terdaftar"
}
```

---

### 400 — Validasi Gagal

**Request:** `POST {{base_url}}/auth/login/pegawai` dengan email tidak valid.

**Body:**
```json
{
  "email": "bukan-email",
  "password": "123"
}
```

**Expected:**
```json
{
  "statusCode": 400,
  "message": ["email must be an email"],
  "error": "Bad Request"
}
```
