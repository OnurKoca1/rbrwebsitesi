# RedBull Racing Formula 1 Klon Web Sitesi

Bu proje, RedBull Racing Formula 1 takımının web sitesinin klonudur. **Dinamik** bir web uygulaması olarak geliştirilmiştir.

## Teknolojiler

### Frontend
- **HTML5**: Sayfa yapısı
- **CSS3**: Özel stiller ve animasyonlar
- **Bootstrap 5.3.0**: Responsive tasarım ve bileşenler
- **Bootstrap Icons**: İkonlar
- **JavaScript (Vanilla)**: API entegrasyonu ve dinamik içerik

### Backend
- **Python 3**: Sunucu tarafı programlama dili
- **Flask**: Web framework
- **Flask-CORS**: Cross-Origin Resource Sharing desteği
- **JSON**: Veri depolama (dosya tabanlı)

## Kurulum

### Gereksinimler
- Python 3.7 veya üzeri
- pip (Python paket yöneticisi)

### Adımlar

1. **Python sanal ortamı oluşturun (önerilir):**
```bash
python -m venv venv
```

2. **Sanal ortamı aktifleştirin:**
   - Windows:
   ```bash
   venv\Scripts\activate
   ```
   - Linux/Mac:
   ```bash
   source venv/bin/activate
   ```

3. **Bağımlılıkları yükleyin:**
```bash
pip install -r requirements.txt
```

4. **Sunucuyu başlatın:**
```bash
python app.py
```

5. **Tarayıcıda açın:**
```
http://localhost:3000
```

## API Endpoints

### Haberler
- `GET /api/news` - Tüm haberleri getir
- `GET /api/news/:id` - Belirli bir haberi getir
- `POST /api/news` - Yeni haber ekle
- `PUT /api/news/:id` - Haber güncelle
- `DELETE /api/news/:id` - Haber sil

### Ürünler
- `GET /api/products` - Tüm ürünleri getir
- `POST /api/products` - Yeni ürün ekle
- `PUT /api/products/:id` - Ürün güncelle
- `DELETE /api/products/:id` - Ürün sil

### Şampiyonluk Sıralaması
- `GET /api/standings` - Sürücüler ve takımlar şampiyonası
- `PUT /api/standings` - Şampiyonluk sıralamasını güncelle

### Kullanıcı İşlemleri
- `POST /api/register` - Yeni kullanıcı kaydı
- `POST /api/login` - Kullanıcı girişi

## Özellikler

### Dinamik İçerik
- Haberler API'den dinamik olarak yüklenir
- Ürünler API'den dinamik olarak yüklenir
- Şampiyonluk sıralamaları API'den çekilir ve admin panelinden yönetilir
- Admin paneli ile haber, ürün ve şampiyonluk sıralaması yönetimi

### Sayfalar
1. **Ana Sayfa (index.html)** - Hero section, son haberler, sürücü önizlemeleri
2. **Sürücüler (drivers.html)** - Max Verstappen ve Yuki Tsunoda biyografileri
3. **Haberler (news.html)** - Dinamik haber listesi (API'den)
4. **Sıralama (races.html)** - Şampiyonluk sıralamaları (dinamik)
5. **Mağaza (shop.html)** - Ürün listesi (dinamik)
6. **Sepetim (cart.html)** - Sepet yönetimi
7. **Profil (profile.html)** - Kullanıcı bilgileri
8. **Yönetim Paneli (admin.html)** - Haber, ürün ve şampiyonluk sıralaması yönetimi

## Veri Yapısı

Veriler `data/data.json` dosyasında saklanır:
- `news`: Haberler
- `products`: Ürünler
- `users`: Kullanıcılar
- `standings`: Şampiyonluk sıralamaları (sürücüler ve takımlar)

## Notlar

- Sunucu çalışırken API'ler aktif olur
- Veriler JSON dosyasında saklanır (production için veritabanı önerilir)
- Port 3000'de çalışır (değiştirmek için app.py'deki PORT değişkenini düzenleyin)
- Varsayılan admin kullanıcı: `admin` / `admin123`

## Lisans

Bu proje eğitim amaçlı geliştirilmiştir.
