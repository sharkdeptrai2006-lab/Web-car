// routes/auth.js
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const { sql } = require('../config/database');

// GET /register -> hiển thị form đăng ký
router.get('/register', (req, res) => {
    res.render('register', { error: null });
});

// POST /register -> xử lý đăng ký
router.post('/register', async (req, res) => {
    try {
        const { fullName, email, password, phone, address } = req.body;

        // Kiểm tra email đã tồn tại chưa
        const checkRequest = new sql.Request();
        checkRequest.input('email', sql.NVarChar, email);
        const checkResult = await checkRequest.query(
            'SELECT * FROM Users WHERE Email = @email'
        );

        if (checkResult.recordset.length > 0) {
            return res.render('register', { error: 'Email này đã được đăng ký!' });
        }

        // Mã hóa mật khẩu trước khi lưu (KHÔNG BAO GIỜ lưu mật khẩu dạng thô)
        const hashedPassword = await bcrypt.hash(password, 10);

        const insertRequest = new sql.Request();
        insertRequest.input('fullName', sql.NVarChar, fullName);
        insertRequest.input('email', sql.NVarChar, email);
        insertRequest.input('password', sql.NVarChar, hashedPassword);
        insertRequest.input('phone', sql.NVarChar, phone);
        insertRequest.input('address', sql.NVarChar, address);

        await insertRequest.query(`
            INSERT INTO Users (FullName, Email, Password, Phone, Address, Role)
            VALUES (@fullName, @email, @password, @phone, @address, 'USER')
        `);

        res.redirect('/login');
    } catch (err) {
        console.error('Lỗi khi đăng ký:', err.message);
        res.render('register', { error: 'Có lỗi xảy ra, vui lòng thử lại.' });
    }
});

// GET /login -> hiển thị form đăng nhập
router.get('/login', (req, res) => {
    res.render('login', { error: null });
});

// POST /login -> xử lý đăng nhập
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        const request = new sql.Request();
        request.input('email', sql.NVarChar, email);
        const result = await request.query(
            'SELECT * FROM Users WHERE Email = @email'
        );

        if (result.recordset.length === 0) {
            return res.render('login', { error: 'Email hoặc mật khẩu không đúng!' });
        }

        const user = result.recordset[0];

        // So sánh mật khẩu người dùng nhập với mật khẩu đã mã hóa trong database
        const isMatch = await bcrypt.compare(password, user.Password);

        if (!isMatch) {
            return res.render('login', { error: 'Email hoặc mật khẩu không đúng!' });
        }

        // Lưu thông tin user vào session (không lưu mật khẩu vào session)
        req.session.user = {
            id: user.UserID,
            fullName: user.FullName,
            email: user.Email,
            role: user.Role
        };

        if (user.Role === 'ADMIN') {
            res.redirect('/admin');
        } else {
            res.redirect('/');
        }
    } catch (err) {
        console.error('Lỗi khi đăng nhập:', err.message);
        res.render('login', { error: 'Có lỗi xảy ra, vui lòng thử lại.' });
    }
});

// GET /logout -> đăng xuất
router.get('/logout', (req, res) => {
    req.session.destroy(() => {
        res.redirect('/');
    });
});

module.exports = router;