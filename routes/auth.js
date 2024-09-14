const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const router = express.Router();

// Register Route
router.post('/register', async (req, res) => {
    const { username, email, password, fullName } = req.body;

    try {
        // เช็คว่าผู้ใช้งานมีอยู่แล้วหรือไม่
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).send('User already exists');
        }

        // เข้ารหัสรหัสผ่าน
        const hashedPassword = await bcrypt.hash(password, 10);

        // สร้างผู้ใช้ใหม่
        const user = new User({
            username,
            email,
            password: hashedPassword,
            fullName
        });

        await user.save();
        res.redirect('/login'); // หลังจากสมัครสำเร็จจะไปหน้า login
    } catch (err) {
        res.status(500).send('Error registering user');
    }
});

// Login Route
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        // ค้นหาผู้ใช้ในระบบ
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).send('Invalid email or password');
        }

        // ตรวจสอบรหัสผ่าน
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).send('Invalid email or password');
        }

        // สร้าง JWT
        const token = jwt.sign({ id: user._id }, 'secretKey', { expiresIn: '1h' });
        res.cookie('token', token, { httpOnly: true });
        res.redirect('/profile');
    } catch (err) {
        res.status(500).send('Error logging in');
    }
});

// Profile Route
router.get('/profile', async (req, res) => {
    try {
        const token = req.cookies.token;
        const decoded = jwt.verify(token, 'secretKey');
        const user = await User.findById(decoded.id);

        res.render('profile', { user });
    } catch (err) {
        res.status(401).send('Unauthorized');
    }
});

module.exports = router;
