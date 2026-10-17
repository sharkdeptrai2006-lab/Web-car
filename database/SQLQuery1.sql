USE MercedesCarShop;
UPDATE Users SET Role = 'ADMIN' WHERE Email = 'admin@gmail.com';

SELECT UserID, FullName, Email, Role FROM Users WHERE Email = 'admin@gmail.com';