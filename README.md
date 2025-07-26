# 📚 HALO Dergisi

<div align="center">
  <img src="./apps/client/public/halo/halo-text.png" alt="HALO Dergisi Logo" width="300">
  
  **Edebiyatın Kalbi Burada**
  
  [![GitHub](https://img.shields.io/badge/GitHub-AydinTheFirst%2Fhaloidergisi-blue?style=for-the-badge&logo=github)](https://github.com/AydinTheFirst/haloidergisi)
  [![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)](./LICENSE)
  [![Node.js](https://img.shields.io/badge/Node.js-22.x-green?style=for-the-badge&logo=node.js)](https://nodejs.org/)
  [![TypeScript](https://img.shields.io/badge/TypeScript-100%25-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
</div>

## 🌟 Proje Hakkında

HALO Dergisi, Türk edebiyatının en taze seslerini buluşturan modern bir dijital dergi platformudur. Şiir, hikaye, deneme ve eleştiri yazılarıyla edebiyat dünyasına katkıda bulunmayı amaçlar.

### ✨ Özellikler

- 📖 **Dijital Dergi Okuma**: Modern ve kullanıcı dostu arayüz
- 💬 **Yorum Sistemi**: Okuyucuların etkileşime geçebileceği platform
- ⭐ **Beğeni ve Reaksiyon**: İçeriklere tepki verebilme
- 🔖 **Yer İmi**: Sevilen yazıları kaydetme
- 🏷️ **Kategori ve Etiket**: Organizasyonlu içerik yapısı
- 📱 **Responsive Tasarım**: Tüm cihazlarda mükemmel görünüm
- 🎨 **Modern UI/UX**: HeroUI ile şık tasarım
- 🔍 **Arama ve Filtreleme**: Gelişmiş içerik keşfi

## 🛠️ Teknoloji Yığını

### Frontend
- **React Router v7** - Modern routing ve SSR
- **TypeScript** - Tip güvenliği
- **Tailwind CSS** - Utility-first CSS framework
- **HeroUI** - Modern React bileşen kütüphanesi
- **GSAP** - Animasyonlar
- **Vite** - Hızlı geliştirme ortamı

### Backend
- **NestJS** - Scalable Node.js framework
- **Prisma** - Modern ORM
- **PostgreSQL** - Güvenilir veritabanı
- **TypeScript** - Full-stack tip güvenliği

### DevOps & Tools
- **Turborepo** - Monorepo yönetimi
- **pnpm** - Performanslı paket yöneticisi
- **ESLint & Prettier** - Kod kalitesi
- **Docker** - Konteynerleştirme

## 🚀 Kurulum ve Çalıştırma

### Gereksinimler
- Node.js 22.x
- pnpm 10.0.0
- PostgreSQL

### 1. Projeyi Klonlayın
```bash
git clone https://github.com/AydinTheFirst/haloidergisi.git
cd haloidergisi
```

### 2. Bağımlılıkları Yükleyin
```bash
pnpm install
```

### 3. Ortam Değişkenlerini Ayarlayın
```bash
# Kök dizinde .env dosyası oluşturun
cp .env.example .env
```

`.env` dosyasını düzenleyin:
```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/haloidergisi"

# JWT
JWT_SECRET="your-secret-key"

# CDN/Upload
UPLOAD_DIR="./uploads"
CDN_URL="http://localhost:3001"

# Other configurations
NODE_ENV="development"
```

### 4. Veritabanını Hazırlayın
```bash
# Server dizinine gidin
cd apps/server

# Prisma client'ı generate edin
pnpm db:generate

# Veritabanını oluşturun
pnpm db:push
```

### 5. Uygulamayı Çalıştırın

#### Geliştirme Modu
```bash
# Kök dizinden hem client hem server'ı çalıştır
pnpm dev
```

#### Ayrı Ayrı Çalıştırma
```bash
# Backend (Port: 3001)
cd apps/server
pnpm dev

# Frontend (Port: 5173)
cd apps/client
pnpm dev
```

#### Production Build
```bash
# Tüm projeyi build et
pnpm build

# Production'da çalıştır
pnpm start
```

## 📁 Proje Yapısı

```
haloidergisi/
├── apps/
│   ├── client/                 # React Router v7 Frontend
│   │   ├── src/
│   │   │   ├── components/     # Reusable components
│   │   │   ├── pages/          # Route pages
│   │   │   ├── lib/            # Utilities
│   │   │   ├── models/         # TypeScript types
│   │   │   ├── store/          # State management
│   │   │   └── assets/         # Static files
│   │   ├── public/             # Public assets
│   │   └── package.json
│   │
│   └── server/                 # NestJS Backend
│       ├── src/
│       │   ├── modules/        # Feature modules
│       │   ├── common/         # Shared utilities
│       │   ├── database/       # Database config
│       │   └── types/          # TypeScript types
│       ├── prisma/
│       │   └── schema.prisma   # Database schema
│       └── package.json
│
├── package.json                # Root package.json
├── turbo.json                  # Turborepo config
├── pnpm-workspace.yaml         # pnpm workspace config
└── README.md
```

## 🎯 Kullanım

### 🏠 Ana Sayfa
- Öne çıkan dergiler ve haberler
- Modern hero section
- Kategorilere göz atma

### 📖 Dergi Okuma
- Dijital dergi görüntüleme
- Beğeni ve yorum yapma
- Yer imi ekleme
- Sosyal paylaşım

### 💬 Yorum Sistemi
- Gerçek zamanlı yorumlar
- Nested (iç içe) yorum yapısı
- Moderasyon sistemi

### 🔍 Arama ve Keşif
- Gelişmiş arama
- Kategori ve etiket filtreleme
- İlgili içerik önerileri

## 🔧 Geliştirme

### Script'ler
```bash
# Geliştirme
pnpm dev                # Tüm uygulamaları dev modda çalıştır
pnpm build              # Production build
pnpm lint               # Linting
pnpm format             # Code formatting
pnpm check-types        # TypeScript type checking

# Veritabanı (server dizininde)
pnpm db:generate        # Prisma client generate
pnpm db:push            # Schema'yı veritabanına push et
pnpm db:studio          # Prisma Studio'yu aç
```

### Kod Kalitesi
- **ESLint**: Kod standartları
- **Prettier**: Kod formatı
- **TypeScript**: Tip güvenliği
- **Husky**: Git hooks (opsiyonel)

## 🤝 Katkıda Bulunma

1. Fork edin
2. Feature branch oluşturun (`git checkout -b feature/amazing-feature`)
3. Commit edin (`git commit -m 'Add some amazing feature'`)
4. Push edin (`git push origin feature/amazing-feature`)
5. Pull Request oluşturun

### Geliştirici Kuralları
- TypeScript kullanın
- ESLint kurallarına uyun
- Meaningful commit mesajları yazın
- Test yazın (gelecek güncellemelerde)

## 📝 API Dokümantasyonu

Backend API endpoints:

### Dergiler
- `GET /api/posts` - Tüm dergileri listele
- `GET /api/posts/:id` - Belirli dergiyi getir
- `POST /api/posts` - Yeni dergi oluştur (Admin)
- `PUT /api/posts/:id` - Dergi güncelle (Admin)
- `DELETE /api/posts/:id` - Dergi sil (Admin)

### Yorumlar
- `GET /api/posts/:postId/comments` - Dergi yorumlarını getir
- `POST /api/posts/:postId/comments` - Yorum ekle
- `PUT /api/comments/:id` - Yorum güncelle
- `DELETE /api/comments/:id` - Yorum sil

### Kategoriler
- `GET /api/categories` - Tüm kategoriler
- `POST /api/categories` - Kategori oluştur (Admin)

## 🔐 Güvenlik

- JWT tabanlı authentication
- Role-based authorization
- Input validation
- SQL injection koruması
- XSS koruması

## 📊 Performans

- Server-side rendering (SSR)
- Image optimization
- Lazy loading
- Code splitting
- CDN integration

## 🐛 Sorun Giderme

### Yaygın Sorunlar

**1. Port zaten kullanımda**
```bash
# Port'u kontrol edin
lsof -i :3001
lsof -i :5173

# Process'i sonlandırın
kill -9 <PID>
```

**2. Veritabanı bağlantı hatası**
- PostgreSQL'in çalıştığından emin olun
- DATABASE_URL'in doğru olduğunu kontrol edin
- Veritabanının oluşturulduğunu kontrol edin

**3. Prisma hatası**
```bash
cd apps/server
pnpm db:generate
pnpm db:push
```

**4. Build hatası**
```bash
# Cache'i temizle
pnpm clean
rm -rf node_modules
pnpm install
```

## 📱 Demo

Canlı demo: [https://haloidergisi.com](https://haloidergisi.com) (yakında)

## 📄 Lisans

Bu proje MIT lisansı altında lisanslanmıştır. Detaylar için [LICENSE](./LICENSE) dosyasına bakın.

## 👥 Katkıda Bulunanlar

<div align="center">
  <a href="https://github.com/AydinTheFirst/haloidergisi/graphs/contributors">
    <img src="https://contrib.rocks/image?repo=AydinTheFirst/haloidergisi" />
  </a>
</div>

## 📞 İletişim

- **Geliştirici**: [AydinTheFirst](https://github.com/AydinTheFirst)
- **Proje Linki**: [https://github.com/AydinTheFirst/haloidergisi](https://github.com/AydinTheFirst/haloidergisi)
- **Website**: [https://haloidergisi.com](https://haloidergisi.com)

---

