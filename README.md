# 📚 Dijital Kitaplığım

Modern ve kullanıcı dostu bir web tabanlı kitaplık uygulaması. Binlerce kitabınızı kolayca arayabilir, yazarlara göre gruplandırabilir ve türlerine göre filtreleyebilirsiniz.

## 🚀 Canlı Demo

**[🌐 Canlı Demo - GitHub Pages](https://mesut-outlook.github.io/digital-kitapligim/)**

*49,873 kitaplık gerçek koleksiyon ile çalışır!*

## ✨ Özellikler

### 🔍 Güçlü Arama
- Kitap adı, yazar ve türe göre anlık arama
- Akıllı arama önerileri
- Temizle butonu ile hızlı sıfırlama
- Klavye kısayolu (Ctrl+K)

### 👥 Yazar Gruplandırma
- Yazarları kitap sayısına göre sıralama
- Her yazarın türlerini görüntüleme
- Yazara tıklayarak kitaplarını filtreleme

### 🏷️ Tür Filtreleme
- Tüm türleri dropdown menüden seçebilme
- Gerçek zamanlı filtreleme
- Kategori bazlı görüntüleme

### 📱 Responsive Tasarım
- Mobil cihazlar için optimize edilmiş
- Tablet ve masaüstü uyumlu
- Modern ve şık görünüm

### 🎨 Görsel Özellikler
- Grid ve Liste görünümü seçenekleri
- Renkli gradyan kitap kapakları
- Smooth animasyonlar
- Dark mode desteği

### ⚡ Performans
- Infinite scroll ile hızlı yükleme
- Debounced arama (300ms)
- Virtual scrolling büyük veri setleri için
- Optimized rendering

## 🚀 Kurulum

### 🌐 Hızlı Kullanım (Önerilen)
**[Canlı Demo'yu ziyaret edin](https://mesut-outlook.github.io/digital-kitapligim/)** - Kurulum gerektirmez!

### 💻 Yerel Kurulum
1. Repository'yi klonlayın:
```bash
git clone https://github.com/Mesut-Outlook/digital-kitapligim.git
cd digital-kitapligim
```

2. **Büyük dosyalar için Git LFS gerekli:**
```bash
git lfs pull
```

3. Web sunucusunu başlatın:
```bash
python -m http.server 8000
```

4. Tarayıcınızda `http://localhost:8000` adresine gidin

### 📝 Kendi Veritabanınızı Kullanma
- Mevcut `Harddisk_Kutuphanesi.csv` dosyasını kendi CSV'nizle değiştirin
- Aynı format yapısını kullanın (aşağıya bakın)

### CSV Dosya Formatı
Kitap verileri `Harddisk_Kutuphanesi.csv` dosyasında aşağıdaki formatta olmalıdır:

### CSV Dosya Formatı
Kitap verileri `Harddisk_Kutuphanesi.csv` dosyasında aşağıdaki formatta olmalıdır:

```csv
title,author,fileName,fileExtension,filePath,addedDate
Suç ve Ceza,Fyodor Dostoyevski,Fyodor Dostoyevski - Suç ve Ceza.epub,epub,E:\Kitaplar\Fyodor Dostoyevski - Suç ve Ceza.epub,2025-01-15T10:30:00.000000
1984,George Orwell,George Orwell - 1984.pdf,pdf,E:\Kitaplar\George Orwell - 1984.pdf,2025-01-15T10:31:00.000000
```

**Gerekli Sütunlar:**
- `title` - Kitap adı
- `author` - Yazar adı
- `fileName` - Dosya adı
- `fileExtension` - Dosya uzantısı (pdf, epub, mobi, txt vb.)
- `filePath` - Tam dosya yolu
- `addedDate` - Eklenme tarihi (ISO format)

### 🔧 Git LFS Hakkında
Bu proje büyük veritabanı dosyası için **Git LFS (Large File Storage)** kullanır:
- Büyük dosyalar Git geçmişini şişirmez
- Daha hızlı clone ve pull işlemleri
- GitHub'ın 100MB dosya limitini aşma imkanı
- Otomatik olarak büyük dosyalar yönetilir

**Not:** Repository'yi klonladıktan sonra `git lfs pull` komutunu çalıştırmanız gerekebilir.

### Klavye Kısayolları
- `Ctrl+K` - Arama kutusuna odaklan
- `Esc` - Modal'ı kapat

## 📁 Dosya Yapısı

```
📦 Kitablik/
├── 📄 index.html          # Ana HTML dosyası
├── 🎨 styles.css          # CSS stilleri
├── ⚡ script.js           # JavaScript fonksiyonları
├── 📊 kitaplar.csv        # Kitap veritabanı
└── 📖 README.md           # Dokümantasyon
```

## 🛠️ Teknik Detaylar

### Kullanılan Teknolojiler
- **HTML5** - Modern semantic markup
- **CSS3** - CSS Grid, Flexbox, Custom Properties
- **Vanilla JavaScript** - ES6+ features
- **Font Awesome** - İkonlar
- **Google Fonts** - Inter font ailesi

### CSS Özellikleri
- CSS Custom Properties (CSS Variables)
- CSS Grid ve Flexbox layout
- Responsive design breakpoints
- Smooth transitions ve animations
- Modern gradients ve shadows

### JavaScript Özellikleri
- ES6+ syntax (arrow functions, template literals, destructuring)
- Asenkron CSV yükleme
- Debounced search
- Intersection Observer API
- Event delegation
- Local storage desteği (gelecek sürüm)

## 📊 Canlı İstatistikler

Bu repository **gerçek bir kitap koleksiyonu** içerir:
- ✅ **49,873 kitap** (Git LFS ile)
- ✅ Binlerce yazar
- ✅ 20+ akıllı kategori
- ✅ 10.8 MB veritabanı
- ✅ Türkçe karakter desteği
- ✅ Tam dosya yolları

### 📁 Veritabanı Detayları
- **Dosya:** `Harddisk_Kutuphanesi.csv`
- **Boyut:** 10.8 MB
- **Format:** CSV (UTF-8)
- **Depolama:** Git LFS (Large File Storage)
- **Erişim:** Doğrudan web'den yüklenebilir

## 🎯 Özellikler Detayı

### 📁 Dosya Yolu Yönetimi
- Kitapların tam dosya yollarını gösterir
- Dosya yolunu tek tıkla kopyalama
- Klasör açma yardımcısı
- Windows Explorer komutları

### 🔍 Gelişmiş Arama
- Başlık, yazar ve türe göre arama
- Gerçek zamanlı filtreleme
- Akıllı öneriler
- Klavye kısayolları (Ctrl+K)

## 🎯 Gelecek Özellikler

- [ ] Favori kitaplar listesi
- [ ] Kitap okuma durumu takibi
- [ ] Export/Import işlemleri
- [ ] Kitap kapağı görselleri
- [ ] Gelişmiş filtreleme
- [ ] Yazar detay sayfaları
- [ ] İstatistik dashboard'u
- [ ] Offline çalışma desteği

## 🤝 Katkıda Bulunma

Bu proje açık kaynak kodludur ve katkılarınızı memnuniyetle karşılarız!

### Katkı Süreci:
1. Bu repository'yi fork edin
2. Yeni bir branch oluşturun (`git checkout -b feature/amazing-feature`)
3. Değişikliklerinizi commit edin (`git commit -m 'Add amazing feature'`)
4. Branch'inizi push edin (`git push origin feature/amazing-feature`)
5. Pull Request oluşturun

### Geliştirme İpuçları:
- `index.html` - Ana sayfa yapısı
- `styles.css` - Tüm stiller ve animasyonlar
- `script.js` - Uygulama mantığı ve API'ler
- `sample_kitaplar.csv` - Örnek veri formatı

## 📞 Destek

Herhangi bir sorun yaşarsanız:
1. Tarayıcı konsolunu kontrol edin (F12)
2. CSV dosyasının doğru formatta olduğundan emin olun
3. Modern bir tarayıcı kullandığınızdan emin olun

## 📝 Lisans

Bu proje MIT lisansı altında lisanslanmıştır.

---

**Keyifli okumalar! 📚✨**