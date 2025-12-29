async function fetchData(endpoint) {
    const response = await fetch(`${API_URL}${endpoint}`);
    return await response.json();
}

function showError(containerId, message) {
    const container = document.getElementById(containerId);
    if (container) {
        container.innerHTML = `<div class="col-12 text-center"><p class="text-danger">${message}</p></div>`;
    }
}

function showFormError(errorId, message) {
    const errorDiv = document.getElementById(errorId);
    if (errorDiv) {
        errorDiv.textContent = message;
        errorDiv.style.display = 'block';
    }
}

function createNewsCard(item, maxLength = 150) {
    const card = document.createElement('div');
    card.className = 'col-md-4';
    const shortContent = item.content.length > maxLength ? item.content.substring(0, maxLength) + '...' : item.content;
    card.innerHTML = `
        <div class="card news-card h-100">
            <img src="${item.image || 'images/news-1.jpg'}" class="card-img-top" alt="${item.title}">
            <div class="card-body">
                <h5 class="card-title">${item.title}</h5>
                <p class="card-text">${shortContent}</p>
                <a href="news-detail.html?id=${item.id}" target="_blank" class="btn btn-sm btn-outline-primary">Devamını Oku</a>
            </div>
        </div>
    `;
    return card;
}

async function loadNews(containerId, maxLength = 150) {
    try {
        const news = await fetchData('/news');
        const container = document.getElementById(containerId);
        if (!container) return;
        container.innerHTML = '';
        if (news.length === 0) {
            container.innerHTML = '<div class="col-12 text-center"><p>Henüz haber bulunmamaktadır.</p></div>';
            return;
        }
        news.forEach(item => container.appendChild(createNewsCard(item, maxLength)));
    } catch (error) {
        console.error('Haberler yüklenirken hata:', error);
        showError(containerId, 'Haberler yüklenirken bir hata oluştu. Lütfen sunucunun çalıştığından emin olun.');
    }
}

async function postData(endpoint, data) {
    const response = await fetch(`${API_URL}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });
    return await response.json();
}

function getCart() {
    return JSON.parse(localStorage.getItem('cart') || '[]');
}

function saveCart(cart) {
    localStorage.setItem('cart', JSON.stringify(cart));
}

function addToCart(product) {
    let cart = getCart();
    const existingItem = cart.find(item => item.id === product.id);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.image || 'images/product-default.jpg',
            description: product.description || '',
            quantity: 1
        });
    }
    
    saveCart(cart);
    
    const alert = document.createElement('div');
    alert.className = 'alert alert-success alert-dismissible fade show position-fixed top-0 start-50 translate-middle-x mt-5';
    alert.style.zIndex = '9999';
    alert.innerHTML = `<strong>Başarılı!</strong> ${product.name} sepete eklendi (₺${product.price}). <button type="button" class="btn-close" data-bs-dismiss="alert"></button>`;
    document.body.appendChild(alert);
    setTimeout(() => alert.remove(), 3000);
}
