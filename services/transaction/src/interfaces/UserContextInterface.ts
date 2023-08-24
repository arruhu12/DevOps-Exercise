export default interface UserContextInterface {
    iss: string,
    sub: string,
    iat: number,
    exp: number,
    aud: string,
    context: {
        user: {
            userId: string,
            customerId: string,
            displayName: string,
            companyName: string,
        },
        roles: string[],
        isNewAccount: boolean,
        isSubscriptionActive: boolean,
    }
}