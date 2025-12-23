DATABASE SCHEMA (PostgreSQL)
```
1️⃣ Roles & Users

CREATE TABLE roles (
  id SERIAL PRIMARY KEY,
  name VARCHAR(50) UNIQUE NOT NULL,
  permissions JSONB DEFAULT '[]',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(120) NOT NULL,
  email VARCHAR(120) UNIQUE NOT NULL,
  password_hash TEXT,
  google_id VARCHAR(255),
  phone VARCHAR(20),
  role_id INT REFERENCES roles(id),
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
==========

CREATE TABLE warehouses (
  id SERIAL PRIMARY KEY,
  name VARCHAR(150) NOT NULL,
  state VARCHAR(100),
  city VARCHAR(100),
  address TEXT,
  contact_person VARCHAR(120),
  phone VARCHAR(20),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
=====
CREATE TABLE vendors (
  id SERIAL PRIMARY KEY,
  name VARCHAR(200) NOT NULL,
  gst_no VARCHAR(20),
  address TEXT,
  state VARCHAR(100),
  city VARCHAR(100),
  phone VARCHAR(20),
  email VARCHAR(150),
  payment_terms VARCHAR(100),
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
=======
CREATE TABLE customers (
  id SERIAL PRIMARY KEY,
  type VARCHAR(30),  -- Dealer | Retailer | Govt | Farmer
  name VARCHAR(200) NOT NULL,
  gst_no VARCHAR(20),
  state VARCHAR(100),
  city VARCHAR(100),
  address TEXT,
  phone VARCHAR(20),
  email VARCHAR(150),
  credit_limit NUMERIC(12,2) DEFAULT 0,
  outstanding NUMERIC(12,2) DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
=====
CREATE TABLE products (
  id SERIAL PRIMARY KEY,
  name VARCHAR(200) NOT NULL,
  model VARCHAR(120) UNIQUE NOT NULL,
  brand VARCHAR(120),
  category VARCHAR(120),
  power_hp NUMERIC(5,2),
  phase VARCHAR(20),
  hsn VARCHAR(20),
  gst INT,
  warranty_months INT DEFAULT 12,
  unit VARCHAR(10) DEFAULT 'Nos',
  mrp NUMERIC(12,2),
  dealer_price NUMERIC(12,2),
  distributor_price NUMERIC(12,2),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
======
CREATE TABLE product_batches (
  id SERIAL PRIMARY KEY,
  product_id INT REFERENCES products(id),
  batch_no VARCHAR(120),
  mfg_date DATE,
  exp_warranty_date DATE,
  purchase_cost NUMERIC(12,2),
  created_at TIMESTAMP DEFAULT NOW()
);
=======
CREATE TABLE purchase_orders (
  id SERIAL PRIMARY KEY,
  po_number VARCHAR(50) UNIQUE,
  vendor_id INT REFERENCES vendors(id),
  warehouse_id INT REFERENCES warehouses(id),
  order_date DATE,
  status VARCHAR(30),
  total_amount NUMERIC(12,2),
  remarks TEXT,
  created_by INT REFERENCES users(id),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE purchase_order_items (
  id SERIAL PRIMARY KEY,
  po_id INT REFERENCES purchase_orders(id) ON DELETE CASCADE,
  product_id INT REFERENCES products(id),
  qty INT,
  rate NUMERIC(12,2),
  gst_percent INT,
  amount NUMERIC(12,2)
);
=====
=========
GRN (Goods Receipt Note)

CREATE TABLE grn (
  id SERIAL PRIMARY KEY,
  grn_number VARCHAR(50) UNIQUE,
  po_id INT REFERENCES purchase_orders(id),
  vendor_id INT REFERENCES vendors(id),
  warehouse_id INT REFERENCES warehouses(id),
  received_date DATE,
  status VARCHAR(20),
  created_by INT REFERENCES users(id),
  created_at TIMESTAMP DEFAULT NOW()
);


CREATE TABLE grn_items (
  id SERIAL PRIMARY KEY,
  grn_id INT REFERENCES grn(id) ON DELETE CASCADE,
  product_id INT REFERENCES products(id),
  qty_received INT,
  batch_no VARCHAR(120),
  serial_numbers TEXT[]
);
=====
CREATE TABLE inventory_stock (
  id SERIAL PRIMARY KEY,
  product_id INT REFERENCES products(id),
  warehouse_id INT REFERENCES warehouses(id),
  on_hand_qty INT DEFAULT 0,
  reserved_qty INT DEFAULT 0,
  available_qty INT DEFAULT 0,
  last_updated TIMESTAMP DEFAULT NOW(),
  UNIQUE(product_id, warehouse_id)
);
==============
(Optional but recommended)
CREATE TABLE inventory_movements (
  id SERIAL PRIMARY KEY,
  product_id INT REFERENCES products(id),
  warehouse_id INT REFERENCES warehouses(id),
  ref_type VARCHAR(30),
  ref_id INT,
  qty_change INT,
  created_at TIMESTAMP DEFAULT NOW()
);
=======
CREATE TABLE sales_orders (
  id SERIAL PRIMARY KEY,
  so_number VARCHAR(50) UNIQUE,
  customer_id INT REFERENCES customers(id),
  warehouse_id INT REFERENCES warehouses(id),
  order_date DATE,
  status VARCHAR(30),
  total_amount NUMERIC(12,2),
  created_by INT REFERENCES users(id),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE sales_order_items (
  id SERIAL PRIMARY KEY,
  so_id INT REFERENCES sales_orders(id) ON DELETE CASCADE,
  product_id INT REFERENCES products(id),
  qty INT,
  price NUMERIC(12,2),
  gst_percent INT,
  amount NUMERIC(12,2)
);
====
CREATE TABLE invoices (
  id SERIAL PRIMARY KEY,
  invoice_number VARCHAR(50) UNIQUE,
  so_id INT REFERENCES sales_orders(id),
  customer_id INT REFERENCES customers(id),
  warehouse_id INT REFERENCES warehouses(id),
  invoice_date DATE,
  total_taxable NUMERIC(12,2),
  total_gst NUMERIC(12,2),
  total_invoice_amount NUMERIC(12,2),
  payment_status VARCHAR(20),
  transport_id INT,
  created_by INT REFERENCES users(id),
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE invoice_items (
  id SERIAL PRIMARY KEY,
  invoice_id INT REFERENCES invoices(id) ON DELETE CASCADE,
  product_id INT REFERENCES products(id),
  qty INT,
  price NUMERIC(12,2),
  gst_percent INT,
  taxable_value NUMERIC(12,2),
  gst_value NUMERIC(12,2)
);
=======
CREATE TABLE payments (
  id SERIAL PRIMARY KEY,
  customer_id INT REFERENCES customers(id),
  invoice_id INT REFERENCES invoices(id),
  mode VARCHAR(20),
  amount NUMERIC(12,2),
  received_date DATE,
  reference_no VARCHAR(120),
  created_at TIMESTAMP DEFAULT NOW()
);
========
CREATE TABLE warranty_cards (
  id SERIAL PRIMARY KEY,
  product_id INT REFERENCES products(id),
  serial_no VARCHAR(120) UNIQUE,
  customer_id INT REFERENCES customers(id),
  invoice_id INT REFERENCES invoices(id),
  warranty_start DATE,
  warranty_end DATE,
  status VARCHAR(20)
);
========
CREATE TABLE service_jobs (
  id SERIAL PRIMARY KEY,
  job_no VARCHAR(50) UNIQUE,
  serial_no VARCHAR(120),
  product_id INT REFERENCES products(id),
  customer_id INT REFERENCES customers(id),
  complaint_date DATE,
  issue TEXT,
  status VARCHAR(30),
  work_done TEXT,
  service_cost NUMERIC(12,2),
  under_warranty BOOLEAN,
  technician VARCHAR(120),
  closed_date DATE,
  created_at TIMESTAMP DEFAULT NOW()
);
======
CREATE TABLE transport (
  id SERIAL PRIMARY KEY,
  invoice_id INT REFERENCES invoices(id),
  transporter_name VARCHAR(200),
  lr_no VARCHAR(100),
  vehicle_no VARCHAR(50),
  dispatch_date DATE,
  delivery_date DATE,
  proof_url TEXT
);
====
Important Indexes

CREATE UNIQUE INDEX idx_products_model ON products(model);
CREATE INDEX idx_inventory_product_warehouse ON inventory_stock(product_id, warehouse_id);
CREATE UNIQUE INDEX idx_invoice_number ON invoices(invoice_number);
CREATE UNIQUE INDEX idx_po_number ON purchase_orders(po_number);
CREATE UNIQUE INDEX idx_so_number ON sales_orders(so_number);
CREATE UNIQUE INDEX idx_warranty_serial ON warranty_cards(serial_no);
```
