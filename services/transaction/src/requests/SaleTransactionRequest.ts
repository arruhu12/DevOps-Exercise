/**
 * Store Sale Transaction Schema
 */

const IMAGE_MIME_TYPES = [
    'image/jpeg',
    'image/png',
    'image/gif',
    'image/bmp',
    'image/webp',
    'image/svg+xml'
];
const VEHICLE_LICENSE_REGEX = /^([A-Z]{1,3})(\s|-)*([1-9][0-9]{0,3})(\s|-)*([A-Z]{0,3}|[1-9][0-9]{1,2})$/i;
const PAYMENT_METHOD = ['cash', 'transfer'];
const PAYMENT_STATUS = ['paid', 'unpaid'];
const DELIVERY_STATUS = ['fully delivered', 'partially delivered', 'not delivered'];


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
    productId: {
        exists: { errorMessage: "Product ID is required" },
        isString: { errorMessage: "Product ID must be a string" },
        isUUID: {version: '4', errorMessage: "Product ID must be a valid UUIDv4"},
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
        isInt: {options: {min: 0, max: 100}, errorMessage: "Deduction Percentage must be between 0 and 100"},
    },
    receivedWeight: {
        exists: { errorMessage: "Received Weight is required" },
        isNumeric: { errorMessage: "Received Weight must be a number" },
        isInt: {options: {gt: 0}, errorMessage: "Received Weight must be greater than 0"},
    },
    vehicleRegistrationNumber: {
        exists: { errorMessage: "Vehicle Registration Number is required" },
        isString: { errorMessage: "Vehicle Registration Number must be a string" },
        custom: {
            options: (value: string) => {
                return VEHICLE_LICENSE_REGEX.test(value);
            }, errorMessage: "Vehicle Registration Number must be valid"
        }
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
        exists: { errorMessage: "Proof Images is required" },
        isArray: { errorMessage: "Proof Images must be an array" },
        custom: {
            options: (value: string[]) => {
                return value.every((data) => isBase64Image(data));
            }
        }
    }
}
