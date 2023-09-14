export const PRODUCT_BUY_PRICE_QUERY = `
    SELECT buy_price AS price FROM products WHERE id = ?
`;
export const PRODUCT_SELL_PRICE_QUERY = `
    SELECT sell_price AS price FROM products WHERE id = ?
`;
export const PRODUCT_STOCK_QUERY = `
    SELECT stock FROM products WHERE id = ?
`;
export const STORE_TRANSACTION_QUERY = `
    INSERT INTO transactions SET ?
`;
export const UPDATE_TRANSACTION_QUERY = `
    UPDATE transactions SET ? WHERE id = ?
`;
export const STORE_TRANSACTION_IMAGE_QUERY = `
    INSERT INTO transaction_images SET ?
`;
export const STORE_TRANSACTION_PURCHASE_DETAIL_QUERY = `
    INSERT INTO transaction_purchase_details SET ?
`;
export const GET_TRANSACTION_IMAGE_QUERY = `
    SELECT id, image_type, image_path
    FROM transaction_images
    WHERE transaction_id = ? AND customer_id = ?
`;