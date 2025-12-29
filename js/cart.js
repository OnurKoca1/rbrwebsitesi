// ==================== CART PAGE JAVASCRIPT ====================
// Bu dosya sepet sayfasına özel JavaScript kodlarını içerir

/**
 * Sepeti localStorage'dan yükle ve göster
 * localStorage: Tarayıcıda veri saklama (tarayıcı kapanınca da kalır)
 */
function loadCart() {
    // localStorage'dan sepeti al
    // getItem('cart'): 'cart' key'ine sahip değeri al
    // || '[]': Eğer yoksa boş dizi string'i kullan
    // JSON.parse: String'i JavaScript dizisine çevir
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    
    // Sepet içeriğinin gösterileceği element
    const cartContent = document.getElementById('cartContent');
    
    // Eğer sepet boşsa mesaj göster
    if (cart.length === 0) {
        // innerHTML: Elementin iç HTML içeriğini değiştir
        cartContent.innerHTML = `
            <div class="text-center py-5">
                <h4 class="mb-3">Sepetiniz boş</h4>
                <a href="shop.html" class="btn text-white" style="background-color: #0d6efd;">Mağazaya Git</a>
            </div>
        `;
        return; // Fonksiyondan çık
    }
    
    // Toplam fiyat değişkeni
    let total = 0;
    
    // HTML string'i başlat
    // row: Bootstrap grid satırı
    // col-lg-8: Büyük ekranlarda 8 kolon (sepet listesi için)
    let cartHTML = `
        <div class="row">
            <div class="col-lg-8">
    `;
    
    // Her ürün için kart oluştur
    // forEach: Dizideki her öğe için fonksiyon çalıştır
    // index: Dizideki konum (0, 1, 2, ...)
    cart.forEach((item, index) => {
        // Ürün toplam fiyatı = fiyat × miktar
        const itemTotal = item.price * item.quantity;
        
        // Genel toplama ekle
        total += itemTotal;
        
        // Ürün kartı HTML'i
        cartHTML += `
            <div class="card mb-3">
                <div class="card-body">
                    <div class="row align-items-center">
                        <div class="col-md-2">
                            <img src="${item.image || 'images/product-default.jpg'}" class="img-fluid rounded" alt="${item.name}" style="max-height: 80px; object-fit: contain;">
                        </div>
                        <div class="col-md-4">
                            <h6 class="mb-0">${item.name}</h6>
                        </div>
                        <div class="col-md-2">
                            <input type="number" class="form-control form-control-sm" value="${item.quantity}" min="1" onchange="updateQuantity(${index}, this.value)">
                        </div>
                        <div class="col-md-2 text-center">
                            <strong>₺${itemTotal.toFixed(2)}</strong>
                        </div>
                        <div class="col-md-2 text-end">
                            <button class="btn btn-sm btn-outline-danger" onclick="removeFromCart(${index})">Sil</button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    });
    
    // Özet bölümü HTML'i
    // col-lg-4: Büyük ekranlarda 4 kolon (özet için)
    cartHTML += `
            </div>
            <div class="col-lg-4">
                <div class="card">
                    <div class="card-body">
                        <div class="d-flex justify-content-between mb-3">
                            <strong>Toplam:</strong>
                            <strong>₺${total.toFixed(2)}</strong>
                        </div>
                        <button class="btn text-white w-100 mb-2" style="background-color: #0d6efd;" onclick="checkout()">Ödemeye Geç</button>
                        <a href="shop.html" class="btn btn-outline-secondary w-100">Alışverişe Devam Et</a>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // HTML'i container'a yaz
    cartContent.innerHTML = cartHTML;
}

/**
 * Ürün miktarını güncelle
 * @param {number} index - Sepetteki ürünün index'i
 * @param {string} quantity - Yeni miktar (string olarak gelir)
 */
function updateQuantity(index, quantity) {
    // Sepeti localStorage'dan al
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    
    // Miktar 1'den küçükse 1 yap
    if (quantity < 1) {
        quantity = 1;
    }
    
    // Miktarı güncelle
    // parseInt: String'i sayıya çevir
    cart[index].quantity = parseInt(quantity);
    
    // Sepeti localStorage'a kaydet
    localStorage.setItem('cart', JSON.stringify(cart));
    
    // Sepeti yeniden yükle (güncellenmiş toplamı görmek için)
    loadCart();
}

/**
 * Ürünü sepetten çıkar
 * @param {number} index - Sepetteki ürünün index'i
 */
function removeFromCart(index) {
    // Sepeti localStorage'dan al
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    
    // splice: Diziden öğe sil
    // index: Silinecek öğenin konumu
    // 1: Kaç öğe silinecek
    cart.splice(index, 1);
    
    // Sepeti localStorage'a kaydet
    localStorage.setItem('cart', JSON.stringify(cart));
    
    // Sepeti yeniden yükle
    loadCart();
}

/**
 * Ödeme işlemi (şu an aktif değil)
 */
function checkout() {
    // Sepeti localStorage'dan al
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    
    // Eğer sepet boşsa uyar
    if (cart.length === 0) {
        alert('Sepetiniz boş!');
        return;
    }
    
    // Ödeme özelliği henüz aktif değil
    alert('Ödeme işlemi henüz aktif değil. Bu özellik yakında eklenecektir.');
}

// Sayfa yüklendiğinde sepeti yükle
// DOMContentLoaded: HTML yüklendiğinde çalışır
document.addEventListener('DOMContentLoaded', function() {
    loadCart();
});

