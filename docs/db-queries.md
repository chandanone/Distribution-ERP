-- Insert roles
INSERT INTO roles (name, permissions) VALUES
('ADMIN', '{"grn":["create","read","update","delete"],"invoices":["create","read","update","delete"],"purchase_orders":["create","read","update","delete"],"sales_orders":["create","read","update","delete"]}'),
('MANAGER', '{"grn":["read","update"],"invoices":["read","create"],"purchase_orders":["read"],"sales_orders":["read","update"]}'),
('USER', '{"grn":["read"],"invoices":["read"],"purchase_orders":["read"],"sales_orders":["read"]}');

-- Insert admin user (replace role_id with ADMIN role id)
INSERT INTO users (name, email, password_hash, role_id, is_active)
VALUES ('Admin', 'admin@example.com', '<hashed_password>', 1, true);
