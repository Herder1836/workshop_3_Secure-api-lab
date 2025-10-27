const express = require('express');
const { users, documents, employees } = require('./data');
const app = express();
const PORT = 3000;

app.use(express.json());

// --- MIDDLEWARE: Аутентифікація ---
const authMiddleware = (req, res, next) => {
  const login = req.headers['x-login'];
  const password = req.headers['x-password'];

  const user = users.find(u => u.login === login && u.password === password);

  if (!user) {
    return res.status(401).json({
      message:
        'Authentication failed. Please provide valid credentials in headers X-Login and X-Password.'
    });
  }

  req.user = user;
  next();
};

// --- MIDDLEWARE: Авторизація ---
const adminOnlyMiddleware = (req, res, next) => {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Access denied. Admin role required.' });
  }
  next();
};

// Отримання всіх документів (лише авторизовані користувачі)
app.get('/documents', authMiddleware, (req, res) => {
  res.status(200).json(documents);
});

// Додавання нового документа (також лише авторизовані користувачі)
app.post('/documents', authMiddleware, (req, res) => {
  const newDocument = req.body;
  newDocument.id = Date.now(); // створюємо унікальний id
  documents.push(newDocument);
  res.status(201).json(newDocument);
});

// Отримання списку співробітників (тільки для адміністратора)
app.get('/employees', authMiddleware, adminOnlyMiddleware, (req, res) => {
  res.status(200).json(employees);
});

// Запуск сервера
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});