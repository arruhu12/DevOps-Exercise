/**
 * Product Store Request Schema
 */

export default {
    name: {
        exists: { errorMessage: "Name is required" },
        isString: { errorMessage: "Name must be a string" },
    },
    price: {
        exists: { errorMessage: "Price is required" },
        isNumeric: { errorMessage: "Price must be a number" },
    },
    quantity: {
        optional: true,
        isNumeric: { errorMessage: "Quantity must be a number" },
        isInt: { errorMessage: "Quantity must be an integer" },
    }
};