/**
 * Store Sale Transaction Schema
 */

export default {
    productId: {
        exists: { errorMessage: "Product ID is required" },
        isString: { errorMessage: "Product ID must be a string" }
    },
    grossWeight: {
        exists: { errorMessage: "Gross Weight is required" },
        isNumeric: { errorMessage: "Gross Weight must be a number" }
    },
    tareWeight: {
        exists: { errorMessage: "Tare Weight is required" },
        isNumeric: { errorMessage: "Tare Weight must be a number" }
    },
    deductionPercentage: {
        exists: { errorMessage: "Deduction Percentage is required" },
        isNumeric: { errorMessage: "Deduction Percentage must be a number" }
    },
    receivedWeight: {
        exists: { errorMessage: "Received Weight is required" },
        isNumeric: { errorMessage: "Received Weight must be a number" }
    },
    vehicleRegistrationNumber: {
        exists: { errorMessage: "Vehicle Registration Number is required" },
        isString: { errorMessage: "Vehicle Registration Number must be a string" }
    },
    paymentMethod: {
        exists: { errorMessage: "Payment Method is required" },
        isString: { errorMessage: "Payment Method must be a string" }
    },
    paymentStatus: {
        exists: { errorMessage: "Payment Status is required" },
        isString: { errorMessage: "Payment Status must be a string" }
    },
    deliveryStatus: {
        exists: { errorMessage: "Delivery Status is required" },
        isString: { errorMessage: "Delivery Status must be a string" }
    },
    sourceOfPurchase: {
        optional: true,
        isString: { errorMessage: "Source of Purchase must be a string" }
    },
    additionalNotes: {
        optional: true, 
        isString: { errorMessage: "Additional Notes must be a string" }
    }
}
