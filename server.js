const express = require('express');
const { users, documents, employees } = require('./data');
const app = express();
const PORT = 3000;

app.use(express.json());

// --- MIDDLEWARE: Логування ---
const loggingMiddleware = (req, res, next) => {
  const timestamp = new Date().toISOString(); // поточний час
  const method = req.method;                   // метод запиту (GET, POST, DELETE...)
  const url = req.url;                         // шлях запиту (/documents, /employees)

  console.log(`[${timestamp}] ${method} ${url}`);

  // передаємо далі до наступного middleware або маршруту
  next();
};

app.use(loggingMiddleware);

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

// Додавання нового документа (додаємо валідацію) (також лише авторизовані користувачі)
app.post('/documents', authMiddleware, (req, res) => {
  const { title, content } = req.body;

  // Перевіряємо, чи є обидва поля
  if (!title || !content) {
    return res.status(400).json({
      message: 'Bad Request. Fields "title" and "content" are required.'
    });
  }

  const newDocument = {
    id: Date.now(),
    title,
    content
  };

  documents.push(newDocument);
  res.status(201).json(newDocument);
});

// Отримання списку співробітників (тільки для адміністратора)
app.get('/employees', authMiddleware, adminOnlyMiddleware, (req, res) => {
  res.status(200).json(employees);
});

// DELETE
app.delete('/documents/:id', authMiddleware, (req, res) => {
  const documentId = parseInt(req.params.id);
  const documentIndex = documents.findIndex(doc => doc.id === documentId);

  if (documentIndex === -1) {
    return res.status(404).json({ message: 'Document not found' });
  }

  documents.splice(documentIndex, 1);
  res.status(204).send(); // 204 — успішно, але без тіла відповіді
});

// Запуск сервера
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});