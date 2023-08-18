/**
 * Employee Update Request Schema
 */

export default {
    id: {
        exists: { errorMessage: "Id is required" },
        isString: { errorMessage: "Id must be a string" },
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
        isString: { errorMessage: "Username must be a string" },
    },
    password: {
        optional: true,
        exists: { errorMessage: "Password is required" },
        isString: { errorMessage: "Password must be a string" },
    },
    role: {
        exists: { errorMessage: "Role is required" },
        isString: { errorMessage: "Role must be a string" },
    }
};