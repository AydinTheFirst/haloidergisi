# 🤝 HALO Dergisi'ne Katkıda Bulunma Rehberi

HALO Dergisi projesine katkıda bulunmak istediğiniz için teşekkür ederiz! Bu rehber, projeye nasıl katkıda bulunabileceğinizi açıklar.

## 📋 İçindekiler

- [Kod Standartları](#kod-standartları)
- [Geliştirme Süreci](#geliştirme-süreci)
- [Issue ve Bug Raporlama](#issue-ve-bug-raporlama)
- [Pull Request Süreci](#pull-request-süreci)
- [Commit Mesaj Kuralları](#commit-mesaj-kuralları)
- [Proje Yapısı](#proje-yapısı)

## 💻 Kod Standartları

### TypeScript
- Tüm kod TypeScript ile yazılmalıdır
- `any` tipini kullanmaktan kaçının
- Interface ve type tanımlarını uygun şekilde kullanın
- Nullable değerler için optional chaining (`?.`) kullanın

### Kod Formatı
```bash
# Kod formatını kontrol edin
pnpm lint

# Otomatik düzeltme
pnpm format
```

### ESLint Kuralları
- ESLint kurallarına uygun kod yazın
- `console.log` kullanmaktan kaçının (development hariç)
- Unused variables bırakmayın
- Proper error handling yapın

### CSS/Styling
- Tailwind CSS utility classes kullanın
- Custom CSS gerektiğinde CSS Modules tercih edin
- Responsive tasarımı unutmayın
- Accessibility (a11y) kurallarına uyun

## 🔄 Geliştirme Süreci

### 1. Fork ve Clone
```bash
# Projeyi fork edin (GitHub'da)
# Clone edin
git clone https://github.com/YOUR_USERNAME/haloidergisi.git
cd haloidergisi
```

### 2. Branch Oluşturma
```bash
# Yeni feature branch oluşturun
git checkout -b feature/your-feature-name

# Bug fix için
git checkout -b fix/bug-description

# Documentation için
git checkout -b docs/improvement-description
```

### 3. Development Setup
```bash
# Dependencies install
pnpm install

# Environment setup
cp .env.example .env
# .env dosyasını düzenleyin

# Database setup
cd apps/server
pnpm db:generate
pnpm db:push

# Start development
cd ../..
pnpm dev
```

### 4. Testing
```bash
# Type checking
pnpm check-types

# Linting
pnpm lint

# Manual testing
# Frontend: http://localhost:5173
# Backend: http://localhost:3001
```

## 🐛 Issue ve Bug Raporlama

### Bug Report Template
```markdown
**Bug Açıklaması**
Kısa ve net bug açıklaması

**Tekrar Etme Adımları**
1. '...' sayfasına git
2. '...' butonuna tıkla
3. Hata oluşuyor

**Beklenen Davranış**
Ne olması gerektiğini açıklayın

**Ekran Görüntüsü**
Mümkünse ekran görüntüsü ekleyin

**Ortam Bilgileri**
- OS: [e.g. macOS, Windows, Linux]
- Browser: [e.g. Chrome, Safari, Firefox]
- Node.js: [e.g. 22.0.0]
```

### Feature Request Template
```markdown
**Özellik Açıklaması**
Yeni özelliğin net açıklaması

**Motivasyon**
Bu özellik neden gerekli?

**Çözüm Önerisi**
Nasıl implement edilebilir?

**Alternatifler**
Başka hangi çözümler düşünüldü?
```

## 🔀 Pull Request Süreci

### PR Checklist
- [ ] Kod TypeScript standartlarına uygun
- [ ] ESLint kurallarına uygun
- [ ] Test edildi (manual)
- [ ] Documentation güncellendi (gerekirse)
- [ ] Commit mesajları kurallara uygun
- [ ] Conflict yok
- [ ] Meaningful PR title ve description

### PR Template
```markdown
## 📝 Açıklama
Bu PR'da yapılan değişikliklerin açıklaması

## 🎯 Tip
- [ ] Bug fix
- [ ] New feature
- [ ] Documentation
- [ ] Refactoring
- [ ] Performance improvement

## 🧪 Test Edilenler
- [ ] Frontend çalışıyor
- [ ] Backend API'ler çalışıyor
- [ ] Responsive tasarım
- [ ] Error handling

## 📸 Ekran Görüntüleri
Değişikliklerin ekran görüntüsü (UI değişikliği varsa)

## 📋 İlgili Issue
Closes #issue_number
```

## 💬 Commit Mesaj Kuralları

### Format
```
type(scope): description

[optional body]

[optional footer]
```

### Types
- `feat`: Yeni özellik
- `fix`: Bug fix
- `docs`: Documentation
- `style`: Formatla ilgili (kod anlamını değiştirmeyen)
- `refactor`: Refactoring
- `perf`: Performance improvement
- `test`: Test ekleme/güncelleme
- `chore`: Build, dependencies, etc.

### Örnekler
```bash
feat(auth): add user login functionality
fix(posts): resolve pagination bug
docs(readme): update installation guide
style(header): improve mobile navigation
refactor(api): extract user service
perf(images): optimize image loading
test(utils): add unit tests for date helpers
chore(deps): update dependencies
```

### Scope'lar
- `auth`: Authentication/Authorization
- `posts`: Post/Article related
- `comments`: Comment system
- `ui`: UI components
- `api`: Backend API
- `db`: Database related
- `config`: Configuration
- `docs`: Documentation

## 🏗️ Proje Yapısı

### Frontend (apps/client)
```
src/
├── components/          # Reusable components
│   ├── ui/             # Basic UI components
│   └── features/       # Feature-specific components
├── pages/              # Route pages
│   ├── (auth)/         # Auth pages
│   ├── (landing)/      # Public pages
│   └── dashboard/      # Admin dashboard
├── lib/                # Utilities
├── models/             # TypeScript types
├── store/              # State management
└── assets/             # Static assets
```

### Backend (apps/server)
```
src/
├── modules/            # Feature modules
│   ├── auth/
│   ├── posts/
│   ├── comments/
│   └── users/
├── common/             # Shared utilities
│   ├── decorators/
│   ├── filters/
│   ├── guards/
│   └── interceptors/
├── database/           # Database configuration
└── types/              # TypeScript types
```

## 🔍 Code Review Süreci

### Reviewer Checklist
- [ ] Kod okunabilir ve anlaşılır
- [ ] TypeScript best practices
- [ ] Security açıkları yok
- [ ] Performance uygun
- [ ] Error handling doğru
- [ ] Documentation yeterli

### Review Comments
- Constructive ve helpful olun
- Kod örnekleri verin
- Reasoning açıklayın
- Compliment de verin

## 🚀 Release Süreci

### Version Numbering
- Major: Breaking changes (1.0.0 -> 2.0.0)
- Minor: New features (1.0.0 -> 1.1.0)
- Patch: Bug fixes (1.0.0 -> 1.0.1)

### Release Checklist
- [ ] Tüm testler geçiyor
- [ ] Documentation güncel
- [ ] CHANGELOG.md güncellendi
- [ ] Version number güncellendi
- [ ] Git tag oluşturuldu

## 🎨 UI/UX Guidelines

### Design Principles
- **Minimal**: Sade ve temiz tasarım
- **Accessible**: Tüm kullanıcılar için erişilebilir
- **Responsive**: Tüm cihazlarda çalışır
- **Consistent**: Tutarlı design language

### Color Palette
- Primary: Yellow/Orange gradients
- Secondary: Gray tones
- Success: Green
- Error: Red
- Warning: Orange

### Typography
- Headers: Bold, large
- Body: Readable, moderate size
- Code: Monospace font

## ❓ Sık Sorulan Sorular

**Q: Hangi IDE kullanmalıyım?**
A: VS Code öneriyoruz. Gerekli extension'lar için workspace settings mevcut.

**Q: Test yazmak zorunlu mu?**
A: Şu anda zorunlu değil ama gelecekte eklenecek.

**Q: Database schema değişikliği nasıl yapılır?**
A: Prisma schema dosyasını güncelleyin ve `pnpm db:push` çalıştırın.

**Q: Production deploy nasıl yapılır?**
A: Şu anda manual deploy. CI/CD gelecekte eklenecek.

## 📞 Yardım ve İletişim

- **GitHub Issues**: Bug ve feature request için
- **GitHub Discussions**: Genel sorular için
- **Email**: aydin@example.com (project maintainer)

## 🏆 Teşekkürler

Katkıda bulunan herkese teşekkür ederiz! 

- İlk kez katkıda bulunuyorsanız, çekinmeyin
- Küçük katkılar da çok değerlidir
- Sorularınızı sormaktan çekinmeyin

---

**Happy Coding! 🚀**
