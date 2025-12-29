// ==================== ADMIN PANEL JAVASCRIPT ====================
// Bu dosya admin panelinin tüm JavaScript mantığını içerir
// Haber ve ürün yönetimi burada yapılır

// ==================== GLOBAL DEĞİŞKENLER ====================

/**
 * Düzenlenmekte olan haberin ID'si
 * null: Yeni haber ekleniyor
 * number: Mevcut haber düzenleniyor
 */
let editingNewsId = null;

/**
 * Düzenlenmekte olan ürünün ID'si
 * null: Yeni ürün ekleniyor
 * number: Mevcut ürün düzenleniyor
 */
let editingProductId = null;

// ==================== TAB SWITCHING (SEKME DEĞİŞTİRME) ====================

/**
 * Tab (sekme) değiştiğinde ilgili verileri yükle
 * querySelectorAll: Tüm eşleşen elementleri bulur
 * '[data-bs-toggle="tab"]': data-bs-toggle="tab" attribute'una sahip tüm elementler
 */
document.querySelectorAll('[data-bs-toggle="tab"]').forEach(tab => {
    /**
     * Tab gösterildiğinde çalışır
     * 'shown.bs.tab': Bootstrap tab event'i (tab gösterildikten sonra)
     */
    tab.addEventListener('shown.bs.tab', function(e) {
        // e.target: Tıklanan tab elementi
        // getAttribute('href'): Tab'ın href değerini al (#news, #products, #standings)
        const target = e.target.getAttribute('href');
        
        // Haberler sekmesine geçildiğinde listeyi yükle
        if (target === '#news') {
            loadNews();
        }
        // Ürünler sekmesine geçildiğinde listeyi yükle
        if (target === '#products') {
            loadProducts();
        }
    });
    
    /**
     * İlk tıklamada da çalışsın (Bootstrap event'i bazen gecikmeli tetiklenebilir)
     * 'click': Tab'a tıklandığında
     */
    tab.addEventListener('click', function() {
        // this: Tıklanan tab elementi
        const target = this.getAttribute('href');
        
        // setTimeout: Belirtilen süre sonra çalıştır (100ms = 0.1 saniye)
        // Bootstrap'in tab değiştirme animasyonunun tamamlanmasını beklemek için
        setTimeout(() => {
            if (target === '#news') {
                loadNews();
            }
            if (target === '#products') {
                loadProducts();
            }
        }, 100);
    });
});

// ==================== HABER YÖNETİMİ ====================

/**
 * API'den haberleri yükle ve tabloda göster
 * async function: Asenkron fonksiyon (API çağrısı için)
 */
async function loadNews() {
    // try-catch: Hata yakalama bloğu
    try {
        // API'den haberleri çek
        // fetch: HTTP GET isteği
        // ${API_URL}/news: API endpoint (auth.js'de tanımlı)
        const response = await fetch(`${API_URL}/news`);
        
        // Response'u JSON formatına çevir
        const news = await response.json();
        
        // Tablo tbody elementi
        const tbody = document.getElementById('newsTableBody');
        
        // Tabloyu temizle
        tbody.innerHTML = '';
        
        // Eğer haber yoksa mesaj göster
        if (news.length === 0) {
            // colspan="4": 4 kolonu birleştir
            tbody.innerHTML = '<tr><td colspan="4" class="text-center">Henüz haber bulunmamaktadır.</td></tr>';
            return; // Fonksiyondan çık
        }
        
        // Her haber için satır oluştur
        // forEach: Dizideki her öğe için fonksiyon çalıştır
        news.forEach(item => {
            // Yeni tr (table row) elementi oluştur
            const row = document.createElement('tr');
            
            // Satırın HTML içeriğini oluştur
            // item.id: Haber ID'si
            // item.title: Haber başlığı
            // new Date(item.date).toLocaleDateString('tr-TR'): Tarihi Türkçe formatında göster
            // btn-sm: Küçük buton
            // btn-primary: Mavi buton (düzenle)
            // btn-danger: CSS'de mavi renge çevrilmiş (sil)
            // onclick: Tıklanınca çalışacak fonksiyon
            // bi-pencil: Bootstrap Icons - kalem ikonu
            // bi-trash: Bootstrap Icons - çöp kutusu ikonu
            row.innerHTML = `
                <td>${item.id}</td>
                <td>${item.title}</td>
                <td>${new Date(item.date).toLocaleDateString('tr-TR')}</td>
                <td>
                    <button class="btn btn-sm btn-primary" onclick="editNews(${item.id})"><i class="bi bi-pencil"></i></button>
                    <button class="btn btn-sm btn-danger" onclick="deleteNews(${item.id})"><i class="bi bi-trash"></i></button>
                </td>
            `;
            
            // Satırı tabloya ekle
            // appendChild: Elementi başka bir elementin içine ekler
            tbody.appendChild(row);
        });
    } catch (error) {
        // Hata durumunda
        console.error('Haberler yüklenirken hata:', error);
        document.getElementById('newsTableBody').innerHTML = '<tr><td colspan="4" class="text-center text-danger">Haberler yüklenirken bir hata oluştu.</td></tr>';
    }
}

/**
 * Haber ekle/düzenle butonu event listener
 * addEventListener: Olay dinleyici ekle
 * 'click': Butona tıklandığında
 * async function: Asenkron fonksiyon (API çağrısı için)
 */
document.getElementById('saveNewsBtn').addEventListener('click', async function() {
    // Form değerlerini al
    // getElementById: ID'sine göre element bul
    // .value: Input'un değerini al
    const title = document.getElementById('newsTitle').value;
    const content = document.getElementById('newsContent').value;
    // || 'images/news-1.jpg': Görsel yoksa varsayılan kullan
    const image = document.getElementById('newsImage').value || 'images/news-1.jpg';
    
    // Validasyon: Başlık ve içerik dolu mu?
    if (!title || !content) {
        alert('Lütfen başlık ve içerik alanlarını doldurun.');
        return; // Fonksiyondan çık
    }
    
    // Haber verisi objesi
    // Shorthand property: { title } = { title: title }
    const newsData = {
        title,
        content,
        image,
        // toISOString(): ISO formatında tarih string'i (2025-01-01T00:00:00.000Z)
        // split('T')[0]: T'den önceki kısmı al (2025-01-01)
        date: new Date().toISOString().split('T')[0],
        author: 'Admin'
    };
    
    // try-catch: Hata yakalama bloğu
    try {
        // Eğer düzenleme modundaysa
        if (editingNewsId) {
            // PUT isteği: Mevcut haberi güncelle
            const response = await fetch(`${API_URL}/news/${editingNewsId}`, {
                method: 'PUT', // HTTP PUT metodu (güncelleme)
                headers: { 'Content-Type': 'application/json' }, // JSON veri gönderiyoruz
                body: JSON.stringify(newsData) // Veriyi JSON string'e çevir
            });
            
            // Eğer başarılıysa
            if (response.ok) {
                alert('Haber başarıyla güncellendi!');
                // Modal.getInstance: Mevcut modal instance'ını al
                // hide(): Modal'ı kapat
                bootstrap.Modal.getInstance(document.getElementById('addNewsModal')).hide();
                // Haberleri yeniden yükle
                loadNews();
                // Formu sıfırla
                resetForm();
            }
        } else {
            // POST isteği: Yeni haber ekle
            const response = await fetch(`${API_URL}/news`, {
                method: 'POST', // HTTP POST metodu (yeni ekleme)
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newsData)
            });
            
            // Eğer başarılıysa
            if (response.ok) {
                alert('Haber başarıyla eklendi!');
                bootstrap.Modal.getInstance(document.getElementById('addNewsModal')).hide();
                loadNews();
                resetForm();
            }
        }
    } catch (error) {
        // Hata durumunda
        console.error('Haber kaydedilirken hata:', error);
        alert('Haber kaydedilirken bir hata oluştu.');
    }
});

/**
 * Haber düzenle
 * @param {number} id - Düzenlenecek haberin ID'si
 * async function: Asenkron fonksiyon (API çağrısı için)
 */
async function editNews(id) {
    try {
        // API'den haberi çek
        const response = await fetch(`${API_URL}/news/${id}`);
        const news = await response.json();
        
        // Form alanlarını doldur
        document.getElementById('newsTitle').value = news.title;
        document.getElementById('newsContent').value = news.content;
        // || '': Görsel yoksa boş string
        document.getElementById('newsImage').value = news.image || '';
        
        // Düzenleme moduna geç
        editingNewsId = id;
        
        // Modal'ı aç
        // new bootstrap.Modal: Yeni modal instance'ı oluştur
        const modal = new bootstrap.Modal(document.getElementById('addNewsModal'));
        // show(): Modal'ı göster
        modal.show();
    } catch (error) {
        console.error('Haber yüklenirken hata:', error);
        alert('Haber yüklenirken bir hata oluştu.');
    }
}

/**
 * Haber sil
 * @param {number} id - Silinecek haberin ID'si
 * async function: Asenkron fonksiyon (API çağrısı için)
 */
async function deleteNews(id) {
    try {
        // DELETE isteği: Haberi sil
        const response = await fetch(`${API_URL}/news/${id}`, {
            method: 'DELETE' // HTTP DELETE metodu
        });
        
        // Eğer başarılıysa
        if (response.ok) {
            alert('Haber başarıyla silindi!');
            // Haberleri yeniden yükle
            loadNews();
        }
    } catch (error) {
        console.error('Haber silinirken hata:', error);
        alert('Haber silinirken bir hata oluştu.');
    }
}

/**
 * Haber formunu sıfırla
 * Tüm input alanlarını temizle ve düzenleme modunu kapat
 */
function resetForm() {
    document.getElementById('newsTitle').value = '';
    document.getElementById('newsContent').value = '';
    document.getElementById('newsImage').value = '';
    // Düzenleme modunu kapat
    editingNewsId = null;
}

/**
 * Modal kapandığında formu sıfırla
 * 'hidden.bs.modal': Bootstrap modal event'i (modal gizlendikten sonra)
 */
document.getElementById('addNewsModal').addEventListener('hidden.bs.modal', function() {
    resetForm();
});

// ==================== ÜRÜN YÖNETİMİ ====================

/**
 * API'den ürünleri yükle ve tabloda göster
 * async function: Asenkron fonksiyon (API çağrısı için)
 */
async function loadProducts() {
    try {
        // API'den ürünleri çek
        const response = await fetch(`${API_URL}/products`);
        const products = await response.json();
        
        // Tablo tbody elementi
        const tbody = document.getElementById('productsTableBody');
        tbody.innerHTML = '';
        
        // Eğer ürün yoksa mesaj göster
        if (products.length === 0) {
            // colspan="5": 5 kolonu birleştir
            tbody.innerHTML = '<tr><td colspan="5" class="text-center">Henüz ürün bulunmamaktadır.</td></tr>';
            return;
        }
        
        // Her ürün için satır oluştur
        products.forEach(product => {
            const row = document.createElement('tr');
            // product.stock || 0: Stok yoksa 0 göster
            row.innerHTML = `
                <td>${product.id}</td>
                <td>${product.name}</td>
                <td>₺${product.price}</td>
                <td>${product.stock || 0}</td>
                <td>
                    <button class="btn btn-sm btn-primary" onclick="editProduct(${product.id})"><i class="bi bi-pencil"></i></button>
                    <button class="btn btn-sm btn-danger" onclick="deleteProduct(${product.id})"><i class="bi bi-trash"></i></button>
                </td>
            `;
            tbody.appendChild(row);
        });
    } catch (error) {
        console.error('Ürünler yüklenirken hata:', error);
        document.getElementById('productsTableBody').innerHTML = '<tr><td colspan="5" class="text-center text-danger">Ürünler yüklenirken bir hata oluştu.</td></tr>';
    }
}

/**
 * Ürün ekle/düzenle butonu event listener
 */
document.getElementById('saveProductBtn').addEventListener('click', async function() {
    // Form değerlerini al
    const name = document.getElementById('productName').value;
    // parseInt: String'i sayıya çevir
    const price = parseInt(document.getElementById('productPrice').value);
    const stock = parseInt(document.getElementById('productStock').value);
    const image = document.getElementById('productImage').value || 'images/product-default.jpg';
    const description = document.getElementById('productDescription').value || '';
    
    // Validasyon: Zorunlu alanlar dolu mu?
    // stock === undefined: Stock input'u boşsa undefined olur
    if (!name || !price || stock === undefined) {
        alert('Lütfen zorunlu alanları doldurun.');
        return;
    }
    
    // Ürün verisi objesi
    const productData = {
        name,
        price,
        stock,
        image,
        description
    };
    
    try {
        // Eğer düzenleme modundaysa
        if (editingProductId) {
            // PUT isteği: Mevcut ürünü güncelle
            const response = await fetch(`${API_URL}/products/${editingProductId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(productData)
            });
            
            if (response.ok) {
                alert('Ürün başarıyla güncellendi!');
                bootstrap.Modal.getInstance(document.getElementById('addProductModal')).hide();
                loadProducts();
                resetProductForm();
            }
        } else {
            // POST isteği: Yeni ürün ekle
            const response = await fetch(`${API_URL}/products`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(productData)
            });
            
            if (response.ok) {
                alert('Ürün başarıyla eklendi!');
                bootstrap.Modal.getInstance(document.getElementById('addProductModal')).hide();
                loadProducts();
                resetProductForm();
            }
        }
    } catch (error) {
        console.error('Ürün kaydedilirken hata:', error);
        alert('Ürün kaydedilirken bir hata oluştu.');
    }
});

/**
 * Ürün düzenle
 * @param {number} id - Düzenlenecek ürünün ID'si
 */
async function editProduct(id) {
    try {
        // API'den ürünü çek
        const response = await fetch(`${API_URL}/products/${id}`);
        const product = await response.json();
        
        // Form alanlarını doldur
        document.getElementById('productName').value = product.name;
        document.getElementById('productPrice').value = product.price;
        document.getElementById('productStock').value = product.stock || 0;
        document.getElementById('productImage').value = product.image || '';
        document.getElementById('productDescription').value = product.description || '';
        
        // Düzenleme moduna geç
        editingProductId = id;
        
        // Modal'ı aç
        const modal = new bootstrap.Modal(document.getElementById('addProductModal'));
        modal.show();
    } catch (error) {
        console.error('Ürün yüklenirken hata:', error);
        alert('Ürün yüklenirken bir hata oluştu.');
    }
}

/**
 * Ürün sil
 * @param {number} id - Silinecek ürünün ID'si
 */
async function deleteProduct(id) {
    try {
        // DELETE isteği: Ürünü sil
        const response = await fetch(`${API_URL}/products/${id}`, {
            method: 'DELETE'
        });
        
        if (response.ok) {
            alert('Ürün başarıyla silindi!');
            loadProducts();
        }
    } catch (error) {
        console.error('Ürün silinirken hata:', error);
        alert('Ürün silinirken bir hata oluştu.');
    }
}

/**
 * Ürün formunu sıfırla
 */
function resetProductForm() {
    document.getElementById('productName').value = '';
    document.getElementById('productPrice').value = '';
    document.getElementById('productStock').value = '';
    document.getElementById('productImage').value = '';
    document.getElementById('productDescription').value = '';
    // Düzenleme modunu kapat
    editingProductId = null;
}

/**
 * Modal kapandığında formu sıfırla
 */
document.getElementById('addProductModal').addEventListener('hidden.bs.modal', function() {
    resetProductForm();
});

// ==================== ŞAMPİYONLUK SIRALAMASI YÖNETİMİ ====================


// ==================== SAYFA YÜKLENDİĞİNDE ====================

/**
 * Sayfa yüklendiğinde aktif sekmeye göre verileri yükle
 * DOMContentLoaded: HTML yüklendiğinde çalışır
 */
document.addEventListener('DOMContentLoaded', function() {
    // Varsayılan olarak haberleri yükle
    loadNews();
    
    // Aktif tab'ı bul
    // querySelector: İlk eşleşen elementi bulur
    // .nav-link.active: Hem nav-link hem active sınıfına sahip element
    const activeTab = document.querySelector('.nav-link.active');
    
    // Eğer ürünler sekmesi aktifse ürünleri de yükle
    if (activeTab && activeTab.getAttribute('href') === '#products') {
        loadProducts();
    }
    
});
