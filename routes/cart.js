// routes/cart.js
const express = require('express');
const router = express.Router();
const { sql } = require('../config/database');

// GET /cart -> hiển thị giỏ hàng
router.get('/', (req, res) => {
    // Nếu session chưa có giỏ hàng, khởi tạo mảng rỗng
    const cart = req.session.cart || [];

    // Tính tổng tiền
    const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

    res.render('cart', { cart, total });
});

// POST /cart/add -> thêm xe vào giỏ
router.post('/add', async (req, res) => {
    try {
        const { carId } = req.body;

        // Lấy thông tin xe từ database
        const request = new sql.Request();
        request.input('id', sql.Int, carId);
        const result = await request.query('SELECT * FROM Cars WHERE CarID = @id');

        if (result.recordset.length === 0) {
            return res.redirect('/cars');
        }

        const car = result.recordset[0];

        // Khởi tạo giỏ hàng trong session nếu chưa có
        if (!req.session.cart) {
            req.session.cart = [];
        }

        // Kiểm tra xe này đã có trong giỏ chưa
        const existingItem = req.session.cart.find(item => item.carId === car.CarID);

        if (existingItem) {
            // Nếu đã có, tăng số lượng lên 1
            existingItem.quantity += 1;
        } else {
            // Nếu chưa có, thêm mới vào giỏ với số lượng 1
            req.session.cart.push({
                carId: car.CarID,
                carName: car.CarName,
                image: car.Image,
                price: car.Price,
                quantity: 1
            });
        }

        res.redirect('/cart');
    } catch (err) {
        console.error('Lỗi khi thêm vào giỏ:', err.message);
        res.redirect('/cars');
    }
});

// POST /cart/update -> tăng/giảm số lượng
router.post('/update', (req, res) => {
    const { carId, action } = req.body;
    const cart = req.session.cart || [];

    const item = cart.find(item => item.carId === parseInt(carId));

    if (item) {
        if (action === 'increase') {
            item.quantity += 1;
        } else if (action === 'decrease') {
            item.quantity -= 1;
            if (item.quantity <= 0) {
                // Nếu giảm về 0, xóa luôn xe khỏi giỏ
                req.session.cart = cart.filter(i => i.carId !== parseInt(carId));
            }
        }
    }

    res.redirect('/cart');
});

// POST /cart/remove -> xóa 1 xe khỏi giỏ
router.post('/remove', (req, res) => {
    const { carId } = req.body;
    const cart = req.session.cart || [];

    req.session.cart = cart.filter(item => item.carId !== parseInt(carId));

    res.redirect('/cart');
});

module.exports = router;