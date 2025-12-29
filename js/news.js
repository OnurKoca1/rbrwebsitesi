// ==================== NEWS PAGE JAVASCRIPT ====================
// Bu dosya haberler sayfasına özel JavaScript kodlarını içerir

/**
 * API'den haberleri yükle ve göster
 * async function: Asenkron fonksiyon (await kullanabilmek için)
 */
async function loadNews() {
    // try-catch: Hata yakalama bloğu
    try {
        // fetch: HTTP GET isteği yap
        // API_URL: auth.js'de tanımlı (http://localhost:3000/api)
        // await: İstek tamamlanana kadar bekle
        const response = await fetch(`${API_URL}/news`);
        
        // response.json(): Response'u JavaScript objesine çevir
        const news = await response.json();
        
        // Haberlerin gösterileceği container
        const newsGrid = document.getElementById('newsGrid');
        
        // Container'ı temizle (yükleme göstergesini kaldır)
        newsGrid.innerHTML = '';
        
        // Eğer haber yoksa mesaj göster
        if (news.length === 0) {
            newsGrid.innerHTML = '<div class="col-12 text-center"><p>Henüz haber bulunmamaktadır.</p></div>';
            return; // Fonksiyondan çık
        }
        
        // Her haber için kart oluştur
        // forEach: Dizideki her öğe için fonksiyon çalıştır
        news.forEach(item => {
            // Yeni div elementi oluştur
            const card = document.createElement('div');
            
            // Bootstrap grid sınıfı: col-md-4 (orta ekranlarda 4 kolon = 3 kart yan yana)
            card.className = 'col-md-4';
            
            // İçeriği kısalt (150 karakter)
            // substring(0, 150): İlk 150 karakteri al
            // Ternary operator: Koşul ? doğruysa : yanlışsa
            const shortContent = item.content.length > 150 
                ? item.content.substring(0, 150) + '...' 
                : item.content;
            
            // Kartın HTML içeriğini oluştur
            // Template literal (backtick): Çok satırlı string
            // ${}: JavaScript değişkenini string içine ekle
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
            
            // Oluşturulan kartı grid'e ekle
            // appendChild: Elementi başka bir elementin içine ekler
            newsGrid.appendChild(card);
        });
    } catch (error) {
        // Hata durumunda
        // console.error: Konsola hata yazdır (F12 ile görülebilir)
        console.error('Haberler yüklenirken hata:', error);
        
        // Kullanıcıya hata mesajı göster
        // text-danger: Kırmızı metin (CSS'de maviye çevrilmiş)
        document.getElementById('newsGrid').innerHTML = '<div class="col-12 text-center"><p class="text-danger">Haberler yüklenirken bir hata oluştu. Lütfen sunucunun çalıştığından emin olun.</p></div>';
    }
}

// Sayfa yüklendiğinde haberleri çek
// DOMContentLoaded: HTML yüklendiğinde çalışır (resimler yüklenmeden önce)
// loadNews: Fonksiyon referansı (parantez yok, direkt çağrılmaz)
document.addEventListener('DOMContentLoaded', loadNews);

