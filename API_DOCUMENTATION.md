# API Documentation v2.0 - Comprehensive Reference

**Base URL:** `http://localhost:5000`

---

## 🔐 Authentication & Profile

### 1. Login
**POST** `/api/auth/login`
Authenticates a user and returns access/refresh tokens.

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username": "district_admin_kol", "password": "Admin@123"}'
```

### 2. Get User Profile (Unified)
**GET** `/api/auth/profile`
Get detailed context-aware user profile (includes jurisdiction names).

```bash
curl -X GET http://localhost:5000/api/auth/profile \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

### 3. Refresh Token
**POST** `/api/auth/refresh`
Get new access token.

```bash
curl -X POST http://localhost:5000/api/auth/refresh \
  -H "Content-Type: application/json" \
  -d '{"refreshToken": "YOUR_REFRESH_TOKEN"}'
```

---

## 🏛️ District Admin API
**Role:** `district_admin`

### A. Waste Operations

#### 1. Get Statistics
**GET** `/api/district/waste-operations/stats`
Overall waste collection stats.

```bash
curl -X GET http://localhost:5000/api/district/waste-operations/stats \
  -H 'Authorization: Bearer YOUR_DISTRICT_ADMIN_TOKEN'
```

#### 2. Get Trends
**GET** `/api/district/waste-operations/trends`
Daily collection trends. Params: `days` (default 7).

```bash
curl -X GET "http://localhost:5000/api/district/waste-operations/trends?days=30" \
  -H 'Authorization: Bearer YOUR_DISTRICT_ADMIN_TOKEN'
```

#### 3. Get Summary
**GET** `/api/district/waste-operations/summary`
Block-wise summary. Params: `blockId`, `startDate`, `endDate`.

```bash
curl -X GET "http://localhost:5000/api/district/waste-operations/summary?startDate=2026-01-01" \
  -H 'Authorization: Bearer YOUR_DISTRICT_ADMIN_TOKEN'
```

### B. Reports & Analytics

#### 1. Collection Trends
**GET** `/api/district/reports/collection-trends`
Detailed breakdown. Params: `startDate`, `endDate`, `blockId`.

```bash
curl -X GET "http://localhost:5000/api/district/reports/collection-trends?startDate=2024-01-01" \
  -H 'Authorization: Bearer YOUR_DISTRICT_ADMIN_TOKEN'
```

#### 2. Waste Distribution
**GET** `/api/district/reports/waste-distribution`
Pie chart data.

```bash
curl -X GET http://localhost:5000/api/district/reports/waste-distribution \
  -H 'Authorization: Bearer YOUR_DISTRICT_ADMIN_TOKEN'
```

#### 3. Block Performance
**GET** `/api/district/reports/block-performance`
Comparative table of blocks.

```bash
curl -X GET http://localhost:5000/api/district/reports/block-performance \
  -H 'Authorization: Bearer YOUR_DISTRICT_ADMIN_TOKEN'
```

### C. Dump Yard Management

#### 1. Get List
**GET** `/api/district/dump-yard/list`
Paginated dump sites. Params: `page`, `status`, `search`.

```bash
curl -X GET "http://localhost:5000/api/district/dump-yard/list?status=critical" \
  -H 'Authorization: Bearer YOUR_DISTRICT_ADMIN_TOKEN'
```

#### 2. Get Stats
**GET** `/api/district/dump-yard/stats`
Dump yard capacity stats.

```bash
curl -X GET http://localhost:5000/api/district/dump-yard/stats \
  -H 'Authorization: Bearer YOUR_DISTRICT_ADMIN_TOKEN'
```

### D. Blocks & Municipalities

#### 1. Get List
**GET** `/api/district/blocks-municipalities/list`
List constituents. Params: `type` ('all', 'blocks', 'municipalities'), `search`.

```bash
curl -X GET "http://localhost:5000/api/district/blocks-municipalities/list?type=all" \
  -H 'Authorization: Bearer YOUR_DISTRICT_ADMIN_TOKEN'
```

---

## 🏘️ GP & Municipality API
**Roles:** `gp_admin`, `municipality_admin`

### A. Dashboard

#### 1. Get Overview
**GET** `/api/gp/dashboard/overview`
Main dashboard stats.

```bash
curl -X GET http://localhost:5000/api/gp/dashboard/overview \
  -H 'Authorization: Bearer YOUR_GP_ADMIN_TOKEN'
```

### B. Collector Management

#### 1. Get List
**GET** `/api/gp/collectors/list`
List collectors. Params: `search`, `page`.

```bash
curl -X GET "http://localhost:5000/api/gp/collectors/list?search=ram&page=1" \
  -H "Authorization: Bearer YOUR_GP_ADMIN_TOKEN"
```

#### 2. Add Collector
**POST** `/api/gp/collectors/add`
Add new collector.

```bash
curl -X POST http://localhost:5000/api/gp/collectors/add \
  -H "Authorization: Bearer YOUR_GP_ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": "New Collector",
    "username": "new_col",
    "password": "password123",
    "routeId": 1
  }'
```

#### 3. Update Collector
**PUT** `/api/gp/collectors/update/:id`
Update details.

```bash
curl -X PUT http://localhost:5000/api/gp/collectors/update/123 \
  -H "Authorization: Bearer YOUR_GP_ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"status": "on_leave"}'
```

### C. Collection Tracking

#### 1. Get Stats
**GET** `/api/gp/collection-tracking/stats`
Daily tracking summary. Params: `date`.

```bash
curl -X GET "http://localhost:5000/api/gp/collection-tracking/stats?date=2026-01-09" \
  -H "Authorization: Bearer YOUR_GP_ADMIN_TOKEN"
```

#### 2. Get Routes Progress
**GET** `/api/gp/collection-tracking/routes`
Route-wise completion. Params: `date`, `search`.

```bash
curl -X GET "http://localhost:5000/api/gp/collection-tracking/routes?date=2026-01-09" \
  -H "Authorization: Bearer YOUR_GP_ADMIN_TOKEN"
```

---

## 🧪 Test Users
*(Password for all: `pass1234` or `Admin@123` depending on environment setup)*

| Role | Username | Jurisdiction |
|------|----------|--------------|
| State Admin | `state_admin_wb` | West Bengal |
| District Admin | `district_admin_hooghly` | Hooghly |
| Block Admin | `block_admin_polba` | Polba-Dadpur |
| Municipality Admin | `mun_admin_bansberia` | Bansberia |
| GP Admin | `gp_admin_narendrapur` | Rajhat-Narendrapur |

---

## ⚠️ Error Codes
- `200`: Success
- `400`: Invalid Request (Check params/body)
- `401`: Unauthorized (Token missing/invalid)
- `403`: Forbidden (Wrong role for endpoint)
- `404`: Resource Not Found
- `500`: Server Error
