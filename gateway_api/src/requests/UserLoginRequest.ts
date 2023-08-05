/**
 * User Login Validation Schema
 */

export default {
    email: {
        exists: { errorMessage: "Email is required" },
        isEmail: { errorMessage: "Email must be a valid email" },
    },
    password: {
        exists: { errorMessage: "Password is required" },
        isString: { errorMessage: "Password must be a string" },
        isLength: { options: { min: 8 } , errorMessage: "Password must be at least 8 characters long" }
    }
};