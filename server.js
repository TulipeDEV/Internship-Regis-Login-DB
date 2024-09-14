const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const authRoutes = require('./routes/auth');

const app = express();

// ตั้งค่า EJS เป็น template engine
app.set('view engine', 'ejs');

// ใช้ body-parser และ cookie-parser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

// เชื่อมต่อ MongoDB
mongoose.connect('mongodb+srv://admin:1234@cluster0.v4hv4.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0')
.then(() => console.log('MongoDB Connected'))
.catch(err => console.log('Error connecting to MongoDB:', err));

// Routes
app.use('/', authRoutes);

// แสดงหน้า register และ login
app.get('/register', (req, res) => {
    res.render('register');
});

app.get('/login', (req, res) => {
    res.render('login');
});

// เริ่มเซิร์ฟเวอร์
app.listen(3000, () => {
    console.log('Server running on http://localhost:3000');
});
