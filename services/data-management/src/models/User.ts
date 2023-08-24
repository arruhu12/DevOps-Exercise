export type User = {
    id: string,
    username: string|Promise<string>,
    email?: string,
    password: string,
    phone_number?: string,
    is_active?: boolean,
    roles: string
}