-- =============================
-- 1. TẠO DATABASE
-- =============================
CREATE DATABASE MercedesCarShop;
GO

USE MercedesCarShop;
GO

-- =============================
-- 2. BẢNG USERS
-- =============================
CREATE TABLE Users (
    UserID INT IDENTITY(1,1) PRIMARY KEY,
    FullName NVARCHAR(100) NOT NULL,
    Email NVARCHAR(100) NOT NULL UNIQUE,
    Password NVARCHAR(255) NOT NULL,
    Phone NVARCHAR(20),
    Address NVARCHAR(255),
    Role NVARCHAR(10) NOT NULL DEFAULT 'USER', -- USER hoặc ADMIN
    CreatedAt DATETIME DEFAULT GETDATE()
);
GO

-- =============================
-- 3. BẢNG CATEGORIES
-- =============================
CREATE TABLE Categories (
    CategoryID INT IDENTITY(1,1) PRIMARY KEY,
    CategoryName NVARCHAR(50) NOT NULL,
    Description NVARCHAR(255)
);
GO

-- =============================
-- 4. BẢNG CARS
-- =============================
CREATE TABLE Cars (
    CarID INT IDENTITY(1,1) PRIMARY KEY,
    CategoryID INT NOT NULL,
    CarName NVARCHAR(100) NOT NULL,
    Model NVARCHAR(50),
    Price DECIMAL(18,2) NOT NULL,
    Year INT,
    Color NVARCHAR(50),
    Engine NVARCHAR(100),
    Horsepower INT,
    FuelType NVARCHAR(50),
    Transmission NVARCHAR(50),
    Seats INT,
    Image NVARCHAR(255),
    Description NVARCHAR(MAX),
    Quantity INT DEFAULT 0,
    Status NVARCHAR(20) DEFAULT 'ACTIVE',
    CreatedAt DATETIME DEFAULT GETDATE(),
    FOREIGN KEY (CategoryID) REFERENCES Categories(CategoryID)
);
GO

-- =============================
-- 5. BẢNG ORDERS
-- =============================
CREATE TABLE Orders (
    OrderID INT IDENTITY(1,1) PRIMARY KEY,
    UserID INT NOT NULL,
    OrderDate DATETIME DEFAULT GETDATE(),
    CustomerName NVARCHAR(100),
    Phone NVARCHAR(20),
    Email NVARCHAR(100),
    Address NVARCHAR(255),
    Note NVARCHAR(255),
    TotalAmount DECIMAL(18,2),
    Status NVARCHAR(20) DEFAULT 'PENDING',
    FOREIGN KEY (UserID) REFERENCES Users(UserID)
);
GO

-- =============================
-- 6. BẢNG ORDERDETAILS
-- =============================
CREATE TABLE OrderDetails (
    OrderDetailID INT IDENTITY(1,1) PRIMARY KEY,
    OrderID INT NOT NULL,
    CarID INT NOT NULL,
    Quantity INT NOT NULL,
    Price DECIMAL(18,2) NOT NULL,
    Subtotal DECIMAL(18,2) NOT NULL,
    FOREIGN KEY (OrderID) REFERENCES Orders(OrderID),
    FOREIGN KEY (CarID) REFERENCES Cars(CarID)
);
GO

-- =============================
-- 7. DỮ LIỆU MẪU: CATEGORIES
-- =============================
INSERT INTO Categories (CategoryName, Description) VALUES
(N'A-Class', N'Dòng xe hạng sang cỡ nhỏ'),
(N'C-Class', N'Dòng sedan hạng sang cỡ trung'),
(N'E-Class', N'Dòng sedan hạng sang cỡ lớn'),
(N'S-Class', N'Dòng sedan flagship cao cấp nhất'),
(N'GLC', N'Dòng SUV cỡ trung'),
(N'GLE', N'Dòng SUV cỡ lớn'),
(N'GLS', N'Dòng SUV flagship'),
(N'AMG', N'Dòng xe hiệu suất cao');
GO

-- =============================
-- 8. DỮ LIỆU MẪU: CARS (15 xe)
-- =============================
INSERT INTO Cars (CategoryID, CarName, Model, Price, Year, Color, Engine, Horsepower, FuelType, Transmission, Seats, Image, Description, Quantity, Status) VALUES
(1, N'Mercedes-Benz A 200', N'A 200', 1399000000, 2024, N'Trắng', N'1.3L Turbo', 163, N'Xăng', N'Tự động', 5, N'a200.jpg', N'Mẫu xe hạng sang cỡ nhỏ năng động.', 5, 'ACTIVE'),
(1, N'Mercedes-Benz A 250', N'A 250', 1599000000, 2024, N'Đen', N'2.0L Turbo', 224, N'Xăng', N'Tự động', 5, N'a250.jpg', N'Phiên bản mạnh mẽ hơn của dòng A-Class.', 4, 'ACTIVE'),
(2, N'Mercedes-Benz C 200', N'C 200', 1799000000, 2024, N'Bạc', N'1.5L Turbo', 204, N'Xăng', N'Tự động', 5, N'c200.jpg', N'Sedan hạng sang tiêu chuẩn.', 6, 'ACTIVE'),
(2, N'Mercedes-Benz C 300 AMG', N'C 300 AMG', 2299000000, 2024, N'Xám', N'2.0L Turbo', 258, N'Xăng', N'Tự động', 5, N'c300amg.jpg', N'Phiên bản thể thao AMG của C-Class.', 3, 'ACTIVE'),
(3, N'Mercedes-Benz E 200', N'E 200', 2599000000, 2024, N'Đen', N'2.0L Turbo', 204, N'Xăng', N'Tự động', 5, N'e200.jpg', N'Sedan doanh nhân hạng sang.', 4, 'ACTIVE'),
(3, N'Mercedes-Benz E 300 AMG', N'E 300 AMG', 3199000000, 2024, N'Trắng', N'2.0L Turbo', 258, N'Xăng', N'Tự động', 5, N'e300amg.jpg', N'Phiên bản AMG mạnh mẽ của E-Class.', 3, 'ACTIVE'),
(4, N'Mercedes-Benz S 450', N'S 450', 5499000000, 2024, N'Đen', N'3.0L Turbo', 367, N'Xăng', N'Tự động', 5, N's450.jpg', N'Sedan flagship đẳng cấp nhất.', 2, 'ACTIVE'),
(4, N'Mercedes-Benz S 500', N'S 500', 6299000000, 2024, N'Xám', N'3.0L Turbo', 435, N'Xăng', N'Tự động', 5, N's500.jpg', N'Phiên bản cao cấp nhất của S-Class.', 2, 'ACTIVE'),
(5, N'Mercedes-Benz GLC 200', N'GLC 200', 2099000000, 2024, N'Trắng', N'2.0L Turbo', 204, N'Xăng', N'Tự động', 5, N'glc200.jpg', N'SUV cỡ trung linh hoạt.', 5, 'ACTIVE'),
(5, N'Mercedes-Benz GLC 300', N'GLC 300', 2499000000, 2024, N'Đen', N'2.0L Turbo', 258, N'Xăng', N'Tự động', 5, N'glc300.jpg', N'SUV mạnh mẽ hơn với động cơ 2.0L.', 4, 'ACTIVE'),
(6, N'Mercedes-Benz GLE 450', N'GLE 450', 4199000000, 2024, N'Bạc', N'3.0L Turbo', 375, N'Xăng', N'Tự động', 5, N'gle450.jpg', N'SUV hạng sang cỡ lớn.', 3, 'ACTIVE'),
(6, N'Mercedes-Benz GLE 53 AMG', N'GLE 53 AMG', 5299000000, 2024, N'Đen', N'3.0L Turbo', 435, N'Xăng', N'Tự động', 5, N'gle53amg.jpg', N'Phiên bản hiệu suất cao của GLE.', 2, 'ACTIVE'),
(7, N'Mercedes-Benz GLS 450', N'GLS 450', 5899000000, 2024, N'Trắng', N'3.0L Turbo', 367, N'Xăng', N'Tự động', 7, N'gls450.jpg', N'SUV 7 chỗ flagship.', 2, 'ACTIVE'),
(7, N'Mercedes-Benz GLS 600', N'GLS 600', 8299000000, 2024, N'Đen', N'4.0L V8 Turbo', 557, N'Xăng', N'Tự động', 7, N'gls600.jpg', N'SUV flagship cao cấp nhất, động cơ V8.', 1, 'ACTIVE'),
(8, N'Mercedes-AMG C 43', N'AMG C 43', 2799000000, 2024, N'Xám', N'2.0L Turbo', 402, N'Xăng', N'Tự động', 5, N'amgc43.jpg', N'Mẫu xe hiệu suất cao thuộc dòng AMG.', 2, 'ACTIVE');
GO

-- =============================
-- Check ds xe
-- =============================
USE MercedesCarShop;
SELECT CarID, CarName, Image FROM Cars;


