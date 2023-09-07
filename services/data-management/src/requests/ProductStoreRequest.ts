/**
 * Product Store Request Schema
 */

export default {
    id: {
        optional: true,
        exists: { errorMessage: "Id is required" },
        isString: { errorMessage: "Id must be a string" },
        isUUID: { version: 4, errorMessage: "Id must be a valid UUID"}
    },
    name: {
        exists: { errorMessage: "Name is required" },
        isString: { errorMessage: "Name must be a string" },
    },
    buyPrice: {
        exists: { errorMessage: "Buy Price is required" },
        isNumeric: { errorMessage: "Buy Price must be a number" },
        isInt: {
            options: { gt: 0 },
            errorMessage: "Buy Price must be greater than 0",
        },
    },
    sellPrice: {
        exists: { errorMessage: "Sale Price is required" },
        isNumeric: { errorMessage: "Sale Price must be a number" },
        isInt: {
            options: { gt: 0 },
            errorMessage: "Sale Price must be greater than 0",
        },
    },
    quantity: {
        optional: true,
        isNumeric: { errorMessage: "Quantity must be a number" },
        isInt: { 
            options: { gt: 0 }, 
            errorMessage: "Quantity must be greater than 0" 
        },
    }
};