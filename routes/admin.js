// routes/admin.js
const express = require('express');
const router = express.Router();
const { sql } = require('../config/database');
const { requireAdmin } = require('../middleware/auth');

// Áp dụng requireAdmin cho TẤT CẢ route trong file này
router.use(requireAdmin);

// GET /admin -> Dashboard
router.get('/', async (req, res) => {
    try {
        const carCountResult = await new sql.Request().query('SELECT COUNT(*) AS total FROM Cars');
        const userCountResult = await new sql.Request().query('SELECT COUNT(*) AS total FROM Users');
        const orderCountResult = await new sql.Request().query('SELECT COUNT(*) AS total FROM Orders');
        const revenueResult = await new sql.Request().query(
            "SELECT ISNULL(SUM(TotalAmount), 0) AS total FROM Orders WHERE Status != 'CANCELLED'"
        );

        res.render('admin/dashboard', {
            totalCars: carCountResult.recordset[0].total,
            totalUsers: userCountResult.recordset[0].total,
            totalOrders: orderCountResult.recordset[0].total,
            totalRevenue: revenueResult.recordset[0].total
        });
    } catch (err) {
        console.error('Lỗi khi tải dashboard:', err.message);
        res.status(500).send('Có lỗi xảy ra khi tải dashboard.');
    }
});

// ===== QUẢN LÝ XE =====

// GET /admin/cars -> danh sách xe
router.get('/cars', async (req, res) => {
    try {
        const result = await new sql.Request().query(`
            SELECT c.*, cat.CategoryName
            FROM Cars c
            JOIN Categories cat ON c.CategoryID = cat.CategoryID
            ORDER BY c.CarID
        `);
        res.render('admin/cars', { cars: result.recordset });
    } catch (err) {
        console.error('Lỗi khi tải danh sách xe:', err.message);
        res.status(500).send('Có lỗi xảy ra.');
    }
});

// GET /admin/cars/add -> hiển thị form thêm xe
router.get('/cars/add', async (req, res) => {
    try {
        const categoriesResult = await new sql.Request().query('SELECT * FROM Categories');
        res.render('admin/add-car', { categories: categoriesResult.recordset, error: null });
    } catch (err) {
        console.error('Lỗi:', err.message);
        res.status(500).send('Có lỗi xảy ra.');
    }
});

// POST /admin/cars/add -> xử lý thêm xe mới
router.post('/cars/add', async (req, res) => {
    try {
        const {
            categoryId, carName, model, price, year, color, engine,
            horsepower, fuelType, transmission, seats, image, description, quantity
        } = req.body;

        const request = new sql.Request();
        request.input('categoryId', sql.Int, categoryId);
        request.input('carName', sql.NVarChar, carName);
        request.input('model', sql.NVarChar, model);
        request.input('price', sql.Decimal(18, 2), price);
        request.input('year', sql.Int, year);
        request.input('color', sql.NVarChar, color);
        request.input('engine', sql.NVarChar, engine);
        request.input('horsepower', sql.Int, horsepower);
        request.input('fuelType', sql.NVarChar, fuelType);
        request.input('transmission', sql.NVarChar, transmission);
        request.input('seats', sql.Int, seats);
        request.input('image', sql.NVarChar, image);
        request.input('description', sql.NVarChar, description);
        request.input('quantity', sql.Int, quantity);

        await request.query(`
            INSERT INTO Cars (CategoryID, CarName, Model, Price, Year, Color, Engine, Horsepower, FuelType, Transmission, Seats, Image, Description, Quantity, Status)
            VALUES (@categoryId, @carName, @model, @price, @year, @color, @engine, @horsepower, @fuelType, @transmission, @seats, @image, @description, @quantity, 'ACTIVE')
        `);

        res.redirect('/admin/cars');
    } catch (err) {
        console.error('Lỗi khi thêm xe:', err.message);
        const categoriesResult = await new sql.Request().query('SELECT * FROM Categories');
        res.render('admin/add-car', {
            categories: categoriesResult.recordset,
            error: 'Có lỗi xảy ra khi thêm xe, kiểm tra lại thông tin.'
        });
    }
});

// GET /admin/cars/edit/:id -> hiển thị form sửa xe
router.get('/cars/edit/:id', async (req, res) => {
    try {
        const carRequest = new sql.Request();
        carRequest.input('id', sql.Int, req.params.id);
        const carResult = await carRequest.query('SELECT * FROM Cars WHERE CarID = @id');

        if (carResult.recordset.length === 0) {
            return res.status(404).send('Không tìm thấy xe.');
        }

        const categoriesResult = await new sql.Request().query('SELECT * FROM Categories');

        res.render('admin/edit-car', {
            car: carResult.recordset[0],
            categories: categoriesResult.recordset,
            error: null
        });
    } catch (err) {
        console.error('Lỗi:', err.message);
        res.status(500).send('Có lỗi xảy ra.');
    }
});

// POST /admin/cars/edit/:id -> xử lý cập nhật xe
router.post('/cars/edit/:id', async (req, res) => {
    try {
        const {
            categoryId, carName, model, price, year, color, engine,
            horsepower, fuelType, transmission, seats, image, description, quantity, status
        } = req.body;

        const request = new sql.Request();
        request.input('id', sql.Int, req.params.id);
        request.input('categoryId', sql.Int, categoryId);
        request.input('carName', sql.NVarChar, carName);
        request.input('model', sql.NVarChar, model);
        request.input('price', sql.Decimal(18, 2), price);
        request.input('year', sql.Int, year);
        request.input('color', sql.NVarChar, color);
        request.input('engine', sql.NVarChar, engine);
        request.input('horsepower', sql.Int, horsepower);
        request.input('fuelType', sql.NVarChar, fuelType);
        request.input('transmission', sql.NVarChar, transmission);
        request.input('seats', sql.Int, seats);
        request.input('image', sql.NVarChar, image);
        request.input('description', sql.NVarChar, description);
        request.input('quantity', sql.Int, quantity);
        request.input('status', sql.NVarChar, status);

        await request.query(`
            UPDATE Cars SET
                CategoryID = @categoryId, CarName = @carName, Model = @model, Price = @price,
                Year = @year, Color = @color, Engine = @engine, Horsepower = @horsepower,
                FuelType = @fuelType, Transmission = @transmission, Seats = @seats,
                Image = @image, Description = @description, Quantity = @quantity, Status = @status
            WHERE CarID = @id
        `);

        res.redirect('/admin/cars');
    } catch (err) {
        console.error('Lỗi khi sửa xe:', err.message);
        res.status(500).send('Có lỗi xảy ra khi sửa xe.');
    }
});

// POST /admin/cars/delete/:id -> xóa xe
router.post('/cars/delete/:id', async (req, res) => {
    try {
        const request = new sql.Request();
        request.input('id', sql.Int, req.params.id);
        await request.query('DELETE FROM Cars WHERE CarID = @id');
        res.redirect('/admin/cars');
    } catch (err) {
        console.error('Lỗi khi xóa xe:', err.message);
        // Lỗi thường gặp: xe này đã có trong đơn hàng (Foreign Key constraint)
        res.status(500).send('Không thể xóa xe này vì đã có trong đơn hàng. Bạn có thể đổi trạng thái xe thành INACTIVE thay vì xóa.');
    }
});

// ===== QUẢN LÝ ĐƠN HÀNG =====

// GET /admin/orders -> danh sách tất cả đơn hàng
router.get('/orders', async (req, res) => {
    try {
        const result = await new sql.Request().query(`
            SELECT o.*, u.FullName AS UserFullName
            FROM Orders o
            JOIN Users u ON o.UserID = u.UserID
            ORDER BY o.OrderDate DESC
        `);
        res.render('admin/orders', { orders: result.recordset });
    } catch (err) {
        console.error('Lỗi khi tải đơn hàng:', err.message);
        res.status(500).send('Có lỗi xảy ra.');
    }
});

// POST /admin/orders/update-status/:id -> cập nhật trạng thái đơn hàng
router.post('/orders/update-status/:id', async (req, res) => {
    try {
        const { status } = req.body;
        const request = new sql.Request();
        request.input('id', sql.Int, req.params.id);
        request.input('status', sql.NVarChar, status);
        await request.query('UPDATE Orders SET Status = @status WHERE OrderID = @id');
        res.redirect('/admin/orders');
    } catch (err) {
        console.error('Lỗi khi cập nhật trạng thái:', err.message);
        res.status(500).send('Có lỗi xảy ra.');
    }
});

module.exports = router;