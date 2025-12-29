const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;
const dataPath = path.join(__dirname, 'data', 'data.json');

app.use(cors());
app.use(express.json());
app.use(express.static('.'));

function readData() {
    try {
        return JSON.parse(fs.readFileSync(dataPath, 'utf8'));
    } catch {
        return { news: [], products: [], users: [], standings: { drivers: [], teams: [] } };
    }
}

function writeData(data) {
    fs.writeFileSync(dataPath, JSON.stringify(data, null, 2));
}

function getNextId(items) {
    return items.length > 0 ? Math.max(...items.map(item => item.id)) + 1 : 1;
}

function sanitizeUser(user) {
    const { password, ...rest } = user;
    return rest;
}

if (!fs.existsSync(path.join(__dirname, 'data'))) {
    fs.mkdirSync(path.join(__dirname, 'data'));
}

if (!fs.existsSync(dataPath)) {
    writeData({
        news: [],
        products: [],
        users: [{ id: 1, username: 'admin', email: 'admin@redbullracing.com', password: 'admin123', role: 'admin', createdAt: new Date().toISOString() }],
        standings: { drivers: [], teams: [] }
    });
}

const getAllItems = (collectionName) => (req, res) => {
    res.json(readData()[collectionName] || []);
};

const getItemById = (collectionName) => (req, res) => {
    const item = readData()[collectionName]?.find(item => item.id === parseInt(req.params.id));
    item ? res.json(item) : res.status(404).json({ error: 'Bulunamadı' });
};

const createItem = (collectionName, defaultFields = {}) => (req, res) => {
    const data = readData();
    const newItem = { id: getNextId(data[collectionName] || []), ...defaultFields, ...req.body };
    (data[collectionName] || []).push(newItem);
    writeData(data);
    res.json(newItem);
};

const updateItem = (collectionName) => (req, res) => {
    const data = readData();
    const index = (data[collectionName] || []).findIndex(item => item.id === parseInt(req.params.id));
    if (index !== -1) {
        data[collectionName][index] = { ...data[collectionName][index], ...req.body };
        writeData(data);
        res.json(data[collectionName][index]);
    } else {
        res.status(404).json({ error: 'Bulunamadı' });
    }
};

const deleteItem = (collectionName) => (req, res) => {
    const data = readData();
    const filtered = (data[collectionName] || []).filter(item => item.id !== parseInt(req.params.id));
    if (filtered.length < (data[collectionName] || []).length) {
        data[collectionName] = filtered;
        writeData(data);
        res.json({ success: true });
    } else {
        res.status(404).json({ error: 'Bulunamadı' });
    }
};

app.post('/api/register', (req, res) => {
    const data = readData();
    const { username, email, password } = req.body;
    
    if (!username || !email || !password) {
        return res.status(400).json({ error: 'Tüm alanlar doldurulmalıdır.' });
    }
    
    if (data.users.find(u => u.username === username || u.email === email)) {
        return res.status(400).json({ error: 'Bu kullanıcı adı veya e-posta zaten kullanılıyor.' });
    }
    
    const newUser = { id: getNextId(data.users), username, email, password, role: 'user', createdAt: new Date().toISOString() };
    data.users.push(newUser);
    writeData(data);
    res.json({ success: true, user: sanitizeUser(newUser) });
});

app.post('/api/login', (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(400).json({ error: 'Kullanıcı adı ve şifre gereklidir.' });
    }
    
    const user = readData().users.find(u => (u.username === username || u.email === username) && u.password === password);
    user ? res.json({ success: true, user: sanitizeUser(user) }) : res.status(401).json({ error: 'Kullanıcı adı veya şifre hatalı.' });
});

app.get('/api/news', getAllItems('news'));
app.get('/api/news/:id', getItemById('news'));
app.post('/api/news', createItem('news', { date: new Date().toISOString().split('T')[0], author: 'Admin' }));
app.put('/api/news/:id', updateItem('news'));
app.delete('/api/news/:id', deleteItem('news'));

app.get('/api/products', getAllItems('products'));
app.post('/api/products', createItem('products'));
app.put('/api/products/:id', updateItem('products'));
app.delete('/api/products/:id', deleteItem('products'));

app.get('/api/standings', (req, res) => {
    res.json(readData().standings || { drivers: [], teams: [] });
});

app.put('/api/standings', (req, res) => {
    const { drivers, teams } = req.body;
    if (!drivers || !teams) {
        return res.status(400).json({ error: 'Sürücüler ve takımlar sıralaması gereklidir.' });
    }
    const data = readData();
    data.standings = { drivers, teams };
    writeData(data);
    res.json(data.standings);
});

app.listen(PORT, () => console.log(`Server çalışıyor: http://localhost:${PORT}`));
