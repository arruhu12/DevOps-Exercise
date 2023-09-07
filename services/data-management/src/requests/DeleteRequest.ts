/**
 * Delete operation schema
 */

export default {
    id: {
        exists: { errorMessage: "ID is required" },
        isString: { errorMessage: "ID must be a string" },
        isUUID: { version: 4, errorMessage: "Id must be a valid UUID" },
    }
}