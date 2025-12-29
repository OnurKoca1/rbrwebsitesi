async function loadNewsDetail() {
    const newsId = new URLSearchParams(window.location.search).get('id');
    const newsDetail = document.getElementById('newsDetail');
    
    if (!newsId) {
        newsDetail.innerHTML = `
            <div class="alert alert-danger">
                <h4>Haber bulunamadı</h4>
                <p>Geçersiz haber ID'si.</p>
                <a href="news.html" class="btn btn-primary">Haberler Sayfasına Dön</a>
            </div>
        `;
        return;
    }
    
    try {
        const news = await fetchData(`/news/${newsId}`);
        newsDetail.innerHTML = `
            <div class="card border-0">
                <img src="${news.image || 'images/news-1.jpg'}" class="card-img-top news-detail-img" alt="${news.title}">
                <div class="card-body p-4">
                    <h1 class="card-title mb-4">${news.title}</h1>
                    <div class="card-text" style="line-height: 1.8; font-size: 1.1rem;">
                        ${news.content.split('\n').map(p => `<p>${p}</p>`).join('')}
                    </div>
                    <div class="mt-4">
                        <a href="news.html" class="btn btn-primary">
                            <i class="bi bi-arrow-left"></i> Haberlere Dön
                        </a>
                    </div>
                </div>
            </div>
        `;
    } catch (error) {
        console.error('Haber yüklenirken hata:', error);
        newsDetail.innerHTML = `
            <div class="alert alert-danger">
                <h4>Hata</h4>
                <p>Haber yüklenirken bir hata oluştu.</p>
                <a href="news.html" class="btn btn-primary">Haberler Sayfasına Dön</a>
            </div>
        `;
    }
}

document.addEventListener('DOMContentLoaded', loadNewsDetail);
