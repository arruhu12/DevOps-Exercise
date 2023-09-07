/**
 * Update Purcahse Transaction Schema
 */

const PAYMENT_METHOD = ['cash', 'transfer'];
const PAYMENT_STATUS = ['paid', 'unpaid'];
const DELIVERY_STATUS = ['fully delivered', 'partially delivered', 'undelivered'];
const IMAGE_MIME_TYPES = [
    'image/jpeg',
    'image/png',
    'image/gif',
    'image/bmp',
    'image/webp',
    'image/svg+xml'
];

const isBase64 = (text: string): boolean => {
    try {
        return Buffer.from(text, 'base64').toString('base64') === text;
    } catch (err) {
        return false;
    }
}

const getMimeTypeFromBase64 = (text: string): string => {
    try {
        return text.split(';base64')[0].replace('data:', '');
    } catch (err) {
        return '';
    }
}

const isBase64Image = (dataURI: string): boolean => {
    if (dataURI.startsWith("data:image/")) {
        const parts = dataURI.split(',');
        if (parts.length === 2 && isBase64(parts[1])) {
            const mimeType = getMimeTypeFromBase64(parts[0]);
            return IMAGE_MIME_TYPES.includes(mimeType);
        }
    }
    throw new Error("Proof Images must be base64 encoded");
}

export default {
    id: {
        exists: { errorMessage: "Id is required" },
        isString: { errorMessage: "Id must be a string" },
        isUUID: { version: 4, errorMessage: "Id must be a valid UUID" },
    },
    grossWeight: {
        exists: { errorMessage: "Gross Weight is required" },
        isNumeric: { errorMessage: "Gross Weight must be a number" },
        isInt: {options: {gt: 0}, errorMessage: "Gross Weight must be greater than 0"},
    },
    tareWeight: {
        exists: { errorMessage: "Tare Weight is required" },
        isNumeric: { errorMessage: "Tare Weight must be a number" },
        isInt: {options: {gt: 0}, errorMessage: "Tare Weight must be greater than 0"},
    },
    deductionPercentage: {
        exists: { errorMessage: "Deduction Percentage is required" },
        isNumeric: { errorMessage: "Deduction Percentage must be a number" },
        isInt: {options: {min: 0, max: 100}, errorMessage: "Deduction Percentage must be greater than 0"},
    },
    deliveredWeight: {
        exists: { errorMessage: "Delivered Weight is required" },
        isNumeric: { errorMessage: "Delivered Weight must be a number" },
        isInt: {options: {gt: 2}, errorMessage: "Delivered Weight must be greater than 2"},
    },
    paymentMethod: {
        exists: { errorMessage: "Payment Method is required" },
        isString: { errorMessage: "Payment Method must be a string" },
        custom: {
            options: (value: string) => {
                return PAYMENT_METHOD.includes(value.toLowerCase());
            },
            errorMessage: "Payment Method must be either 'cash' or 'transfer'"
        }
    },
    paymentStatus: {
        exists: { errorMessage: "Payment Status is required" },
        isString: { errorMessage: "Payment Status must be a string" },
        custom: {
            options: (value: string) => {
                return PAYMENT_STATUS.includes(value.toLowerCase());
            },
            errorMessage: "Payment Status must be either 'paid' or 'unpaid'"
        }
    },
    deliveryStatus: {
        exists: { errorMessage: "Delivery Status is required" },
        isString: { errorMessage: "Delivery Status must be a string" },
        custom: {
            options: (value: string) => {
                return DELIVERY_STATUS.includes(value.toLowerCase());
            },
            errorMessage: "Delivery Status must be either 'fully delivered', 'partially delivered', or 'not delivered'"
        }
    },
    proofImages: {
        optional: true,
        exists: { errorMessage: "Proof Images is required" },
        isArray: { errorMessage: "Proof Images must be an array" },
        custom: {
            options: (value: string[]) => {
                return value.every((data) => isBase64Image(data));
            }
        }
    }
}