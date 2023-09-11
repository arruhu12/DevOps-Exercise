/**
 * Employee Store Request Schema
 */

const USERNAME_REGEX = /u\d-\w+/gm;

export default {
    id: {
        optional: true,
        exists: { errorMessage: "Id is required" },
        isString: { errorMessage: "Id must be a string" },
        isUUID: { version: 4, errorMessage: "Id must be a valid UUID" },
    },
    name: {
        exists: { errorMessage: "Name is required" },
        isString: { errorMessage: "Name must be a string" },
    },
    phoneNumber: {
        exists: { errorMessage: "Phone Number is required" },
        isMobilePhone: { locale: ['id-ID'] , errorMessage: "Phone number must be a valid Indonesian phone number" }
    },
    username: {
        exists: { errorMessage: "Username is required" },
        isString: { errorMessage: "Username must be a string" }
    },
    password: {
        exists: { errorMessage: "Password is required" },
        isString: { errorMessage: "Password must be a string" },
        isLength: { options: { min: 8 }, errorMessage: "Password must be at least 8 characters long" },
    },
    isFarmer: {
        exists: { errorMessage: "Is Farmer is required" },
        isBoolean: { errorMessage: "Is Farmer must be a boolean" },
    },
    role: {
        exists: { errorMessage: "Role is required" },
        isString: { errorMessage: "Role must be a string" },
        isIn: {
            options: [['admin', 'employee']],
            errorMessage: "Role must be admin or employee"
        }
    }
};