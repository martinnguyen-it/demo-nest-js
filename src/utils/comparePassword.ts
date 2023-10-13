import { compare } from 'bcrypt'

export const comparePassword = async (
    candicatePassword: string,
    userPassword: string
) => {
    return await compare(candicatePassword, userPassword)
}
