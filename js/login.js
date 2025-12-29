// ==================== LOGIN PAGE JAVASCRIPT ====================
// Bu dosya giriş sayfasına özel JavaScript kodlarını içerir

/**
 * Giriş formu submit olayı
 * addEventListener: Olay dinleyici ekle
 * 'submit': Form gönderildiğinde çalışır
 * async function: Asenkron fonksiyon (API çağrısı için)
 */
document.getElementById('loginForm').addEventListener('submit', async function(e) {
    // preventDefault: Formun varsayılan davranışını engelle (sayfa yenilenmesini önle)
    e.preventDefault();
    
    // Form değerlerini al
    // getElementById: ID'sine göre element bul
    // .value: Input'un değerini al
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    
    // Hata mesajı elementi
    const errorDiv = document.getElementById('loginError');
    
    // Validasyon: Tüm alanlar dolu mu?
    if (!username || !password) {
        // textContent: Elementin metin içeriğini değiştir
        errorDiv.textContent = 'Lütfen kullanıcı adı ve şifre girin.';
        // style.display = 'block': Elementi göster
        errorDiv.style.display = 'block';
        return; // Fonksiyondan çık
    }
    
    // try-catch: Hata yakalama bloğu
    try {
        // API'ye giriş isteği gönder
        // fetch: HTTP isteği yap
        // method: 'POST': POST isteği (veri göndermek için)
        // headers: İstek başlıkları
        // 'Content-Type': 'application/json': JSON veri gönderiyoruz
        // body: Gönderilecek veri (JSON string)
        // JSON.stringify: JavaScript objesini JSON string'e çevir
        const response = await fetch(`${API_URL}/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });
        
        // Response'u JSON formatına çevir
        const result = await response.json();
        
        // Eğer giriş başarılıysa
        // response.ok: HTTP status 200-299 arası
        // result.success: Backend'den gelen başarı durumu
        if (response.ok && result.success) {
            // Kullanıcı bilgilerini localStorage'a kaydet
            // localStorage: Tarayıcıda veri saklama
            // setItem: Veri kaydet
            // 'user': Key (anahtar)
            // JSON.stringify: Objeyi string'e çevir (localStorage sadece string kabul eder)
            localStorage.setItem('user', JSON.stringify({
                id: result.user.id,
                username: result.user.username,
                email: result.user.email,
                role: result.user.role // 'admin' veya 'user'
            }));
            
            // Admin ise admin paneline, değilse ana sayfaya yönlendir
            if (result.user.role === 'admin') {
                window.location.href = 'admin.html';
            } else {
                window.location.href = 'index.html';
            }
        } else {
            // Giriş başarısız - hata mesajı göster
            // result.error: Backend'den gelen hata mesajı
            errorDiv.textContent = result.error || 'Giriş başarısız';
            errorDiv.style.display = 'block';
        }
    } catch (error) {
        // Hata durumunda
        // console.error: Konsola hata yazdır (F12 ile görülebilir)
        console.error('Giriş hatası:', error);
        errorDiv.textContent = 'Giriş yapılırken bir hata oluştu.';
        errorDiv.style.display = 'block';
    }
});

