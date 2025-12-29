let editingNewsId = null;
let editingProductId = null;

document.querySelectorAll('[data-bs-toggle="tab"]').forEach(tab => {
    tab.addEventListener('shown.bs.tab', function(e) {
        const target = e.target.getAttribute('href');
        
        if (target === '#news') {
            loadNews();
        }
        if (target === '#products') {
            loadProducts();
        }
    });
    
    tab.addEventListener('click', function() {
        const target = this.getAttribute('href');
        
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

async function loadNews() {
    try {
        const response = await fetch(`${API_URL}/news`);
        const news = await response.json();
        
        const tbody = document.getElementById('newsTableBody');
        tbody.innerHTML = '';
        
        if (news.length === 0) {
            tbody.innerHTML = '<tr><td colspan="4" class="text-center">Henüz haber bulunmamaktadır.</td></tr>';
            return;
        }
        
        news.forEach(item => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${item.id}</td>
                <td>${item.title}</td>
                <td>${new Date(item.date).toLocaleDateString('tr-TR')}</td>
                <td>
                    <button class="btn btn-sm btn-primary" onclick="editNews(${item.id})"><i class="bi bi-pencil"></i></button>
                    <button class="btn btn-sm btn-primary" onclick="deleteNews(${item.id})"><i class="bi bi-trash"></i></button>
                </td>
            `;
            tbody.appendChild(row);
        });
    } catch (error) {
        console.error('Haberler yüklenirken hata:', error);
        document.getElementById('newsTableBody').innerHTML = '<tr><td colspan="4" class="text-center text-danger">Haberler yüklenirken bir hata oluştu.</td></tr>';
    }
}

document.getElementById('saveNewsBtn').addEventListener('click', async function() {
    const title = document.getElementById('newsTitle').value;
    const content = document.getElementById('newsContent').value;
    const image = document.getElementById('newsImage').value || 'images/news-1.jpg';
    
    if (!title || !content) {
        alert('Lütfen başlık ve içerik alanlarını doldurun.');
        return;
    }
    
    const newsData = {
        title,
        content,
        image,
        date: new Date().toISOString().split('T')[0],
        author: 'Admin'
    };
    
    try {
        if (editingNewsId) {
            const response = await fetch(`${API_URL}/news/${editingNewsId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newsData)
            });
            
            if (response.ok) {
                alert('Haber başarıyla güncellendi!');
                bootstrap.Modal.getInstance(document.getElementById('addNewsModal')).hide();
                loadNews();
                resetForm();
            }
        } else {
            const response = await fetch(`${API_URL}/news`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newsData)
            });
            
            if (response.ok) {
                alert('Haber başarıyla eklendi!');
                bootstrap.Modal.getInstance(document.getElementById('addNewsModal')).hide();
                loadNews();
                resetForm();
            }
        }
    } catch (error) {
        console.error('Haber kaydedilirken hata:', error);
        alert('Haber kaydedilirken bir hata oluştu.');
    }
});

async function editNews(id) {
    try {
        const response = await fetch(`${API_URL}/news/${id}`);
        const news = await response.json();
        
        document.getElementById('newsTitle').value = news.title;
        document.getElementById('newsContent').value = news.content;
        document.getElementById('newsImage').value = news.image || '';
        
        editingNewsId = id;
        
        const modal = new bootstrap.Modal(document.getElementById('addNewsModal'));
        modal.show();
    } catch (error) {
        console.error('Haber yüklenirken hata:', error);
        alert('Haber yüklenirken bir hata oluştu.');
    }
}

async function deleteNews(id) {
    try {
        const response = await fetch(`${API_URL}/news/${id}`, {
            method: 'DELETE'
        });
        
        if (response.ok) {
            alert('Haber başarıyla silindi!');
            loadNews();
        }
    } catch (error) {
        console.error('Haber silinirken hata:', error);
        alert('Haber silinirken bir hata oluştu.');
    }
}

function resetForm() {
    document.getElementById('newsTitle').value = '';
    document.getElementById('newsContent').value = '';
    document.getElementById('newsImage').value = '';
    editingNewsId = null;
}

document.getElementById('addNewsModal').addEventListener('hidden.bs.modal', function() {
    resetForm();
});

async function loadProducts() {
    try {
        const response = await fetch(`${API_URL}/products`);
        const products = await response.json();
        
        const tbody = document.getElementById('productsTableBody');
        tbody.innerHTML = '';
        
        if (products.length === 0) {
            tbody.innerHTML = '<tr><td colspan="5" class="text-center">Henüz ürün bulunmamaktadır.</td></tr>';
            return;
        }
        
        products.forEach(product => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${product.id}</td>
                <td>${product.name}</td>
                <td>₺${product.price}</td>
                <td>${product.stock || 0}</td>
                <td>
                    <button class="btn btn-sm btn-primary" onclick="editProduct(${product.id})"><i class="bi bi-pencil"></i></button>
                    <button class="btn btn-sm btn-primary" onclick="deleteProduct(${product.id})"><i class="bi bi-trash"></i></button>
                </td>
            `;
            tbody.appendChild(row);
        });
    } catch (error) {
        console.error('Ürünler yüklenirken hata:', error);
        document.getElementById('productsTableBody').innerHTML = '<tr><td colspan="5" class="text-center text-danger">Ürünler yüklenirken bir hata oluştu.</td></tr>';
    }
}

document.getElementById('saveProductBtn').addEventListener('click', async function() {
    const name = document.getElementById('productName').value;
    const price = parseInt(document.getElementById('productPrice').value);
    const stock = parseInt(document.getElementById('productStock').value);
    const image = document.getElementById('productImage').value || 'images/product-default.jpg';
    const description = document.getElementById('productDescription').value || '';
    
    if (!name || !price || stock === undefined) {
        alert('Lütfen zorunlu alanları doldurun.');
        return;
    }
    
    const productData = {
        name,
        price,
        stock,
        image,
        description
    };
    
    try {
        if (editingProductId) {
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

async function editProduct(id) {
    try {
        const response = await fetch(`${API_URL}/products/${id}`);
        const product = await response.json();
        
        document.getElementById('productName').value = product.name;
        document.getElementById('productPrice').value = product.price;
        document.getElementById('productStock').value = product.stock || 0;
        document.getElementById('productImage').value = product.image || '';
        document.getElementById('productDescription').value = product.description || '';
        
        editingProductId = id;
        
        const modal = new bootstrap.Modal(document.getElementById('addProductModal'));
        modal.show();
    } catch (error) {
        console.error('Ürün yüklenirken hata:', error);
        alert('Ürün yüklenirken bir hata oluştu.');
    }
}

async function deleteProduct(id) {
    try {
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

function resetProductForm() {
    document.getElementById('productName').value = '';
    document.getElementById('productPrice').value = '';
    document.getElementById('productStock').value = '';
    document.getElementById('productImage').value = '';
    document.getElementById('productDescription').value = '';
    editingProductId = null;
}

document.getElementById('addProductModal').addEventListener('hidden.bs.modal', function() {
    resetProductForm();
});

document.addEventListener('DOMContentLoaded', function() {
    loadNews();
    
    const activeTab = document.querySelector('.nav-link.active');
    
    if (activeTab && activeTab.getAttribute('href') === '#products') {
        loadProducts();
    }
});
