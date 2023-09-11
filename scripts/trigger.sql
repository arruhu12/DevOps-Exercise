use buku_sawit;

DELIMITER //
CREATE TRIGGER after_insert_transaction
AFTER INSERT ON transactions
FOR EACH ROW
BEGIN
    IF NEW.transaction_type = 'sale' THEN
        UPDATE products
        SET stock = stock - NEW.delivered_weight
        WHERE id = NEW.product_id;
    END IF;
END;//

CREATE TRIGGER after_update_transaction
AFTER UPDATE ON transactions
FOR EACH ROW
BEGIN
	DECLARE weight_difference INT4;
    SET weight_difference = IF(OLD.delivered_weight IS NULL, 
        NEW.delivered_weight, NEW.delivered_weight - OLD.delivered_weight);
    IF NEW.transaction_type = 'purchase' THEN
        UPDATE products
        SET stock = stock + weight_difference
        WHERE id = NEW.product_id;
    ELSEIF NEW.transaction_type = 'sale' THEN
        UPDATE products
        SET stock = stock - weight_difference
        WHERE id = NEW.product_id;
    END IF;
END;//

DELIMITER ;