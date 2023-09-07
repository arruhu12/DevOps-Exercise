export default {
    currentPassword: {
        exists: { errorMessage: "Password is required" },
        isString: { errorMessage: "Password must be a string" },
        isLength: { options: { min: 8 } , errorMessage: "Password must be at least 8 characters long" }
    },
    newPassword: {
        exists: { errorMessage: "Password is required" },
        isString: { errorMessage: "Password must be a string" },
        isLength: { options: { min: 8 } , errorMessage: "Password must be at least 8 characters long" }
    },
    confirmPassword: {
        exists: { errorMessage: "Password is required" },
        isString: { errorMessage: "Password must be a string" },
        isLength: { options: { min: 8 } , errorMessage: "Password must be at least 8 characters long" },
        custom: {
            options: (value: string, { req }: {req: any}) => value === req.body.newPassword,
            errorMessage: "Passwords do not match"
        }
    },
};