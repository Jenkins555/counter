// counter.js
const express = require('express');
const mongoose = require('mongoose');
const app = express();
const PORT = process.env.PORT || 3001;

// Подключение к MongoDB
mongoose.connect('mongodb://admin:123@localhost:27017/counter_database', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
});

mongoose.connection.on('connected', () => {
  console.log('Connected to MongoDB');
});

// Модель счетчика
const Counter = mongoose.model('Counter', new mongoose.Schema({
  bookId: String,
  count: Number,
}));

// Middleware для парсинга JSON
app.use(express.json());

// Увеличение счетчика для книги
app.post('/counter/:bookId/incr', async (req, res) => {
  const { bookId } = req.params;
  try {
    let counter = await Counter.findOne({ bookId });
    if (!counter) {
      counter = new Counter({ bookId, count: 1 });
    } else {
      counter.count++;
    }
    await counter.save();
    res.json({ bookId, count: counter.count });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// Получение значения счетчика для книги
app.get('/counter/:bookId', async (req, res) => {
  const { bookId } = req.params;
  try {
    const counter = await Counter.findOne({ bookId });
    if (counter) {
      res.json({ bookId, count: counter.count });
    } else {
      res.status(404).json({ message: 'Book not found' });
    }
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

app.listen(PORT, () => {
  console.log(`Counter app is running on port ${PORT}`);
});
