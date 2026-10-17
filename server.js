// server.js
const express = require('express');
const path = require('path');
const session = require('express-session');
const { connectDB, sql } = require('./config/database');
const carsRouter = require('./routes/cars');
const authRouter = require('./routes/auth'); // THÊM DÒNG NÀY
const cartRouter = require('./routes/cart'); // THÊM DÒNG NÀY, đặt cùng chỗ với các router khác
const ordersRouter = require('./routes/orders'); // THÊM DÒNG NÀY
const adminRouter = require('./routes/admin'); // THÊM DÒNG NÀY

const app = express();
const PORT = process.env.PORT || 3000;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Cấu hình session - PHẢI đặt trước các route
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 24 * 60 * 60 * 1000 } // Session tồn tại 24 giờ
}));

// Middleware: cho phép mọi view (.ejs) đều truy cập được req.session.user
app.use((req, res, next) => {
    res.locals.user = req.session.user || null;
    next();
});

app.get('/', async (req, res) => {
    try {
        const result = await new sql.Request().query(`
            SELECT TOP 4 c.*, cat.CategoryName
            FROM Cars c
            JOIN Categories cat ON c.CategoryID = cat.CategoryID
            ORDER BY c.CarID DESC
        `);
        res.render('home', { featuredCars: result.recordset });
    } catch (err) {
        console.error('Lỗi khi lấy xe nổi bật:', err.message);
        res.render('home', { featuredCars: [] });
    }
});

app.use('/cars', carsRouter);
app.use('/', authRouter); // THÊM DÒNG NÀY -> xử lý /login, /register, /logout
app.use('/cart', cartRouter); // THÊM DÒNG NÀY, đặt sau app.use('/', authRouter);
app.use('/', ordersRouter); // THÊM DÒNG NÀY
app.use('/admin', adminRouter); // THÊM DÒNG NÀY

async function startServer() {
    await connectDB();
    app.listen(PORT, () => {
        console.log(`🚀 Server đang chạy tại http://localhost:${PORT}`);
    });
}

startServer();