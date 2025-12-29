// ==================== INDEX PAGE JAVASCRIPT ====================
// Bu dosya ana sayfaya özel JavaScript kodlarını içerir

/**
 * Ana sayfada tüm haberleri göster
 * async function: Asenkron fonksiyon - API çağrısı yapacağız (await kullanabilmek için)
 */
async function loadLatestNews() {
    // try-catch: Hata yakalama bloğu - API hatası olursa catch'e düşer
    try {
        // API'den haberleri çek
        // fetch: Tarayıcının yerleşik HTTP isteği fonksiyonu
        // API_URL: auth.js dosyasında tanımlı (http://localhost:3000/api)
        // await: Asenkron işlemin tamamlanmasını bekler (Promise çözülene kadar)
        const response = await fetch(`${API_URL}/news`);
        
        // Response'u JSON formatına çevir
        // response.json(): Response objesini JavaScript objesine dönüştürür
        const news = await response.json();
        
        // Haberlerin gösterileceği HTML elementi
        // getElementById: ID'si 'latestNews' olan elementi bulur
        const newsContainer = document.getElementById('latestNews');
        
        // Container'ı temizle - önceki içeriği sil (yükleme göstergesini kaldır)
        // innerHTML: Elementin iç HTML içeriğini değiştirir
        newsContainer.innerHTML = '';
        
        // Eğer haber yoksa mesaj göster
        if (news.length === 0) {
            newsContainer.innerHTML = '<div class="col-12 text-center"><p>Henüz haber bulunmamaktadır.</p></div>';
            return; // Fonksiyondan çık
        }
        
        // Her haber için kart oluştur
        // forEach: Dizideki her öğe için fonksiyon çalıştırır
        news.forEach(item => {
            // item: Dizideki tek bir haber objesi (id, title, content, image vb.)
            
            // Yeni bir div elementi oluştur
            // createElement: Yeni HTML elementi oluşturur (henüz DOM'a eklenmedi)
            const card = document.createElement('div');
            
            // Bootstrap grid sınıfı ekle - her kart 4 kolon genişliğinde
            // className: Elementin CSS sınıflarını ayarlar
            // col-md-4: Orta ekranlarda 4 kolon (3 kart yan yana)
            card.className = 'col-md-4';
            
            // İçeriği kısalt (120 karakter)
            // Eğer içerik 120 karakterden uzunsa, ilk 120 karakteri al ve '...' ekle
            // substring(0, 120): String'in ilk 120 karakterini alır
            // Ternary operator (?:): Kısa if-else yapısı
            // Koşul ? doğruysa : yanlışsa
            const shortContent = item.content.length > 120 
                ? item.content.substring(0, 120) + '...' 
                : item.content;
            
            // Kartın HTML içeriğini oluştur
            // Template literal (backtick): Çok satırlı string ve değişken ekleme için
            // ${}: JavaScript değişkenini string içine ekler
            card.innerHTML = `
                <div class="card news-card h-100">
                    <img src="${item.image || 'images/news-1.jpg'}" class="card-img-top" alt="${item.title}">
                    <div class="card-body">
                        <h5 class="card-title">${item.title}</h5>
                        <p class="card-text">${shortContent}</p>
                        <a href="news-detail.html?id=${item.id}" target="_blank" class="btn btn-sm btn-outline-danger">Devamını Oku</a>
                    </div>
                </div>
            `;
            
            // Oluşturulan kartı container'a ekle
            // appendChild: Elementi başka bir elementin içine ekler (DOM'a eklenir)
            newsContainer.appendChild(card);
        });
    } catch (error) {
        // Hata durumunda
        // catch: try bloğunda hata olursa buraya gelir
        
        // Konsola hata yazdır (geliştirici için - F12 ile görülebilir)
        console.error('Haberler yüklenirken hata:', error);
        
        // Kullanıcıya hata mesajı göster
        // text-danger: Kırmızı metin (CSS'de maviye çevrilmiş)
        document.getElementById('latestNews').innerHTML = '<div class="col-12 text-center"><p class="text-danger">Haberler yüklenirken bir hata oluştu. Lütfen sunucunun çalıştığından emin olun.</p></div>';
    }
}

// Sayfa yüklendiğinde haberleri çek
// DOMContentLoaded: HTML yüklendiğinde çalışır (resimler yüklenmeden önce, daha hızlı)
document.addEventListener('DOMContentLoaded', function() {
    // addEventListener: Olay dinleyici ekler
    // 'DOMContentLoaded': Sayfa yüklendiğinde tetiklenen olay
    // function(): Olay olduğunda çalışacak fonksiyon
    
    loadLatestNews(); // Haberleri yükle
});

