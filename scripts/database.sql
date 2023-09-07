use buku_sawit;

CREATE TABLE IF NOT EXISTS users (
	id varchar(36) NOT NULL PRIMARY KEY,
	email varchar(50) NOT NULL,
  username varchar(50) NOT NULL,
	password varchar(100) NOT NULL,
	phone_number varchar(15),
	is_active boolean DEFAULT false,
  roles varchar(100),
	created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ,
	updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX(is_active, roles),
  UNIQUE KEY (email, phone_number, username)
);
CREATE TABLE IF NOT EXISTS customers (
  id bigint unsigned NOT NULL AUTO_INCREMENT PRIMARY KEY,
  user_id varchar(36) NOT NULL,
  first_name varchar(100),
  last_name varchar(100),
  company_name varchar(100),
  company_address text,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
CREATE TABLE IF NOT EXISTS employees (
  id varchar(36) PRIMARY KEY,
  user_id varchar(36) NOT NULL,
  customer_id bigint unsigned NOT NULL,
  name varchar(150) NOT NULL,
  phone_number varchar(15),
  is_farmer boolean DEFAULT false,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
CREATE TABLE IF NOT EXISTS login_activities (
	id varchar(36) PRIMARY KEY,
	name varchar(200) NOT NULL,
	username varchar(30) NOT NULL,
	ip_address varchar(15) NOT NULL,
	device_type varchar(30) NOT NULL,
	operating_system varchar(30) NOT NULL,
	created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE IF NOT EXISTS subscription_status (
  customer_id bigint unsigned NOT NULL,
  package_id varchar(36) NOT NULL,
  is_active bool NOT NULL,
  expired_at datetime NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
CREATE TABLE IF NOT EXISTS orders (
  id varchar(36) PRIMARY KEY,
  customer_id bigint unsigned NOT NULL,
  customer_ip varchar(15),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
CREATE TABLE IF NOT EXISTS order_items (
  order_id varchar(36) NOT NULL,
  order_type varchar(10),
  package_id varchar(36) NOT NULL,
  item_amount int unsigned,
  item_discount int unsigned,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
CREATE TABLE IF NOT EXISTS payments (
  id varchar(36) PRIMARY KEY,
  invoice_id bigint unsigned NOT NULL,
  payment_gateway_id varchar(36),
  payment_method varchar(30),
  account_number varchar(40),
  payment_status varchar(10),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX(payment_gateway_id, payment_method, payment_status, account_number)
);
CREATE TABLE IF NOT EXISTS invoices (
  id bigint unsigned PRIMARY KEY,
  order_id varchar(36) NOT NULL,
  customer_name varchar(100),
  customer_address text,
  customer_email varchar(50),
  customer_phone_number varchar(15),
  seller_name varchar(100),
  seller_address text,
  seller_email varchar(50),
  seller_phone_number varchar(15),
  amount int unsigned,
  discount tinyint unsigned,
  tax tinyint unsigned DEFAULT 0,
  administrative_cost int unsigned,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
CREATE TABLE IF NOT EXISTS invoice_items (
  invoice_id bigint unsigned NOT NULL,
  invoice_type varchar(10),
  item_name varchar(50),
  item_amount int unsigned,
  item_discount int unsigned,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
CREATE TABLE IF NOT EXISTS subscription_packages (
  id varchar(36) PRIMARY KEY,
  name varchar(50),
  price int unsigned,
  discount tinyint unsigned,
  duration tinyint unsigned,
  description text,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
CREATE TABLE IF NOT EXISTS product_transactions (
  id varchar(36) PRIMARY KEY,
  transaction_type ENUM('sale', 'purchase') NOT NULL,
  product_id varchar(36) NOT NULL,
  supplier_id varchar(36),
  gross_weight int unsigned,
  tare_weight int unsigned,
  deduction_percentage tinyint unsigned,
  delivered_weight int unsigned,
  price int unsigned NOT NULL,
  vehicle_registration_number varchar(13) NOT NULL,
  payment_status ENUM ('paid', 'unpaid') NOT NULL,
  delivery_status ENUM ('fully delivered', 'partially delivered', 'undelivered') NOT NULL,
  payment_method ENUM ('cash', 'transfer') NOT NULL,
  longitude decimal(9,6) NOT NULL,
  latitude decimal(8,6) NOT NULL,
  source_of_purchase varchar(100),
  additional_notes text,
  created_by varchar(36) NOT NULL,
  updated_by varchar(36),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX (
    transaction_type, vehicle_registration_number, payment_method, 
    payment_status, delivery_status, created_at, updated_at
  )
);
CREATE TABLE IF NOT EXISTS product_transaction_images (
  id varchar(36) PRIMARY KEY,
  customer_id bigint unsigned NOT NULL,
  transaction_id varchar(36) NOT NULL,
  image_type varchar(20) NOT NULL,
  image_path varchar(150) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX (created_at, updated_at)
);
CREATE TABLE IF NOT EXISTS products (
  id varchar(36) PRIMARY KEY,
  customer_id bigint unsigned NOT NULL,
  name varchar(50) NOT NULL,
  buy_price int unsigned NOT NULL DEFAULT 0,
  sell_price int unsigned NOT NULL DEFAULT 0,
  stock int unsigned NOT NULL DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
CREATE TABLE IF NOT EXISTS suppliers (
  id varchar(36) PRIMARY KEY,
  customer_id bigint unsigned NOT NULL,
  name varchar(50) NOT NULL,
  address varchar(150) NOT NULL,
  phone_number varchar(15) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
CREATE TABLE IF NOT EXISTS transaction_modification_requests (
  request_id varchar(36) PRIMARY KEY,
  employee_id varchar(36) NOT NULL,
  transaction_id varchar(36) NOT NULL,
  requested_changes text,
  reason varchar(200),
  Status varchar(15),
  processed_by varchar(36) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
ALTER TABLE customers ADD FOREIGN KEY (user_id) REFERENCES users (id);
ALTER TABLE employees ADD FOREIGN KEY (user_id) REFERENCES users (id);
ALTER TABLE employees ADD FOREIGN KEY (customer_id) REFERENCES customers (id);
ALTER TABLE subscription_status ADD FOREIGN KEY (customer_id) REFERENCES customers (id);
ALTER TABLE subscription_status ADD FOREIGN KEY (package_id) REFERENCES subscription_packages (id);
ALTER TABLE invoices ADD FOREIGN KEY (order_id) REFERENCES orders (id);
ALTER TABLE payments ADD FOREIGN KEY (invoice_id) REFERENCES invoices (id);
ALTER TABLE invoice_items ADD FOREIGN KEY (invoice_id) REFERENCES invoices (id);
ALTER TABLE orders ADD FOREIGN KEY (customer_id) REFERENCES customers (id);
ALTER TABLE order_items ADD FOREIGN KEY (order_id) REFERENCES orders (id);
ALTER TABLE order_items ADD FOREIGN KEY (package_id) REFERENCES subscription_packages (id);
ALTER TABLE product_transactions ADD FOREIGN KEY (created_by) REFERENCES users (id);
ALTER TABLE product_transactions ADD FOREIGN KEY (updated_by) REFERENCES users (id);
ALTER TABLE product_transactions ADD FOREIGN KEY (product_id) REFERENCES products (id);
ALTER TABLE product_transactions ADD FOREIGN KEY (supplier_id) REFERENCES suppliers (id);
ALTER TABLE products ADD FOREIGN KEY (customer_id) REFERENCES customers (id);
ALTER TABLE suppliers ADD FOREIGN KEY (customer_id) REFERENCES customers (id);
ALTER TABLE product_transaction_images ADD FOREIGN KEY (customer_id) REFERENCES customers (id);
ALTER TABLE product_transaction_images ADD FOREIGN KEY (transaction_id) REFERENCES product_transactions (id);
ALTER TABLE transaction_modification_requests ADD FOREIGN KEY (employee_id) REFERENCES users (id);
ALTER TABLE transaction_modification_requests ADD FOREIGN KEY (transaction_id) REFERENCES product_transactions (id);
ALTER TABLE transaction_modification_requests ADD FOREIGN KEY (processed_by) REFERENCES users (id);
