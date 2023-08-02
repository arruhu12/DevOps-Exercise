import { checkEmail } from "../service/CustomerRegistrationService";

export default {
    firstName: {
        exists: { errorMessage: "First name is required" },
        isString: { errorMessage: "First name must be a string" },
    },
    lastName: {
        optional: true,
        isString: { errorMessage: "Last name must be a string" },
    },
    companyName: {
        exists: { errorMessage: "Company name is required" },
        isString: { errorMessage: "Company name must be a string" },
    },
    companyAddress: {
        exists: { errorMessage: "Company address is required" },
        isString: { errorMessage: "Company address must be a string" },
    },
    email: {
        exists: { errorMessage: "Email is required" },
        isEmail: { errorMessage: "Email must be a valid email" },
    },
    password: {
        exists: { errorMessage: "Password is required" },
        isString: { errorMessage: "Password must be a string" },
        isLength: { options: { min: 8 } , errorMessage: "Password must be at least 8 characters long" }
    },
    phoneNumber: {
        exists: { errorMessage: "Phone number is required" },
        isMobilePhone: { locale: ['id-ID'] , errorMessage: "Phone number must be a valid Indonesian phone number" }
    },
};