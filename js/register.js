// ==================== REGISTER PAGE JAVASCRIPT ====================
// Bu dosya kayıt sayfasına özel JavaScript kodlarını içerir

/**
 * Kayıt formu submit olayı
 * addEventListener: Olay dinleyici ekle
 * 'submit': Form gönderildiğinde çalışır
 * async function: Asenkron fonksiyon (API çağrısı için)
 */
document.getElementById('registerForm').addEventListener('submit', async function(e) {
    // preventDefault: Formun varsayılan davranışını engelle (sayfa yenilenmesini önle)
    e.preventDefault();
    
    // Form değerlerini al
    // getElementById: ID'sine göre element bul
    // .value: Input'un değerini al
    const username = document.getElementById('regUsername').value;
    const email = document.getElementById('regEmail').value;
    const password = document.getElementById('regPassword').value;
    const passwordConfirm = document.getElementById('regPasswordConfirm').value;
    
    // Hata mesajı elementi
    const errorDiv = document.getElementById('registerError');
    
    // Validasyon 1: Tüm alanlar dolu mu?
    if (!username || !email || !password || !passwordConfirm) {
        errorDiv.textContent = 'Lütfen tüm alanları doldurun.';
        errorDiv.style.display = 'block';
        return; // Fonksiyondan çık
    }
    
    // Validasyon 2: Şifreler eşleşiyor mu?
    if (password !== passwordConfirm) {
        errorDiv.textContent = 'Şifreler eşleşmiyor.';
        errorDiv.style.display = 'block';
        return; // Fonksiyondan çık
    }
    
    // try-catch: Hata yakalama bloğu
    try {
        // API'ye kayıt isteği gönder
        // fetch: HTTP isteği yap
        // method: 'POST': POST isteği (veri göndermek için)
        // headers: İstek başlıkları
        // 'Content-Type': 'application/json': JSON veri gönderiyoruz
        // body: Gönderilecek veri (JSON string)
        // JSON.stringify: JavaScript objesini JSON string'e çevir
        const response = await fetch(`${API_URL}/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, email, password })
        });
        
        // Response'u JSON formatına çevir
        const result = await response.json();
        
        // Eğer kayıt başarılıysa
        // response.ok: HTTP status 200-299 arası
        // result.success: Backend'den gelen başarı durumu
        if (response.ok && result.success) {
            // Başarı mesajı göster
            alert('Kayıt başarılı! Giriş sayfasına yönlendiriliyorsunuz...');
            
            // Giriş sayfasına yönlendir
            window.location.href = 'login.html';
        } else {
            // Kayıt başarısız - hata mesajı göster
            // result.error: Backend'den gelen hata mesajı
            errorDiv.textContent = result.error || 'Kayıt başarısız';
            errorDiv.style.display = 'block';
        }
    } catch (error) {
        // Hata durumunda
        // console.error: Konsola hata yazdır (F12 ile görülebilir)
        console.error('Kayıt hatası:', error);
        errorDiv.textContent = 'Kayıt olurken bir hata oluştu.';
        errorDiv.style.display = 'block';
    }
});

