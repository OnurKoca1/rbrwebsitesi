# ==================== BACKEND SERVER - Python Flask ====================
# Bu dosya web sunucusunu başlatır ve API endpoint'lerini tanımlar
# Veriler JSON dosyasında saklanır (data/data.json)

from flask import Flask, jsonify, request
from flask_cors import CORS
import json
import os
from datetime import datetime

# Flask uygulaması oluştur
app = Flask(__name__, static_folder='.', static_url_path='')

# CORS - Cross-Origin Resource Sharing, farklı domain'lerden istek kabul etmek için
CORS(app)

# Port numarası - sunucu bu portta çalışacak
PORT = 3000

# Veri dosyasının yolu
# __file__: mevcut dosyanın yolu
DATA_DIR = os.path.join(os.path.dirname(__file__), 'data')
DATA_PATH = os.path.join(DATA_DIR, 'data.json')

# ==================== HELPER FONKSİYONLAR ====================

def read_data():
    """
    Veri dosyasını oku ve Python dict'ine çevir
    @returns {dict} Veri objesi (news, products, users, standings)
    """
    try:
        # Dosya varsa oku
        with open(DATA_PATH, 'r', encoding='utf-8') as f:
            return json.load(f)
    except (FileNotFoundError, json.JSONDecodeError):
        # Hata olursa (dosya yoksa) boş veri yapısı döndür
        return {
            'news': [],
            'products': [],
            'users': []
        }

def write_data(data):
    """
    Veriyi JSON dosyasına yaz
    @param {dict} data - Yazılacak veri objesi
    """
    # data klasörü yoksa oluştur
    os.makedirs(DATA_DIR, exist_ok=True)
    
    # Dosyaya yaz
    with open(DATA_PATH, 'w', encoding='utf-8') as f:
        # indent=2: Girintili format (okunabilirlik)
        # ensure_ascii=False: Türkçe karakterler için
        json.dump(data, f, indent=2, ensure_ascii=False)

def get_next_id(items):
    """
    Yeni ID oluştur - en büyük ID'den 1 fazla
    @param {list} items - ID'li öğe dizisi
    @returns {int} Yeni ID
    """
    # Eğer dizi boşsa 1 döndür, değilse en büyük ID + 1
    if not items:
        return 1
    return max(item['id'] for item in items) + 1

def sanitize_user(user):
    """
    Kullanıcı bilgilerinden şifreyi kaldır (güvenlik için)
    @param {dict} user - Kullanıcı objesi
    @returns {dict} Şifre olmayan kullanıcı objesi
    """
    # password'ü ayır, geri kalanını döndür
    return {k: v for k, v in user.items() if k != 'password'}

# ==================== İLK VERİ KURULUMU ====================

# Veri dosyası yoksa varsayılan veri oluştur
if not os.path.exists(DATA_PATH):
    write_data({
        'news': [],  # Haberler dizisi
        'products': [],  # Ürünler dizisi
        'users': [{  # Varsayılan admin kullanıcı
            'id': 1,
            'username': 'admin',
            'email': 'admin@redbullracing.com',
            'password': 'admin123',  # Gerçek uygulamada hash'lenmeli!
            'role': 'admin',
            'createdAt': datetime.now().isoformat()  # ISO formatında tarih
        }],
    })

# ==================== API ROUTES (ENDPOINT'LER) ====================

# ---------- KULLANICI İŞLEMLERİ ----------

@app.route('/api/register', methods=['POST'])
def register():
    """
    Kullanıcı kaydı (POST /api/register)
    request.json: { username, email, password }
    """
    data = read_data()
    body = request.json
    
    # Yeni kullanıcı oluştur
    new_user = {
        'id': get_next_id(data['users']),
        'username': body.get('username', ''),
        'email': body.get('email', ''),
        'password': body.get('password', ''),  # Gerçek uygulamada bcrypt ile hash'lenmeli!
        'role': 'user',  # Varsayılan rol
        'createdAt': datetime.now().isoformat()  # Oluşturulma tarihi
    }
    
    # Kullanıcıyı ekle ve kaydet
    data['users'].append(new_user)
    write_data(data)
    
    # Şifre olmadan kullanıcıyı döndür
    return jsonify({'success': True, 'user': sanitize_user(new_user)})

@app.route('/api/login', methods=['POST'])
def login():
    """
    Kullanıcı girişi (POST /api/login)
    request.json: { username, password }
    """
    body = request.json
    username = body.get('username', '')
    password = body.get('password', '')
    
    # Kullanıcıyı bul (kullanıcı adı veya e-posta ile)
    data = read_data()
    user = next(
        (u for u in data['users'] 
         if (u['username'] == username or u['email'] == username) 
         and u['password'] == password),
        None
    )
    
    # Kullanıcı bulunduysa başarı, bulunamadıysa hata
    if user:
        return jsonify({'success': True, 'user': sanitize_user(user)})
    else:
        return jsonify({'error': 'Kullanıcı adı veya şifre hatalı.'}), 401

# ---------- HABERLER API'LERİ ----------

@app.route('/api/news', methods=['GET'])
def get_all_news():
    """Tüm haberleri getir (GET /api/news)"""
    data = read_data()
    return jsonify(data.get('news', []))

@app.route('/api/news/<int:news_id>', methods=['GET'])
def get_news_by_id(news_id):
    """Tek haberi getir (GET /api/news/:id)"""
    data = read_data()
    news_item = next((item for item in data.get('news', []) if item['id'] == news_id), None)
    return jsonify(news_item if news_item else {})

@app.route('/api/news', methods=['POST'])
def create_news():
    """Yeni haber ekle (POST /api/news)"""
    data = read_data()
    body = request.json
    
    # Yeni öğe oluştur: ID + varsayılan alanlar + gelen veri
    new_item = {
        'id': get_next_id(data.get('news', [])),
        'date': datetime.now().strftime('%Y-%m-%d'),  # Bugünün tarihi (YYYY-MM-DD)
        'author': 'Admin',  # Varsayılan yazar
        **body  # Gelen veri (Python dict merge)
    }
    
    # Diziyi al, yeni öğeyi ekle
    if 'news' not in data:
        data['news'] = []
    data['news'].append(new_item)
    
    # Dosyaya kaydet
    write_data(data)
    
    # Oluşturulan öğeyi döndür
    return jsonify(new_item), 201

@app.route('/api/news/<int:news_id>', methods=['PUT'])
def update_news(news_id):
    """Haberi güncelle (PUT /api/news/:id)"""
    data = read_data()
    news_list = data.get('news', [])
    
    # Güncellenecek öğenin index'ini bul
    index = next((i for i, item in enumerate(news_list) if item['id'] == news_id), -1)
    
    if index != -1:
        # Öğe bulundu - mevcut veriyi koru, gelen veriyle birleştir
        news_list[index] = {**news_list[index], **request.json}
        write_data(data)
        return jsonify(news_list[index])  # Güncellenmiş öğeyi döndür
    return jsonify({})

@app.route('/api/news/<int:news_id>', methods=['DELETE'])
def delete_news(news_id):
    """Haberi sil (DELETE /api/news/:id)"""
    data = read_data()
    # ID'si eşleşmeyen öğeleri filtrele (silme işlemi)
    data['news'] = [item for item in data.get('news', []) if item['id'] != news_id]
    write_data(data)
    return jsonify({'success': True})

# ---------- ÜRÜNLER API'LERİ ----------

@app.route('/api/products', methods=['GET'])
def get_all_products():
    """Tüm ürünleri getir (GET /api/products)"""
    data = read_data()
    return jsonify(data.get('products', []))

@app.route('/api/products', methods=['POST'])
def create_product():
    """Yeni ürün ekle (POST /api/products)"""
    data = read_data()
    body = request.json
    
    new_item = {
        'id': get_next_id(data.get('products', [])),
        **body
    }
    
    if 'products' not in data:
        data['products'] = []
    data['products'].append(new_item)
    write_data(data)
    
    return jsonify(new_item), 201

@app.route('/api/products/<int:product_id>', methods=['PUT'])
def update_product(product_id):
    """Ürünü güncelle (PUT /api/products/:id)"""
    data = read_data()
    products_list = data.get('products', [])
    
    index = next((i for i, item in enumerate(products_list) if item['id'] == product_id), -1)
    
    if index != -1:
        products_list[index] = {**products_list[index], **request.json}
        write_data(data)
        return jsonify(products_list[index])
    return jsonify({})

@app.route('/api/products/<int:product_id>', methods=['DELETE'])
def delete_product(product_id):
    """Ürünü sil (DELETE /api/products/:id)"""
    data = read_data()
    # ID'si eşleşmeyen öğeleri filtrele (silme işlemi)
    data['products'] = [item for item in data.get('products', []) if item['id'] != product_id]
    write_data(data)
    return jsonify({'success': True})


# ==================== SUNUCUYU BAŞLAT ====================
# Not: Static dosyalar (HTML, CSS, JS, resimler) Flask'ın static_folder ayarı ile otomatik servis edilir

if __name__ == '__main__':
    """
    Sunucuyu belirtilen portta dinlemeye başla
    PORT: 3000
    debug=True: Geliştirme modu (hata mesajları detaylı)
    """
    print(f'Server çalışıyor: http://localhost:{PORT}')
    app.run(port=PORT, debug=True)

