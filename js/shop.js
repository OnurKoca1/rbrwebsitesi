async function loadProducts() {
    try {
        const products = await fetchData('/products');
        const productGrid = document.getElementById('productGrid');
        productGrid.innerHTML = '';
        
        if (products.length === 0) {
            productGrid.innerHTML = '<div class="col-12 text-center"><p>Henüz ürün bulunmamaktadır.</p></div>';
            return;
        }
        
        products.forEach(product => {
            const card = document.createElement('div');
            card.className = 'col-md-6 col-lg-4';
            card.innerHTML = `
                <div class="card product-card h-100">
                    <img src="${product.image || 'images/product-default.jpg'}" class="card-img-top" alt="${product.name}">
                    <div class="card-body">
                        <h5 class="card-title">${product.name}</h5>
                        <p class="card-text">${product.description || ''}</p>
                        <div class="d-flex justify-content-between align-items-center">
                            <span class="product-price">₺${product.price}</span>
                            <button class="btn btn-primary btn-sm add-to-cart-btn">
                                <i class="bi bi-cart-plus"></i> Sepete Ekle
                            </button>
                        </div>
                    </div>
                </div>
            `;
            productGrid.appendChild(card);
        });
        
        document.querySelectorAll('.add-to-cart-btn').forEach((button, index) => {
            button.addEventListener('click', () => addToCart(products[index]));
        });
    } catch (error) {
        console.error('Ürünler yüklenirken hata:', error);
        showError('productGrid', 'Ürünler yüklenirken bir hata oluştu. Lütfen sunucunun çalıştığından emin olun.');
    }
}

document.addEventListener('DOMContentLoaded', loadProducts);
