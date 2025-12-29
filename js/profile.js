// ==================== PROFILE PAGE JAVASCRIPT ====================
// Bu dosya profil sayfasına özel JavaScript kodlarını içerir

/**
 * Kullanıcı bilgilerini localStorage'dan yükle ve formu doldur
 * DOMContentLoaded: HTML yüklendiğinde çalışır
 */
document.addEventListener('DOMContentLoaded', function() {
    // localStorage'dan kullanıcı bilgisini al
    // getItem('user'): 'user' key'ine sahip değeri al
    // || 'null': Eğer yoksa 'null' string'i kullan
    // JSON.parse: String'i JavaScript objesine çevir
    const user = JSON.parse(localStorage.getItem('user') || 'null');
    
    // Eğer kullanıcı giriş yapmışsa
    if (user) {
        // Elementleri seç
        const profileName = document.getElementById('profileName');
        const profileEmail = document.getElementById('profileEmail');
        const firstNameInput = document.getElementById('firstName');
        const lastNameInput = document.getElementById('lastName');
        const emailInput = document.getElementById('email');
        
        // Kullanıcı adını göster
        // textContent: Elementin metin içeriğini değiştir
        // || 'Kullanıcı': Eğer yoksa varsayılan değer
        if (profileName) profileName.textContent = user.username || 'Kullanıcı';
        
        // E-postayı göster
        if (profileEmail) profileEmail.textContent = user.email || 'user@example.com';
        
        // Ad input'unu doldur
        // split(' '): String'i boşluklardan böl (dizi oluştur)
        // [0]: İlk eleman (ad)
        if (firstNameInput) firstNameInput.value = user.username ? user.username.split(' ')[0] : 'Kullanıcı';
        
        // Soyad input'unu doldur
        // slice(1): İkinci elemandan itibaren al
        // join(' '): Diziyi boşluklarla birleştir
        if (lastNameInput) lastNameInput.value = user.username ? user.username.split(' ').slice(1).join(' ') : 'Adı';
        
        // E-posta input'unu doldur
        if (emailInput) emailInput.value = user.email || 'user@example.com';
    }
});

