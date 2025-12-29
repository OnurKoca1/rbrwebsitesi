const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;
const dataPath = path.join(__dirname, 'data', 'data.json');

// ==================== MIDDLEWARE ====================
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('.'));

// ==================== HELPER FUNCTIONS ====================

// Veri dosyasını oku
function readData() {
    try {
        const data = fs.readFileSync(dataPath, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        return { news: [], drivers: [], races: [], products: [], users: [], standings: { drivers: [], teams: [] } };
    }
}

// Veri dosyasına yaz
function writeData(data) {
    fs.writeFileSync(dataPath, JSON.stringify(data, null, 2), 'utf8');
}

// Yeni ID oluştur
function getNextId(items) {
    return items.length > 0 ? Math.max(...items.map(item => item.id)) + 1 : 1;
}

// Kullanıcı bilgilerini temizle (şifre hariç)
function sanitizeUser(user) {
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
}

// ==================== INITIAL DATA SETUP ====================

// data klasörünü oluştur
if (!fs.existsSync(path.join(__dirname, 'data'))) {
    fs.mkdirSync(path.join(__dirname, 'data'));
}

// İlk veri yoksa oluştur
if (!fs.existsSync(dataPath)) {
    const initialData = {
        news: [{
            id: 1,
            title: "Yeni Sezon Başladı",
            content: "2025 Formula 1 sezonu heyecanla başladı. RedBull Racing ilk yarışta zafer kazandı.",
            image: "images/news-1.jpg",
            date: "2025-03-16",
            author: "Admin"
        }],
        drivers: [
            {
                id: 1,
                name: "Max Verstappen",
                country: "Hollanda",
                birthDate: "1997-09-30",
                age: 27,
                team: "RedBull Racing",
                races: 203,
                wins: 62,
                poles: 42,
                podiums: 112,
                championships: 4
            },
            {
                id: 2,
                name: "Yuki Tsunoda",
                country: "Japonya",
                birthDate: "2000-05-11",
                age: 24,
                team: "RedBull Racing",
                races: 85,
                wins: 0,
                poles: 0,
                podiums: 0,
                championships: 0
            }
        ],
        races: [],
        products: [{
            id: 1,
            name: "RedBull Racing Tişört",
            price: 299,
            image: "images/product-tshirt.jpg",
            stock: 45
        }],
        users: [{
            id: 1,
            username: 'admin',
            email: 'admin@redbullracing.com',
            password: 'admin123',
            role: 'admin',
            createdAt: new Date().toISOString()
        }],
        standings: {
            drivers: [
                { position: 1, name: 'Lando Norris', points: 423 },
                { position: 2, name: 'Max Verstappen', points: 421 },
                { position: 3, name: 'Oscar Piastri', points: 410 },
                { position: 4, name: 'George Russell', points: 319 },
                { position: 5, name: 'Charles Leclerc', points: 242 }
            ],
            teams: [
                { position: 1, name: 'McLaren', points: 833 },
                { position: 2, name: 'Mercedes', points: 469 },
                { position: 3, name: 'RedBull Racing', points: 454 },
                { position: 4, name: 'Ferrari', points: 398 },
                { position: 5, name: 'Williams', points: 137 }
            ]
        }
    };
    writeData(initialData);
}

// ==================== GENERIC CRUD HELPERS ====================

// Generic GET all
function getAllItems(collectionName) {
    return (req, res) => {
        const data = readData();
        res.json(data[collectionName] || []);
    };
}

// Generic GET by ID
function getItemById(collectionName) {
    return (req, res) => {
        const data = readData();
        const item = data[collectionName].find(item => item.id === parseInt(req.params.id));
        
        if (item) {
            res.json(item);
        } else {
            res.status(404).json({ error: `${collectionName} bulunamadı` });
        }
    };
}

// Generic POST (create)
function createItem(collectionName, defaultFields = {}) {
    return (req, res) => {
        const data = readData();
        const newItem = {
            id: getNextId(data[collectionName]),
            ...defaultFields,
            ...req.body
        };
        
        data[collectionName].push(newItem);
        writeData(data);
        res.json(newItem);
    };
}

// Generic PUT (update)
function updateItem(collectionName) {
    return (req, res) => {
        const data = readData();
        const index = data[collectionName].findIndex(item => item.id === parseInt(req.params.id));
        
        if (index !== -1) {
            data[collectionName][index] = { ...data[collectionName][index], ...req.body };
            writeData(data);
            res.json(data[collectionName][index]);
        } else {
            res.status(404).json({ error: `${collectionName} bulunamadı` });
        }
    };
}

// Generic DELETE
function deleteItem(collectionName) {
    return (req, res) => {
        const data = readData();
        const initialLength = data[collectionName].length;
        data[collectionName] = data[collectionName].filter(item => item.id !== parseInt(req.params.id));
        
        if (data[collectionName].length < initialLength) {
            writeData(data);
            res.json({ success: true });
        } else {
            res.status(404).json({ error: `${collectionName} bulunamadı` });
        }
    };
}

// ==================== API ROUTES ====================

// ---------- Kullanıcı İşlemleri ----------
app.post('/api/register', (req, res) => {
    const data = readData();
    const { username, email, password } = req.body;
    
    // Validasyon
    if (!username || !email || !password) {
        return res.status(400).json({ error: 'Tüm alanlar doldurulmalıdır.' });
    }
    
    // Kullanıcı kontrolü
    if (data.users.find(u => u.username === username || u.email === email)) {
        return res.status(400).json({ error: 'Bu kullanıcı adı veya e-posta zaten kullanılıyor.' });
    }
    
    // Yeni kullanıcı oluştur
    const newUser = {
        id: getNextId(data.users),
        username,
        email,
        password, // Gerçek uygulamada hash'lenmeli
        role: 'user',
        createdAt: new Date().toISOString()
    };
    
    data.users.push(newUser);
    writeData(data);
    
    res.json({ 
        success: true, 
        user: sanitizeUser(newUser) 
    });
});

app.post('/api/login', (req, res) => {
    const data = readData();
    const { username, password } = req.body;
    
    // Validasyon
    if (!username || !password) {
        return res.status(400).json({ error: 'Kullanıcı adı ve şifre gereklidir.' });
    }
    
    // Kullanıcı bul (kullanıcı adı veya e-posta ile)
    const user = data.users.find(u => 
        (u.username === username || u.email === username) && 
        u.password === password
    );
    
    if (user) {
        res.json({ 
            success: true, 
            user: sanitizeUser(user) 
        });
    } else {
        res.status(401).json({ error: 'Kullanıcı adı veya şifre hatalı.' });
    }
});

// ---------- Haberler ----------
app.get('/api/news', getAllItems('news'));
app.get('/api/news/:id', getItemById('news'));
app.post('/api/news', createItem('news', { 
    date: new Date().toISOString().split('T')[0],
    author: 'Admin'
}));
app.put('/api/news/:id', updateItem('news'));
app.delete('/api/news/:id', deleteItem('news'));

// ---------- Sürücüler ----------
app.get('/api/drivers', getAllItems('drivers'));
app.get('/api/drivers/:id', getItemById('drivers'));

// ---------- Ürünler ----------
app.get('/api/products', getAllItems('products'));
app.get('/api/products/:id', getItemById('products'));
app.post('/api/products', createItem('products'));
app.put('/api/products/:id', updateItem('products'));
app.delete('/api/products/:id', deleteItem('products'));

// ---------- Şampiyonluk Sıralaması ----------
app.get('/api/standings', (req, res) => {
    const data = readData();
    res.json(data.standings || { drivers: [], teams: [] });
});

app.put('/api/standings', (req, res) => {
    const data = readData();
    const { drivers, teams } = req.body;
    
    if (!drivers || !teams) {
        return res.status(400).json({ error: 'Sürücüler ve takımlar sıralaması gereklidir.' });
    }
    
    data.standings = { drivers, teams };
    writeData(data);
    res.json(data.standings);
});

// ==================== SERVER START ====================
app.listen(PORT, () => {
    console.log(`Server çalışıyor: http://localhost:${PORT}`);
});
