document.addEventListener('DOMContentLoaded', function() {
    const user = JSON.parse(localStorage.getItem('user') || 'null');
    if (user) {
        const profileName = document.getElementById('profileName');
        const profileEmail = document.getElementById('profileEmail');
        const firstNameInput = document.getElementById('firstName');
        const lastNameInput = document.getElementById('lastName');
        const emailInput = document.getElementById('email');
        
        if (profileName) profileName.textContent = user.username || 'Kullanıcı';
        if (profileEmail) profileEmail.textContent = user.email || 'user@example.com';
        if (firstNameInput) firstNameInput.value = user.username ? user.username.split(' ')[0] : 'Kullanıcı';
        if (lastNameInput) lastNameInput.value = user.username ? user.username.split(' ').slice(1).join(' ') : 'Adı';
        if (emailInput) emailInput.value = user.email || 'user@example.com';
    }
});
