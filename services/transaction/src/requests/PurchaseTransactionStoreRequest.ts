/**
 * Store Purcahse Transaction Schema
 */

import { config } from "dotenv";

config();

const IMAGE_MIME_TYPES = [
    'image/jpeg',
    'image/png',
    'image/gif',
    'image/bmp',
    'image/webp',
    'image/svg+xml'
];
const VEHICLE_LICENSE_REGEX = /^([A-Z]{1,3})(\s|-)*([1-9][0-9]{0,3})(\s|-)*([A-Z]{0,3}|[1-9][0-9]{1,2})$/i;


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
    supplierId: {
        exists: { errorMessage: "Supplier ID is required" },
        isString: { errorMessage: "Supplier ID must be a string" },
        isUUID: {version: '4', errorMessage: "Supplier ID must be a valid UUIDv4"},
        custom: {
            options: async (value: string, { req }: {req: any}) => {
                const response = await fetch(`${process.env.DATA_MANAGEMENT_SERVICE}/api/v1/supplier/${value}`, {
                    headers: {
                        'Authorization': req.headers.authorization
                    }
                });
                if (response.status === 200) {
                    return Promise.resolve();
                }
                return await Promise.reject();
            }, errorMessage: "Supplier ID does not exist"
        }
    },
    productId: {
        exists: { errorMessage: "Product ID is required" },
        isString: { errorMessage: "Product ID must be a string" },
        isUUID: {version: '4', errorMessage: "Product ID must be a valid UUIDv4"},
        custom: {
            options: async (value: string, { req }: {req: any}) => {
                const response = await fetch(`${process.env.DATA_MANAGEMENT_SERVICE}/api/v1/product/${value}`, {
                    headers: {
                        'Authorization': req.headers.authorization
                    }
                });
                if (response.status === 200) {
                    return Promise.resolve();
                }
                return await Promise.reject();
            }, errorMessage: "Product ID does not exist"
        }
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
    coordinate: {
        exists: { errorMessage: "Coordinate is required" },
        isLatLong: { errorMessage: "Coordinate must be a valid Latitude and Longitude" },
    },
    sourceOfPurchase: {
        optional: true,
        isString: { errorMessage: "Source of Purchase must be a string" }
    },
    additionalNotes: {
        optional: true, 
        isString: { errorMessage: "Additional Notes must be a string" }
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
