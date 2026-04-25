# Deployment Guide — Multi-Domain Single Server

## Tổng quan kiến trúc

Một server chạy nhiều website, mỗi website có FE + BE + DB riêng biệt hoàn toàn.

```
Internet
    │  (ports 80/443)
    ▼
┌─────────────────────────────────────────┐
│  proxy_nginx  (Docker container)        │
│  - SSL termination (Let's Encrypt)      │
│  - Route theo domain name               │
└────────────┬────────────────────────────┘
             │ Docker network: web
    ┌────────┴────────┐
    │                 │
phukien_frontend   binhminh_frontend
    │                 │
    │ phukien_        │ binhminh_
    │ internal        │ internal
    │                 │
phukien_backend    binhminh_backend
    │                 │
MongoDB Atlas 1    MongoDB Atlas 2
```

**Nguyên tắc cô lập:**
- `web` network: chỉ nginx proxy ↔ các frontend container
- `*_internal` network: frontend ↔ backend của cùng project (không xuyên project)
- Backend không bao giờ expose port ra host

---

## Cấu trúc thư mục trên server

```
/root/
├── proxy/                          # Nginx reverse proxy + Certbot
│   ├── docker-compose.yml
│   └── nginx/
│       └── conf.d/
│           ├── phukienquathoinuoc.com.conf
│           └── binhminhsmartwatch.com.conf
│
├── dienlanhecomerce/               # Project 1: phukienquathoinuoc.com
│   ├── docker-compose.yml
│   ├── backend/
│   │   └── .env.production         # KHÔNG commit — tạo thủ công
│   └── frontend/
│
└── binhminhsmartwatch/             # Project 2: binhminhsmartwatch.com
    ├── docker-compose.yml          # Tạo thủ công (xem bên dưới)
    ├── backend/
    │   └── .env.production         # KHÔNG commit — tạo thủ công
    └── frontend/
```

---

## Proxy setup (`/root/proxy/`)

### docker-compose.yml

```yaml
version: "3.8"

services:
  nginx:
    image: nginx:alpine
    container_name: proxy_nginx
    restart: always
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx/conf.d:/etc/nginx/conf.d:ro
      - certbot_certs:/etc/letsencrypt:ro
      - certbot_www:/var/www/certbot
    networks:
      - web

  certbot:
    image: certbot/certbot
    container_name: proxy_certbot
    volumes:
      - certbot_certs:/etc/letsencrypt
      - certbot_www:/var/www/certbot
    entrypoint: "/bin/sh -c 'trap exit TERM; while :; do certbot renew --webroot -w /var/www/certbot --quiet; sleep 12h & wait $${!}; done;'"

volumes:
  certbot_certs:
  certbot_www:

networks:
  web:
    external: true
```

### nginx/conf.d/phukienquathoinuoc.com.conf

```nginx
server {
    listen 80;
    server_name phukienquathoinuoc.com www.phukienquathoinuoc.com;
    location /.well-known/acme-challenge/ { root /var/www/certbot; }
    location / { return 301 https://$host$request_uri; }
}

server {
    listen 443 ssl;
    server_name phukienquathoinuoc.com www.phukienquathoinuoc.com;

    ssl_certificate /etc/letsencrypt/live/phukienquathoinuoc.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/phukienquathoinuoc.com/privkey.pem;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    client_max_body_size 20M;

    location / {
        resolver 127.0.0.11 valid=10s;   # Docker internal DNS — lazy resolve
        set $upstream phukien_frontend;
        proxy_pass http://$upstream:80;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto https;
    }
}
```

> Dùng `resolver 127.0.0.11` + `set $upstream` để nginx không crash khi container chưa online.
> Copy file này, đổi domain + container name để thêm website mới.

---

## Project docker-compose.yml

### Project 1 (`/root/dienlanhecomerce/docker-compose.yml`)

```yaml
version: "3.8"

services:
  backend:
    build: ./backend
    container_name: phukien_backend
    restart: always
    env_file:
      - ./backend/.env.production
    environment:
      - PORT=5000
    networks:
      - internal           # chỉ internal, không expose ra web

  frontend:
    build: ./frontend
    container_name: phukien_frontend
    restart: always
    depends_on:
      - backend
    networks:
      - web                # nginx proxy truy cập qua đây
      - internal           # gọi backend bằng tên service "backend"

networks:
  web:
    external: true         # shared network với proxy_nginx
  internal:
    name: phukien_internal # isolated — không xuyên sang project khác
```

### Project 2 (`/root/binhminhsmartwatch/docker-compose.yml`)

Giống project 1, chỉ đổi prefix `phukien` → `binhminh`:

```yaml
version: "3.8"

services:
  backend:
    build: ./backend
    container_name: binhminh_backend
    restart: always
    env_file:
      - ./backend/.env.production
    environment:
      - PORT=5000
    networks:
      - internal

  frontend:
    build: ./frontend
    container_name: binhminh_frontend
    restart: always
    depends_on:
      - backend
    networks:
      - web
      - internal

networks:
  web:
    external: true
  internal:
    name: binhminh_internal
```

---

## Deploy lần đầu (server mới)

```bash
# 1. Cài Docker
curl -fsSL https://get.docker.com | sh

# 2. Tạo shared network
docker network create web

# 3. Clone proxy config
mkdir -p /root/proxy/nginx/conf.d
# Tạo docker-compose.yml và nginx configs (xem phần trên)

# 4. Start nginx với HTTP only (để lấy SSL cert)
cd /root/proxy && docker compose up -d nginx

# 5. Lấy SSL cert
docker run --rm \
  -v proxy_certbot_certs:/etc/letsencrypt \
  -v proxy_certbot_www:/var/www/certbot \
  certbot/certbot certonly \
  --webroot -w /var/www/certbot \
  --email YOUR_EMAIL \
  --agree-tos --no-eff-email \
  -d yourdomain.com -d www.yourdomain.com

# 6. Cập nhật nginx config với HTTPS, reload
docker exec proxy_nginx nginx -s reload

# 7. Start certbot auto-renew
docker compose up -d certbot

# 8. Clone và deploy từng project
git clone <repo> /root/<project-name>
# Tạo /root/<project-name>/backend/.env.production
cd /root/<project-name> && docker compose up -d --build
```

---

## Deploy code mới

```bash
# Project 1
cd /root/dienlanhecomerce
git pull origin main
docker compose up -d --build

# Project 2
cd /root/binhminhsmartwatch
git pull origin main
docker compose up -d --build
```

---

## Thêm website mới

1. **Clone/tạo project** vào `/root/<tên-project>/`
2. **Tạo `docker-compose.yml`** — đổi prefix container và network name
3. **Tạo `backend/.env.production`** — set `MONGODB_URI` riêng
4. **Lấy SSL cert** cho domain mới (bước 5 ở trên)
5. **Thêm nginx config** vào `/root/proxy/nginx/conf.d/<domain>.conf`
6. **Reload nginx:** `docker exec proxy_nginx nginx -s reload`
7. **Start project:** `docker compose up -d --build`

---

## Kiểm tra hệ thống

```bash
# Xem tất cả containers
docker ps

# Xem networks
docker network ls

# Logs project 1
cd /root/dienlanhecomerce && docker compose logs -f

# Test HTTPS
curl -sk https://phukienquathoinuoc.com/ | head -5
curl -sk https://binhminhsmartwatch.com/ | head -5

# Kiểm tra SSL cert còn hạn bao lâu
docker run --rm -v proxy_certbot_certs:/etc/letsencrypt certbot/certbot certificates
```

---

## backend/.env.production — các biến cần thiết

```env
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb+srv://<user>:<pass>@<cluster>.mongodb.net/<dbname>
JWT_SECRET=<secret>
JWT_EXPIRE=1y
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=
SMTP_PASS=
ADMIN_EMAIL=
ADMIN_PASSWORD=
GA4_PROPERTY_ID=
```
