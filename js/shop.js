// ==================== SHOP PAGE JAVASCRIPT ====================
// Bu dosya mağaza sayfasına özel JavaScript kodlarını içerir

/**
 * API'den ürünleri yükle ve göster
 * async function: Asenkron fonksiyon (API çağrısı için)
 */
async function loadProducts() {
    try {
        // API'den ürünleri çek
        // fetch: HTTP GET isteği
        // await: İstek tamamlanana kadar bekle
        const response = await fetch(`${API_URL}/products`);
        
        // JSON formatındaki yanıtı JavaScript objesine çevir
        const products = await response.json();
        
        // Ürünlerin gösterileceği container
        const productGrid = document.getElementById('productGrid');
        
        // Container'ı temizle
        productGrid.innerHTML = '';
        
        // Eğer ürün yoksa mesaj göster
        if (products.length === 0) {
            productGrid.innerHTML = '<div class="col-12 text-center"><p>Henüz ürün bulunmamaktadır.</p></div>';
            return;
        }
        
        // Her ürün için kart oluştur
        products.forEach(product => {
            // Yeni div elementi oluştur
            const card = document.createElement('div');
            
            // Bootstrap grid sınıfları:
            // col-md-6: Orta ekranlarda (≥768px) 6 kolon (2 kart yan yana)
            // col-lg-4: Büyük ekranlarda (≥992px) 4 kolon (3 kart yan yana)
            card.className = 'col-md-6 col-lg-4';
            
            // Kartın HTML içeriğini oluştur
            card.innerHTML = `
                <div class="card product-card h-100">
                    <img src="${product.image || 'images/product-default.jpg'}" class="card-img-top" alt="${product.name}">
                    <div class="card-body">
                        <h5 class="card-title">${product.name}</h5>
                        <p class="card-text">${product.description || ''}</p>
                        <div class="d-flex justify-content-between align-items-center">
                            <span class="product-price">₺${product.price}</span>
                            <button class="btn btn-danger btn-sm add-to-cart-btn">
                                <i class="bi bi-cart-plus"></i> Sepete Ekle
                            </button>
                        </div>
                    </div>
                </div>
            `;
            
            // Kartı grid'e ekle
            productGrid.appendChild(card);
        });
        
        // Sepete ekle butonlarına event listener ekle
        // querySelectorAll: Tüm eşleşen elementleri bulur
        // forEach: Her buton için fonksiyon çalıştır
        document.querySelectorAll('.add-to-cart-btn').forEach((button, index) => {
            // addEventListener: Olay dinleyici ekle
            // 'click': Tıklama olayı
            button.addEventListener('click', function() {
                // products[index]: Bu butona ait ürün
                const product = products[index];
                
                // closest('.card'): En yakın .card elementi (ürün kartı)
                const productCard = this.closest('.card');
                
                // querySelector('.card-title'): Kart içindeki başlığı bul
                // textContent: Elementin metin içeriğini al
                const productName = productCard.querySelector('.card-title').textContent;
                const productPrice = productCard.querySelector('.product-price').textContent;
                
                // Sepeti localStorage'dan al
                // localStorage.getItem: Belirtilen key'in değerini alır
                // || '[]': Eğer yoksa boş dizi string'i kullan
                // JSON.parse: String'i JavaScript dizisine çevir
                let cart = JSON.parse(localStorage.getItem('cart') || '[]');
                
                // Ürün zaten sepette var mı kontrol et
                // find: Dizide ID'si eşleşen öğeyi bulur
                const existingItem = cart.find(item => item.id === product.id);
                
                if (existingItem) {
                    // Ürün sepette varsa miktarını artır
                    existingItem.quantity += 1;
                } else {
                    // Ürün sepette yoksa yeni ekle
                    cart.push({
                        id: product.id,
                        name: product.name,
                        price: product.price,
                        image: product.image || 'images/product-default.jpg',
                        description: product.description || '',
                        quantity: 1 // Başlangıç miktarı
                    });
                }
                
                // Sepeti localStorage'a kaydet
                // JSON.stringify: JavaScript objesini JSON string'e çevir
                localStorage.setItem('cart', JSON.stringify(cart));
                
                // Başarı mesajı göster
                // createElement: Yeni div elementi oluştur
                const alert = document.createElement('div');
                
                // Bootstrap alert sınıfları:
                // alert: Alert bileşeni
                // alert-success: Yeşil renk (başarı)
                // alert-dismissible: Kapatılabilir
                // fade: Fade animasyonu
                // show: Göster
                // position-fixed: Sabit konum
                // top-0: Üstten 0
                // start-50: Soldan %50
                // translate-middle-x: X ekseninde ortala
                // mt-5: Margin top 5 birim
                alert.className = 'alert alert-success alert-dismissible fade show position-fixed top-0 start-50 translate-middle-x mt-5';
                
                // z-index: 9999 - Diğer elementlerin üstünde görün
                alert.style.zIndex = '9999';
                
                // Alert içeriği
                // btn-close: Bootstrap kapatma butonu
                // data-bs-dismiss="alert": Alert'i kapat
                alert.innerHTML = `<strong>Başarılı!</strong> ${productName} sepete eklendi (${productPrice}). <button type="button" class="btn-close" data-bs-dismiss="alert"></button>`;
                
                // Alert'i sayfaya ekle
                document.body.appendChild(alert);
                
                // 3 saniye sonra alert'i kaldır
                setTimeout(() => {
                    alert.remove();
                }, 3000);
            });
        });
    } catch (error) {
        // Hata durumunda
        console.error('Ürünler yüklenirken hata:', error);
        document.getElementById('productGrid').innerHTML = '<div class="col-12 text-center"><p class="text-danger">Ürünler yüklenirken bir hata oluştu. Lütfen sunucunun çalıştığından emin olun.</p></div>';
    }
}

// Sayfa yüklendiğinde ürünleri çek
// DOMContentLoaded: HTML yüklendiğinde çalışır
document.addEventListener('DOMContentLoaded', function() {
    loadProducts();
});

