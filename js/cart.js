function loadCart() {
    const cart = getCart();
    
    const cartContent = document.getElementById('cartContent');
    
    if (cart.length === 0) {
        cartContent.innerHTML = `
            <div class="text-center py-5">
                <h4 class="mb-3">Sepetiniz boş</h4>
                <a href="shop.html" class="btn btn-primary">Mağazaya Git</a>
            </div>
        `;
        return;
    }
    
    let total = 0;
    
    let cartHTML = `
        <div class="row">
            <div class="col-lg-8">
    `;
    
    cart.forEach((item, index) => {
        const itemTotal = item.price * item.quantity;
        
        total += itemTotal;
        
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
                            <button class="btn btn-sm btn-outline-primary" onclick="removeFromCart(${index})">Sil</button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    });
    
    cartHTML += `
            </div>
            <div class="col-lg-4">
                <div class="card">
                    <div class="card-body">
                        <div class="d-flex justify-content-between mb-3">
                            <strong>Toplam:</strong>
                            <strong>₺${total.toFixed(2)}</strong>
                        </div>
                        <button class="btn btn-primary w-100 mb-2" onclick="checkout()">Ödemeye Geç</button>
                        <a href="shop.html" class="btn btn-outline-secondary w-100">Alışverişe Devam Et</a>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    cartContent.innerHTML = cartHTML;
}

function updateQuantity(index, quantity) {
    const cart = getCart();
    if (quantity < 1) quantity = 1;
    cart[index].quantity = parseInt(quantity);
    saveCart(cart);
    loadCart();
}

function removeFromCart(index) {
    const cart = getCart();
    cart.splice(index, 1);
    saveCart(cart);
    loadCart();
}

function checkout() {
    const cart = getCart();
    if (cart.length === 0) {
        alert('Sepetiniz boş!');
        return;
    }
    alert('Ödeme işlemi henüz aktif değil. Bu özellik yakında eklenecektir.');
}

document.addEventListener('DOMContentLoaded', function() {
    loadCart();
});
