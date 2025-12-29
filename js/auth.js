// ==================== AUTHENTICATION HELPER FUNCTIONS ====================
// Bu dosya tüm sayfalarda kullanılan ortak kimlik doğrulama fonksiyonlarını içerir
// API_URL ve navbar güncelleme işlemleri burada tanımlı

// API base URL - Backend sunucusunun adresi
// Tüm API istekleri bu URL'e yapılacak
const API_URL = 'http://localhost:3000/api';

/**
 * Navbar'ı kullanıcı durumuna göre güncelle
 * - Giriş yapmamışsa: "Giriş Yap" butonu göster
 * - Giriş yapmışsa: Kullanıcı adı ve dropdown menü göster
 * - Admin ise: "Admin Paneli" linki göster
 */
function updateNavbar() {
    // localStorage'dan kullanıcı bilgisini al
    // JSON.parse: String'i JavaScript objesine çevir
    // || 'null': Eğer yoksa 'null' string'i kullan
    const user = JSON.parse(localStorage.getItem('user') || 'null');
    
    // Navbar elementlerini seç
    // getElementById: ID'sine göre element bulur
    const loginNavItem = document.getElementById('loginNavItem'); // "Giriş Yap" butonu
    const userNavItem = document.getElementById('userNavItem'); // Kullanıcı dropdown menüsü
    const userNameNav = document.getElementById('userNameNav'); // Kullanıcı adı gösterilecek span
    const adminNavLink = document.getElementById('adminNavLink'); // Admin paneli linki
    
    // Eğer kullanıcı giriş yapmışsa
    if (user && loginNavItem && userNavItem && userNameNav) {
        // "Giriş Yap" butonunu gizle
        loginNavItem.style.display = 'none';
        
        // Kullanıcı dropdown menüsünü göster
        userNavItem.style.display = 'block';
        
        // Kullanıcı adını yaz
        userNameNav.textContent = user.username;
        
        // Admin kontrolü
        if (adminNavLink) {
            if (user.role === 'admin') {
                // Admin ise "Admin Paneli" linkini göster
                adminNavLink.style.display = 'block';
            } else {
                // Normal kullanıcı ise gizle
                adminNavLink.style.display = 'none';
            }
        }
    } 
    // Eğer kullanıcı giriş yapmamışsa
    else if (loginNavItem && userNavItem) {
        // "Giriş Yap" butonunu göster
        loginNavItem.style.display = 'block';
        
        // Kullanıcı dropdown menüsünü gizle
        userNavItem.style.display = 'none';
    }
}

/**
 * Kullanıcı çıkış yap
 * - localStorage'dan kullanıcı bilgisini sil
 * - Ana sayfaya yönlendir
 */
function logout() {
    // localStorage.removeItem: Belirtilen key'i siler
    localStorage.removeItem('user');
    
    // Ana sayfaya yönlendir
    window.location.href = 'index.html';
}

// Sayfa yüklendiğinde navbar'ı güncelle
// DOMContentLoaded: HTML yüklendiğinde çalışır (resimler yüklenmeden önce)
// Bu sayede navbar hemen doğru durumda görünür
document.addEventListener('DOMContentLoaded', updateNavbar);
