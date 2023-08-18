/**
 * Employee Store Request Schema
 */

export default {
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
        isString: { errorMessage: "Username must be a string" },
    },
    password: {
        exists: { errorMessage: "Password is required" },
        isString: { errorMessage: "Password must be a string" },
    },
    role: {
        exists: { errorMessage: "Role is required" },
        isString: { errorMessage: "Role must be a string" },
    }
};