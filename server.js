const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = 3000;

const DATA_DIR = path.join(__dirname, 'data');
const DATA_PATH = path.join(DATA_DIR, 'data.json');

app.use(cors());
app.use(express.json());
app.use(express.static('.'));

function readData() {
    try {
        const data = fs.readFileSync(DATA_PATH, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        return {
            news: [],
            products: [],
            users: []
        };
    }
}

function writeData(data) {
    if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(DATA_PATH, JSON.stringify(data, null, 2), 'utf8');
}

function getNextId(items) {
    if (!items || items.length === 0) return 1;
    return Math.max(...items.map(item => item.id)) + 1;
}

function sanitizeUser(user) {
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
}

if (!fs.existsSync(DATA_PATH)) {
    writeData({
        news: [],
        products: [],
        users: [{
            id: 1,
            username: 'admin',
            email: 'admin@redbullracing.com',
            password: 'admin123',
            role: 'admin',
            createdAt: new Date().toISOString()
        }]
    });
}

app.post('/api/register', (req, res) => {
    const data = readData();
    const { username, email, password } = req.body;
    
    const newUser = {
        id: getNextId(data.users),
        username,
        email,
        password,
        role: 'user',
        createdAt: new Date().toISOString()
    };
    
    data.users.push(newUser);
    writeData(data);
    
    res.json({ success: true, user: sanitizeUser(newUser) });
});

app.post('/api/login', (req, res) => {
    const { username, password } = req.body;
    const data = readData();
    
    const user = data.users.find(u => 
        (u.username === username || u.email === username) && u.password === password
    );
    
    if (user) {
        res.json({ success: true, user: sanitizeUser(user) });
    } else {
        res.status(401).json({ error: 'Kullanıcı adı veya şifre hatalı.' });
    }
});

app.get('/api/news', (req, res) => {
    const data = readData();
    res.json(data.news || []);
});

app.get('/api/news/:id', (req, res) => {
    const data = readData();
    const newsItem = data.news.find(item => item.id === parseInt(req.params.id));
    res.json(newsItem || {});
});

app.post('/api/news', (req, res) => {
    const data = readData();
    const newItem = {
        id: getNextId(data.news),
        date: new Date().toISOString().split('T')[0],
        author: 'Admin',
        ...req.body
    };
    
    if (!data.news) data.news = [];
    data.news.push(newItem);
    writeData(data);
    
    res.status(201).json(newItem);
});

app.put('/api/news/:id', (req, res) => {
    const data = readData();
    const index = data.news.findIndex(item => item.id === parseInt(req.params.id));
    
    if (index !== -1) {
        data.news[index] = { ...data.news[index], ...req.body };
        writeData(data);
        res.json(data.news[index]);
    } else {
        res.json({});
    }
});

app.delete('/api/news/:id', (req, res) => {
    const data = readData();
    data.news = data.news.filter(item => item.id !== parseInt(req.params.id));
    writeData(data);
    res.json({ success: true });
});

app.get('/api/products', (req, res) => {
    const data = readData();
    res.json(data.products || []);
});

app.post('/api/products', (req, res) => {
    const data = readData();
    const newItem = {
        id: getNextId(data.products),
        ...req.body
    };
    
    if (!data.products) data.products = [];
    data.products.push(newItem);
    writeData(data);
    
    res.status(201).json(newItem);
});

app.put('/api/products/:id', (req, res) => {
    const data = readData();
    const index = data.products.findIndex(item => item.id === parseInt(req.params.id));
    
    if (index !== -1) {
        data.products[index] = { ...data.products[index], ...req.body };
        writeData(data);
        res.json(data.products[index]);
    } else {
        res.json({});
    }
});

app.delete('/api/products/:id', (req, res) => {
    const data = readData();
    data.products = data.products.filter(item => item.id !== parseInt(req.params.id));
    writeData(data);
    res.json({ success: true });
});

app.listen(PORT, () => {
    console.log(`Server çalışıyor: http://localhost:${PORT}`);
});

