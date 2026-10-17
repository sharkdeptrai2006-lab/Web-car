// routes/orders.js
const express = require('express');
const router = express.Router();
const { sql } = require('../config/database');
const { requireLogin } = require('../middleware/auth');

// GET /checkout -> hiển thị form nhập thông tin đặt xe
router.get('/checkout', requireLogin, (req, res) => {
    const cart = req.session.cart || [];

    if (cart.length === 0) {
        return res.redirect('/cart');
    }

    const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

    res.render('checkout', {
        cart,
        total,
        user: req.session.user,
        error: null
    });
});

// POST /checkout -> xử lý đặt xe, lưu vào SQL Server
router.post('/checkout', requireLogin, async (req, res) => {
    const cart = req.session.cart || [];

    if (cart.length === 0) {
        return res.redirect('/cart');
    }

    try {
        const { customerName, phone, email, address, note } = req.body;
        const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

        // Bước 1: Tạo đơn hàng (Orders)
        const orderRequest = new sql.Request();
        orderRequest.input('userId', sql.Int, req.session.user.id);
        orderRequest.input('customerName', sql.NVarChar, customerName);
        orderRequest.input('phone', sql.NVarChar, phone);
        orderRequest.input('email', sql.NVarChar, email);
        orderRequest.input('address', sql.NVarChar, address);
        orderRequest.input('note', sql.NVarChar, note || '');
        orderRequest.input('totalAmount', sql.Decimal(18, 2), total);

        const orderResult = await orderRequest.query(`
            INSERT INTO Orders (UserID, CustomerName, Phone, Email, Address, Note, TotalAmount, Status)
            OUTPUT INSERTED.OrderID
            VALUES (@userId, @customerName, @phone, @email, @address, @note, @totalAmount, 'PENDING')
        `);

        const newOrderId = orderResult.recordset[0].OrderID;

        // Bước 2: Lưu từng xe trong giỏ vào OrderDetails
        for (const item of cart) {
            const detailRequest = new sql.Request();
            detailRequest.input('orderId', sql.Int, newOrderId);
            detailRequest.input('carId', sql.Int, item.carId);
            detailRequest.input('quantity', sql.Int, item.quantity);
            detailRequest.input('price', sql.Decimal(18, 2), item.price);
            detailRequest.input('subtotal', sql.Decimal(18, 2), item.price * item.quantity);

            await detailRequest.query(`
                INSERT INTO OrderDetails (OrderID, CarID, Quantity, Price, Subtotal)
                VALUES (@orderId, @carId, @quantity, @price, @subtotal)
            `);
        }

        // Bước 3: Xóa giỏ hàng sau khi đặt xe thành công
        req.session.cart = [];

        // Chuyển tới trang đơn hàng, kèm thông báo thành công
        res.redirect('/orders?success=1');
    } catch (err) {
        console.error('Lỗi khi đặt xe:', err.message);
        const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
        res.render('checkout', {
            cart,
            total,
            user: req.session.user,
            error: 'Có lỗi xảy ra khi đặt xe, vui lòng thử lại.'
        });
    }
});

// GET /orders -> hiển thị danh sách đơn hàng của người dùng đang đăng nhập
router.get('/orders', requireLogin, async (req, res) => {
    try {
        const request = new sql.Request();
        request.input('userId', sql.Int, req.session.user.id);

        const ordersResult = await request.query(`
            SELECT * FROM Orders WHERE UserID = @userId ORDER BY OrderDate DESC
        `);

        const orders = ordersResult.recordset;

        // Với mỗi đơn hàng, lấy thêm chi tiết các xe trong đó
        for (const order of orders) {
            const detailRequest = new sql.Request();
            detailRequest.input('orderId', sql.Int, order.OrderID);
            const detailResult = await detailRequest.query(`
                SELECT od.*, c.CarName, c.Image
                FROM OrderDetails od
                JOIN Cars c ON od.CarID = c.CarID
                WHERE od.OrderID = @orderId
            `);
            order.items = detailResult.recordset;
        }

        res.render('orders', {
            orders,
            success: req.query.success === '1'
        });
    } catch (err) {
        console.error('Lỗi khi lấy danh sách đơn hàng:', err.message);
        res.status(500).send('Có lỗi xảy ra khi tải đơn hàng.');
    }
});

module.exports = router;