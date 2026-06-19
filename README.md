# Biro Perjalanan Mlaku-Mulu — Backend API

REST API untuk manajemen data turis dan riwayat perjalanan Biro Perjalanan Mlaku-Mulu.

## Tech Stack

- **Framework**: NestJS (TypeScript)
- **Database**: PostgreSQL
- **Auth**: JWT (JSON Web Token)
- **ORM**: TypeORM

---

## Setup & Deployment

### Prasyarat
- Node.js v18+
- Docker (untuk PostgreSQL)

### 1. Clone & Install

```bash
git clone <repo-url>
cd mlaku-mulu-backend
npm install
```

### 2. Konfigurasi Environment

Buat file `.env` di root project:

```env
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_USER=postgres
DATABASE_PASS=postgres
DATABASE_NAME=mlaku_mulu
JWT_SECRET=supersecretkey
JWT_EXPIRES=7d
```

### 3. Jalankan Database

```bash
docker run --name mlaku-mulu-db \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=mlaku_mulu \
  -p 5432:5432 -d postgres
```

### 4. Jalankan Aplikasi

```bash
# Development
npm run start:dev

# Production
npm run build
npm run start:prod
```

Aplikasi berjalan di `http://localhost:3000`.

### 5. Seed Akun Pegawai Pertama

Karena tidak ada endpoint registrasi pegawai, insert manual via psql:

```bash
docker exec -it mlaku-mulu-db psql -U postgres -d mlaku_mulu
```

```sql
INSERT INTO pegawai (id, nama, email, password, "createdAt", "updatedAt")
VALUES (
  gen_random_uuid(),
  'Admin',
  'admin@mlakumulu.com',
  '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',
  NOW(),
  NOW()
);
```

> Hash di atas adalah bcrypt dari kata `password`. Ganti sesuai kebutuhan.

---

## Autentikasi

Semua endpoint (kecuali login) memerlukan header:

```
Authorization: Bearer <access_token>
```

Token didapat dari endpoint login.

---

## Endpoints

### Auth

---

#### `POST /api/auth/login/pegawai`

Login untuk pegawai biro. Mengembalikan JWT token dengan role `pegawai`.

**Request Body:**
```json
{
  "email": "admin@mlakumulu.com",
  "password": "password"
}
```

**Response `200`:**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "role": "pegawai"
}
```

**Response `401`:**
```json
{
  "statusCode": 401,
  "message": "Email atau password salah"
}
```

---

#### `POST /api/auth/login/turis`

Login untuk turis. Mengembalikan JWT token dengan role `turis`.

**Request Body:**
```json
{
  "email": "budi@email.com",
  "password": "password123"
}
```

**Response `200`:**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "role": "turis"
}
```

---

### Turis — Dikelola Pegawai

> Semua endpoint berikut memerlukan token pegawai.

---

#### `GET /api/turis`

Ambil semua data turis.

**Headers:** `Authorization: Bearer <token_pegawai>`

**Response `200`:**
```json
[
  {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "nama": "Budi Santoso",
    "email": "budi@email.com",
    "telepon": "081234567890",
    "alamat": "Yogyakarta",
    "createdAt": "2024-06-01T00:00:00.000Z",
    "updatedAt": "2024-06-01T00:00:00.000Z"
  }
]
```

**Response `403`:**
```json
{
  "statusCode": 403,
  "message": "Akses ditolak"
}
```

---

#### `GET /api/turis/:id`

Ambil satu data turis berdasarkan ID.

**Headers:** `Authorization: Bearer <token_pegawai>`

**Response `200`:**
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "nama": "Budi Santoso",
  "email": "budi@email.com",
  "telepon": "081234567890",
  "alamat": "Yogyakarta",
  "createdAt": "2024-06-01T00:00:00.000Z",
  "updatedAt": "2024-06-01T00:00:00.000Z"
}
```

**Response `404`:**
```json
{
  "statusCode": 404,
  "message": "Turis tidak ditemukan"
}
```

---

#### `POST /api/turis`

Tambah data turis baru.

**Headers:** `Authorization: Bearer <token_pegawai>`

**Request Body:**
```json
{
  "nama": "Budi Santoso",
  "email": "budi@email.com",
  "password": "password123",
  "telepon": "081234567890",
  "alamat": "Yogyakarta"
}
```

| Field | Tipe | Wajib | Keterangan |
|---|---|---|---|
| `nama` | string | ya | |
| `email` | string | ya | format email valid |
| `password` | string | ya | minimal 6 karakter |
| `telepon` | string | tidak | |
| `alamat` | string | tidak | |

**Response `201`:**
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "nama": "Budi Santoso",
  "email": "budi@email.com",
  "telepon": "081234567890",
  "alamat": "Yogyakarta",
  "createdAt": "2024-06-01T00:00:00.000Z",
  "updatedAt": "2024-06-01T00:00:00.000Z"
}
```

**Response `409`:**
```json
{
  "statusCode": 409,
  "message": "Email sudah terdaftar"
}
```

---

#### `PUT /api/turis/:id`

Update data turis. Semua field opsional.

**Headers:** `Authorization: Bearer <token_pegawai>`

**Request Body:**
```json
{
  "nama": "Budi Santoso Updated",
  "telepon": "089876543210",
  "alamat": "Jakarta"
}
```

| Field | Tipe | Wajib |
|---|---|---|
| `nama` | string | tidak |
| `telepon` | string | tidak |
| `alamat` | string | tidak |

**Response `200`:**
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "nama": "Budi Santoso Updated",
  "email": "budi@email.com",
  "telepon": "089876543210",
  "alamat": "Jakarta",
  "createdAt": "2024-06-01T00:00:00.000Z",
  "updatedAt": "2024-06-02T00:00:00.000Z"
}
```

---

#### `DELETE /api/turis/:id`

Hapus data turis.

**Headers:** `Authorization: Bearer <token_pegawai>`

**Response `200`:**
```json
{
  "message": "Turis berhasil dihapus"
}
```

---

### Turis — Akses Mandiri

> Endpoint berikut menggunakan token turis.

---

#### `GET /api/turis/me`

Lihat profil sendiri.

**Headers:** `Authorization: Bearer <token_turis>`

**Response `200`:**
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "nama": "Budi Santoso",
  "email": "budi@email.com",
  "telepon": "081234567890",
  "alamat": "Yogyakarta",
  "createdAt": "2024-06-01T00:00:00.000Z",
  "updatedAt": "2024-06-01T00:00:00.000Z"
}
```

---

#### `GET /api/turis/me/perjalanan`

Lihat riwayat perjalanan sendiri.

**Headers:** `Authorization: Bearer <token_turis>`

**Response `200`:**
```json
[
  {
    "id": "660e8400-e29b-41d4-a716-446655440001",
    "turisId": "550e8400-e29b-41d4-a716-446655440000",
    "tanggalMulaiPerjalanan": "2024-06-01T08:00:00.000Z",
    "tanggalBerakhirPerjalanan": "2024-06-10T18:00:00.000Z",
    "destinasiPerjalanan": {
      "kota": "Bali",
      "negara": "Indonesia"
    },
    "createdAt": "2024-05-01T00:00:00.000Z",
    "updatedAt": "2024-05-01T00:00:00.000Z"
  }
]
```

> `destinasiPerjalanan` bisa berupa string `"Bali, Indonesia"` atau objek JSON.

---

### Perjalanan — Dikelola Pegawai

> Semua endpoint berikut memerlukan token pegawai.

---

#### `GET /api/perjalanan`

Ambil semua data perjalanan beserta data turis terkait.

**Headers:** `Authorization: Bearer <token_pegawai>`

**Response `200`:**
```json
[
  {
    "id": "660e8400-e29b-41d4-a716-446655440001",
    "turisId": "550e8400-e29b-41d4-a716-446655440000",
    "tanggalMulaiPerjalanan": "2024-06-01T08:00:00.000Z",
    "tanggalBerakhirPerjalanan": "2024-06-10T18:00:00.000Z",
    "destinasiPerjalanan": {
      "kota": "Bali",
      "negara": "Indonesia"
    },
    "createdAt": "2024-05-01T00:00:00.000Z",
    "updatedAt": "2024-05-01T00:00:00.000Z",
    "turis": {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "nama": "Budi Santoso",
      "email": "budi@email.com",
      "telepon": "081234567890",
      "alamat": "Yogyakarta"
    }
  }
]
```

---

#### `GET /api/perjalanan/:id`

Ambil satu data perjalanan berdasarkan ID.

**Headers:** `Authorization: Bearer <token_pegawai>`

**Response `200`:** Sama seperti satu objek dari `GET /api/perjalanan`.

**Response `404`:**
```json
{
  "statusCode": 404,
  "message": "Perjalanan tidak ditemukan"
}
```

---

#### `POST /api/perjalanan`

Tambah perjalanan baru untuk suatu turis.

**Headers:** `Authorization: Bearer <token_pegawai>`

**Request Body:**
```json
{
  "turisId": "550e8400-e29b-41d4-a716-446655440000",
  "tanggalMulaiPerjalanan": "2024-06-01T08:00:00.000Z",
  "tanggalBerakhirPerjalanan": "2024-06-10T18:00:00.000Z",
  "destinasiPerjalanan": {
    "kota": "Bali",
    "negara": "Indonesia"
  }
}
```

| Field | Tipe | Wajib | Keterangan |
|---|---|---|---|
| `turisId` | string (UUID) | ya | ID turis yang bersangkutan |
| `tanggalMulaiPerjalanan` | string (ISO 8601) | ya | format UTC |
| `tanggalBerakhirPerjalanan` | string (ISO 8601) | ya | format UTC |
| `destinasiPerjalanan` | string atau objek | ya | bebas |

**Response `201`:**
```json
{
  "id": "660e8400-e29b-41d4-a716-446655440001",
  "turisId": "550e8400-e29b-41d4-a716-446655440000",
  "tanggalMulaiPerjalanan": "2024-06-01T08:00:00.000Z",
  "tanggalBerakhirPerjalanan": "2024-06-10T18:00:00.000Z",
  "destinasiPerjalanan": {
    "kota": "Bali",
    "negara": "Indonesia"
  },
  "createdAt": "2024-05-01T00:00:00.000Z",
  "updatedAt": "2024-05-01T00:00:00.000Z"
}
```

---

#### `PUT /api/perjalanan/:id`

Update data perjalanan. Semua field opsional.

**Headers:** `Authorization: Bearer <token_pegawai>`

**Request Body:**
```json
{
  "tanggalMulaiPerjalanan": "2024-06-02T09:00:00.000Z",
  "tanggalBerakhirPerjalanan": "2024-06-12T18:00:00.000Z",
  "destinasiPerjalanan": "Lombok, Indonesia"
}
```

**Response `200`:** Objek perjalanan yang sudah diperbarui.

---

#### `DELETE /api/perjalanan/:id`

Hapus data perjalanan.

**Headers:** `Authorization: Bearer <token_pegawai>`

**Response `200`:**
```json
{
  "message": "Perjalanan berhasil dihapus"
}
```

---

## Error Umum

| Status | Kondisi |
|---|---|
| `400 Bad Request` | Body tidak valid (field wajib kosong, format salah) |
| `401 Unauthorized` | Token tidak ada atau sudah expired |
| `403 Forbidden` | Token valid tapi role tidak punya akses |
| `404 Not Found` | Data tidak ditemukan |
| `409 Conflict` | Email sudah terdaftar |
