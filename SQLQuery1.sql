SELECT DISTINCT u.Id, u.FullName, u.Email
FROM Users u
INNER JOIN Carts c
    ON u.Id = c.UserID
INNER JOIN CartItems ci
    ON c.Id = ci.CartID;



	select *from Carts
	select *from CartItems
	select * from Users
	select * from Orders
	select * from Payments
	select *from Products
	select *from Reviews
