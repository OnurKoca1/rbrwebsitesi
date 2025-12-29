// ==================== NEWS DETAIL PAGE JAVASCRIPT ====================
// Bu dosya haber detay sayfasına özel JavaScript kodlarını içerir

/**
 * URL'den haber ID'sini al
 * URL örneği: news-detail.html?id=1
 * @returns {string|null} Haber ID'si veya null
 */
function getNewsId() {
    // URLSearchParams: URL'deki query parametrelerini (id=1 gibi) okumak için
    // window.location.search: URL'deki ? işaretinden sonraki kısım (?id=1)
    const urlParams = new URLSearchParams(window.location.search);
    
    // get('id'): 'id' parametresinin değerini al
    return urlParams.get('id');
}

/**
 * Haber detayını API'den yükle ve göster
 * async function: Asenkron fonksiyon (API çağrısı için)
 */
async function loadNewsDetail() {
    // URL'den haber ID'sini al
    const newsId = getNewsId();
    
    // Eğer ID yoksa hata mesajı göster
    if (!newsId) {
        // innerHTML: Elementin iç HTML içeriğini değiştir
        document.getElementById('newsDetail').innerHTML = `
            <div class="alert alert-danger">
                <h4>Haber bulunamadı</h4>
                <p>Geçersiz haber ID'si.</p>
                <a href="news.html" class="btn btn-danger">Haberler Sayfasına Dön</a>
            </div>
        `;
        return;
    }
    
    // try-catch: Hata yakalama bloğu
    try {
        // API'den haber detayını çek
        // fetch: HTTP GET isteği
        // ${API_URL}/news/${newsId}: API endpoint (örn: http://localhost:3000/api/news/1)
        const response = await fetch(`${API_URL}/news/${newsId}`);
        
        // Eğer response başarısızsa (404, 500 vb.)
        if (!response.ok) {
            // throw: Hata fırlat (catch bloğuna düşer)
            throw new Error('Haber bulunamadı');
        }
        
        // Response'u JSON formatına çevir
        const news = await response.json();
        
        // Haber detayı container'ı
        const newsDetail = document.getElementById('newsDetail');
        
        // Haber detayı HTML'i
        newsDetail.innerHTML = `
            <div class="card border-0">
                <img src="${news.image || 'images/news-1.jpg'}" class="card-img-top news-detail-img" alt="${news.title}">
                <div class="card-body p-4">
                    <h1 class="card-title mb-4">${news.title}</h1>
                    <div class="card-text" style="line-height: 1.8; font-size: 1.1rem;">
                        ${news.content.split('\n').map(paragraph => `<p>${paragraph}</p>`).join('')}
                    </div>
                    <div class="mt-4">
                        <a href="news.html" class="btn btn-danger">
                            <i class="bi bi-arrow-left"></i> Haberlere Dön
                        </a>
                    </div>
                </div>
            </div>
        `;
    } catch (error) {
        // Hata durumunda
        // console.error: Konsola hata yazdır (F12 ile görülebilir)
        console.error('Haber yüklenirken hata:', error);
        
        // Hata mesajı göster
        document.getElementById('newsDetail').innerHTML = `
            <div class="alert alert-danger">
                <h4>Hata</h4>
                <p>Haber yüklenirken bir hata oluştu.</p>
                <a href="news.html" class="btn btn-danger">Haberler Sayfasına Dön</a>
            </div>
        `;
    }
}

// Sayfa yüklendiğinde haber detayını çek
// DOMContentLoaded: HTML yüklendiğinde çalışır
document.addEventListener('DOMContentLoaded', function() {
    loadNewsDetail();
});

