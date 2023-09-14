export const GET_IMAGE_QUERY = `
    SELECT id, image_type, image_path
    FROM transaction_images
    WHERE transaction_id = ?
`;
export const ALL_TRANSACTiON_QUERY = `
    SELECT 
        t.id, 
        p.name as product_name,
        purchase_detail.supplier_name,
        t.created_at as transaction_date,
        IFNULL(t.delivered_weight, 0) AS delivered_weight,
        IFNULL((t.gross_weight - t.tare_weight) - ((t.gross_weight - t.tare_weight) * t.deduction_percentage DIV 100), 0) AS total_weight,
        IFNULL(((t.gross_weight - t.tare_weight) - ((t.gross_weight - t.tare_weight) * t.deduction_percentage DIV 100)) * price, 0) AS total,
        t.payment_status,
        t.delivery_status,
        t.payment_method,
        (t.payment_status = 'paid') AS is_paid,
        (t.delivery_status = 'fully delivered') AS is_delivered
    FROM 
        transactions t
        JOIN products p ON t.product_id = p.id
        LEFT JOIN (
            SELECT transaction_id, s.name AS supplier_name
            FROM transaction_purchase_details
            JOIN suppliers s ON s.id = supplier_id
        ) purchase_detail ON t.id = purchase_detail.transaction_id AND t.transaction_type = 'purchase'
    WHERE 
        t.transaction_type = ?
        AND t.created_by = ?
    `;
export const TRANSACTION_DETAIL_FOR_VALIDATION_QUERY = `
    SELECT COUNT(*) AS is_exists
    FROM 
        transactions t
        JOIN (
            SELECT 
                id AS customer_id, user_id, CONCAT(first_name, ' ',last_name) as name 
            FROM customers c
            UNION
            SELECT 
                customer_id, user_id, name 
            FROM employees e
        ) AS details ON details.user_id = t.created_by
    WHERE
        t.id = ?
        AND details.customer_id = ?
`;
export const TRANSACTION_DETAIL_FOR_UPDATE_QUERY = `
    SELECT * 
    FROM
        transactions t
        LEFT JOIN (
            SELECT 
                transaction_id, 
                s.name AS supplier_name, 
                longitude, 
                latitude
            FROM transaction_purchase_details
            JOIN suppliers s ON s.id = supplier_id
        ) purchase_detail ON t.id = purchase_detail.transaction_id AND t.transaction_type = 'purchase'
    WHERE 
        t.transaction_type = ?
        AND t.id = ?
`;
export const TRANSACTION_DETAIL_QUERY = `
    SELECT 
        t.id,
        p.name as product_name,
        purchase_detail.supplier_name,
        t.created_at as transaction_date,
        t.transaction_type,
        IFNULL(t.gross_weight, 0) AS gross_weight,
        IFNULL(t.tare_weight, 0) AS tare_weight,
        IFNULL((t.gross_weight - t.tare_weight), 0) AS netto_weight,
        IFNULL(t.delivered_weight, 0) AS delivered_weight,
        IFNULL(t.deduction_percentage, 0) AS deduction_percentage,
        IFNULL((t.gross_weight - t.tare_weight) - ((t.gross_weight - t.tare_weight) * t.deduction_percentage DIV 100), 0) AS total_weight,
        t.price,
        IFNULL(((t.gross_weight - t.tare_weight) - ((t.gross_weight - t.tare_weight) * t.deduction_percentage DIV 100)) * price, 0) AS total,
        t.vehicle_registration_number, 
        t.payment_status,
        t.delivery_status,
        t.payment_method,
        purchase_detail.longitude,
        purchase_detail.latitude,
        t.source_of_purchase,
        t.additional_notes,
        t.created_by
    FROM 
        transactions t
        JOIN products p ON t.product_id = p.id
        LEFT JOIN (
            SELECT 
                transaction_id, 
                s.name AS supplier_name, 
                longitude, 
                latitude
            FROM transaction_purchase_details
            JOIN suppliers s ON s.id = supplier_id
        ) purchase_detail ON t.id = purchase_detail.transaction_id AND t.transaction_type = 'purchase'
    WHERE 
        t.transaction_type = ?
        AND t.id = ?
    `;
export const REPORT_QUERY = `
    SELECT 
        t.id, t.created_at AS transaction_date,
        t.transaction_type,
        IF(purchase_detail.supplier_name IS NULL, '-', purchase_detail.supplier_name) AS supplier_name, 
        p.name AS product_name,
        (t.gross_weight - t.tare_weight) - ((t.gross_weight - t.tare_weight) * t.deduction_percentage DIV 100) AS total_weight,
        t.delivered_weight,
        ((t.gross_weight - t.tare_weight) - ((t.gross_weight - t.tare_weight) * t.deduction_percentage DIV 100)) * t.price AS total,
        t.payment_method,
        t.payment_status,
        t.delivery_status,
        details.name AS created_by
    FROM 
        transactions t
        JOIN products p ON t.product_id = p.id
        LEFT JOIN (
            SELECT 
                transaction_id, 
                s.name AS supplier_name, 
                longitude, 
                latitude
            FROM transaction_purchase_details
            JOIN suppliers s ON s.id = supplier_id
        ) purchase_detail ON t.id = purchase_detail.transaction_id
        JOIN (
            SELECT 
                id AS customer_id, user_id, CONCAT(first_name, ' ',last_name) as name 
            FROM customers c
            UNION
            SELECT 
                customer_id, user_id, name 
            FROM employees e
        ) AS details ON details.user_id = t.created_by
    WHERE
        details.customer_id = ?`;

export const DAILY_WEIGHT_TOTAL = `
    SELECT category.name, IFNULL(SUM(delivered_weight), 0) AS total
    FROM (
        SELECT 'purchase' AS name
        UNION
        SELECT 'sale' AS name
    ) AS category
    LEFT JOIN (
        SELECT transaction_type, delivered_weight
        FROM transactions t
        JOIN (
            SELECT 
                id AS customer_id, user_id
            FROM customers c 
            UNION
            SELECT 
                customer_id, user_id
            FROM employees e 
        ) AS user ON user.user_id = t.created_by
        WHERE 
            DATE(t.created_at) = CURDATE()
            AND user.customer_id = ?
    ) as t ON category.name = t.transaction_type
    GROUP BY category.name`;

export const DAILY_WEIGHT_TOTAL_BY_PRODUCT_QUERY = `
    SELECT type.name AS transaction_type, p.name, IFNULL(SUM(t.delivered_weight), 0) AS total
    FROM (
        SELECT 'purchase' AS name
        UNION
        SELECT 'sale' AS name
    ) AS type
    CROSS JOIN products p 
    LEFT JOIN (
        SELECT product_id, delivered_weight, created_by, transaction_type
        FROM transactions t
        JOIN (
            SELECT 
                id AS customer_id, user_id
            FROM customers c 
            UNION
            SELECT 
                customer_id, user_id
            FROM employees e 
        ) AS user ON user.user_id = t.created_by
        WHERE 
            DATE(t.created_at) = CURDATE()
            AND user.customer_id = '1'
    ) AS t
    ON type.name = t.transaction_type AND p.name = (
        SELECT name FROM products WHERE id = t.product_id
    )
    GROUP BY type.name, p.name`;

export const DAILY_WEIGHT_TOTAL_BY_PAYMENT_METHOD_QUERY = `
    SELECT 
        type.name AS transaction_type, 
        pm.name, 
        IFNULL(SUM(t.delivered_weight), 0) AS total
    FROM (
        SELECT 'purchase' AS name
        UNION
        SELECT 'sale' AS name
    ) AS type
    CROSS JOIN (
        SELECT 'cash' AS name
        UNION
        SELECT 'transfer' AS name
    ) AS pm 
    LEFT JOIN (
        SELECT payment_method, delivered_weight, created_by, transaction_type
        FROM transactions t 
        JOIN (
            SELECT 
                id AS customer_id, user_id
            FROM customers c 
            UNION
            SELECT 
                customer_id, user_id
            FROM employees e 
        ) AS user ON user.user_id = t.created_by
        WHERE 
            DATE(t.created_at) = CURDATE()
            AND user.customer_id = ?
    ) t ON type.name = t.transaction_type AND pm.name = t.payment_method
    GROUP BY type.name, pm.name`;

export const ORDER_BY_DATE_QUERY = `ORDER BY t.created_at DESC`;