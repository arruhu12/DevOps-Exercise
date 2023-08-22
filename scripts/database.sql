use buku_sawit;
CREATE TABLE IF NOT EXISTS Users (
	id varchar(36) NOT NULL PRIMARY KEY,
	email varchar(50) NOT NULL,
	password varchar(100) NOT NULL,
	phone_number varchar(15),
	is_active boolean DEFAULT false,
	created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ,
	updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
CREATE TABLE IF NOT EXISTS Customers (
  id int NOT NULL AUTO_INCREMENT PRIMARY KEY,
  user_id varchar(36) NOT NULL,
  first_name varchar(100),
  last_name varchar(100),
  company_name varchar(100),
  company_address text,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
CREATE TABLE IF NOT EXISTS Employees (
  id varchar(36) PRIMARY KEY,
  customer_id int NOT NULL,
  name varchar(150) NOT NULL,
  phone_number varchar(15),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
CREATE TABLE IF NOT EXISTS Accounts (
	id varchar(36) PRIMARY KEY,
	employee_id varchar(36) NOT NULL,
	username varchar(50) NOT NULL,
	password varchar(100) NOT NULL,
	role varchar(20) NOT NULL,
	created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
CREATE TABLE IF NOT EXISTS Login_Activities (
	id varchar(36) PRIMARY KEY,
	name varchar(200) NOT NULL,
	username varchar(30) NOT NULL,
	ip_address varchar(15) NOT NULL,
	device_type varchar(30) NOT NULL,
	operating_system varchar(30) NOT NULL,
	created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE IF NOT EXISTS Subscription_Status (
  customer_id int NOT NULL,
  package_id varchar(36) NOT NULL,
  is_active bool NOT NULL,
  expired_at datetime NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
CREATE TABLE IF NOT EXISTS Orders (
  id varchar(36) PRIMARY KEY,
  customer_id int NOT NULL,
  customer_ip varchar(15),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
CREATE TABLE IF NOT EXISTS Order_Items (
  order_id varchar(36) NOT NULL,
  order_type varchar(10),
  package_id varchar(36) NOT NULL,
  item_amount int,
  item_discount int,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
CREATE TABLE IF NOT EXISTS Payments (
  id varchar(36) PRIMARY KEY,
  invoice_id int NOT NULL,
  payment_gateway_id varchar(36),
  payment_method varchar(30),
  account_number varchar(40),
  payment_status varchar(10),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
CREATE TABLE IF NOT EXISTS Invoices (
  id int PRIMARY KEY,
  order_id varchar(36) NOT NULL,
  customer_name varchar(100),
  customer_address text,
  customer_email varchar(50),
  customer_phone_number varchar(15),
  seller_name varchar(100),
  seller_address text,
  seller_email varchar(50),
  seller_phone_number varchar(15),
  amount int,
  discount int,
  tax int DEFAULT 0,
  administrative_cost int,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
CREATE TABLE IF NOT EXISTS Invoice_Items (
  invoice_id int NOT NULL,
  invoice_type varchar(10),
  item_name varchar(50),
  item_amount int,
  item_discount int,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
CREATE TABLE IF NOT EXISTS Subscription_Packages (
  id varchar(36) PRIMARY KEY,
  name varchar(50),
  price int,
  discount int,
  duration int,
  description text,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
CREATE TABLE IF NOT EXISTS Product_Transactions (
  id varchar(36) PRIMARY KEY,
  transaction_type ENUM('sale', 'purchase') NOT NULL,
  product_id varchar(36) NOT NULL,
  supplier_id varchar(36) NOT NULL,
  gross_weight int,
  tare_weight int,
  deduction_percentage int,
  received_weight int,
  vehicle_registration_number varchar(13),
  payment_status varchar(15),
  delivery_status varchar(10),
  payment_method varchar(10),
  source_of_purchase varchar(100),
  additional_notes text,
  created_by varchar(36) NOT NULL,
  updated_by varchar(36),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
CREATE TABLE IF NOT EXISTS Product_Transaction_Images (
  transaction_image_id varchar(36) PRIMARY KEY,
  transaction_id varchar(36) NOT NULL,
  image_owner_id varchar(36) NOT NULL,
  image_type varchar(20) NOT NULL,
  image_path varchar(150) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
CREATE TABLE IF NOT EXISTS Products (
  id varchar(36) PRIMARY KEY,
  customer_id int NOT NULL,
  name varchar(50),
  price int,
  stock int DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
CREATE TABLE IF NOT EXISTS Suppliers (
  id varchar(36) PRIMARY KEY,
  customer_id int NOT NULL,
  name varchar(50),
  address varchar(150),
  phone_number varchar(15),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
CREATE TABLE IF NOT EXISTS Transaction_Modification_Requests (
  request_id varchar(36) PRIMARY KEY,
  employee_id varchar(36) NOT NULL,
  transaction_id varchar(36) NOT NULL,
  requested_changes text,
  reason varchar(200),
  Status varchar(15),
  processed_by varchar(36) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
ALTER TABLE Customers ADD FOREIGN KEY (user_id) REFERENCES Users (id);
ALTER TABLE Employees ADD FOREIGN KEY (customer_id) REFERENCES Customers (id);
ALTER TABLE Accounts ADD FOREIGN KEY (employee_id) REFERENCES Employees (id);
ALTER TABLE Subscription_Status ADD FOREIGN KEY (customer_id) REFERENCES Customers (id);
ALTER TABLE Subscription_Status ADD FOREIGN KEY (package_id) REFERENCES Subscription_Packages (id);
ALTER TABLE Invoices ADD FOREIGN KEY (order_id) REFERENCES Orders (id);
ALTER TABLE Payments ADD FOREIGN KEY (invoice_id) REFERENCES Invoices (id);
ALTER TABLE Invoice_Items ADD FOREIGN KEY (invoice_id) REFERENCES Invoices (id);
ALTER TABLE Orders ADD FOREIGN KEY (customer_id) REFERENCES Customers (id);
ALTER TABLE Order_Items ADD FOREIGN KEY (order_id) REFERENCES Orders (id);
ALTER TABLE Order_Items ADD FOREIGN KEY (package_id) REFERENCES Subscription_Packages (id);
ALTER TABLE Product_Transactions ADD FOREIGN KEY (created_by) REFERENCES Employees (id);
ALTER TABLE Product_Transactions ADD FOREIGN KEY (updated_by) REFERENCES Employees (id);
ALTER TABLE Product_Transactions ADD FOREIGN KEY (product_id) REFERENCES Products (id);
ALTER TABLE Product_Transactions ADD FOREIGN KEY (supplier_id) REFERENCES Suppliers (id);
ALTER TABLE Products ADD FOREIGN KEY (customer_id) REFERENCES Customers (id);
ALTER TABLE Suppliers ADD FOREIGN KEY (customer_id) REFERENCES Customers (id);
ALTER TABLE Product_Transaction_Images ADD FOREIGN KEY (transaction_id) REFERENCES Product_Transactions (id);
ALTER TABLE Transaction_Modification_Requests ADD FOREIGN KEY (employee_id) REFERENCES Employees (id);
ALTER TABLE Transaction_Modification_Requests ADD FOREIGN KEY (transaction_id) REFERENCES Product_Transactions (id);
ALTER TABLE Transaction_Modification_Requests ADD FOREIGN KEY (processed_by) REFERENCES Employees (id);
