document.getElementById('registerForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    const username = document.getElementById('regUsername').value;
    const email = document.getElementById('regEmail').value;
    const password = document.getElementById('regPassword').value;
    const passwordConfirm = document.getElementById('regPasswordConfirm').value;
    
    if (!username || !email || !password || !passwordConfirm) {
        showFormError('registerError', 'Lütfen tüm alanları doldurun.');
        return;
    }
    
    if (password !== passwordConfirm) {
        showFormError('registerError', 'Şifreler eşleşmiyor.');
        return;
    }
    
    try {
        const response = await fetch(`${API_URL}/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, email, password })
        });
        const result = await response.json();
        
        if (response.ok && result.success) {
            alert('Kayıt başarılı! Giriş sayfasına yönlendiriliyorsunuz...');
            window.location.href = 'login.html';
        } else {
            showFormError('registerError', result.error || 'Kayıt başarısız');
        }
    } catch (error) {
        console.error('Kayıt hatası:', error);
        showFormError('registerError', 'Kayıt olurken bir hata oluştu.');
    }
});
