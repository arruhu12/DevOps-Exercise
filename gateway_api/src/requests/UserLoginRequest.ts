/**
 * User Login Validation Schema
 */

export default {
    email: {
        optional: true,
        isEmail: { errorMessage: "Email must be a valid email" },
    },
    username: {
        optional: true,
        isString: { errorMessage: "Username must be a string" },
    },
    password: {
        exists: { errorMessage: "Password is required" },
        isString: { errorMessage: "Password must be a string" },
        isLength: { options: { min: 8 } , errorMessage: "Password must be at least 8 characters long" }
    }
};