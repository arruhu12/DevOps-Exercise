/**
 * Supplier Store Request Schema
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
    address: {
        exists: { errorMessage: "Address is required" },
        isString: { errorMessage: "Address must be a string" },
    },
    phoneNumber: {
        exists: { errorMessage: "Phone Number is required" },
        isMobilePhone: { locale: ['id-ID'] , errorMessage: "Phone number must be a valid Indonesian phone number" }
    }    
};