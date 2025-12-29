document.getElementById('loginForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    
    if (!username || !password) {
        showFormError('loginError', 'Lütfen kullanıcı adı ve şifre girin.');
        return;
    }
    
    try {
        const response = await fetch(`${API_URL}/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });
        const result = await response.json();
        
        if (response.ok && result.success) {
            localStorage.setItem('user', JSON.stringify({
                id: result.user.id,
                username: result.user.username,
                email: result.user.email,
                role: result.user.role
            }));
            window.location.href = result.user.role === 'admin' ? 'admin.html' : 'index.html';
        } else {
            showFormError('loginError', result.error || 'Giriş başarısız');
        }
    } catch (error) {
        console.error('Giriş hatası:', error);
        showFormError('loginError', 'Giriş yapılırken bir hata oluştu.');
    }
});
