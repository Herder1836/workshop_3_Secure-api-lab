const express = require('express');
const app = express();
const PORT = 3000;
const { documents, employees } = require('./data');
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello World! The server is running.');
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

// Список документів
app.get('/documents', (req, res) => {
  res.status(200).json(documents);
});

// Додати новий документ
app.post('/documents', (req, res) => {
  const newDoc = req.body;
  newDoc.id = Date.now();
  documents.push(newDoc);
  res.status(201).json(newDoc);
});

// Список співробітників
app.get('/employees', (req, res) => {
  res.status(200).json(employees);
});
