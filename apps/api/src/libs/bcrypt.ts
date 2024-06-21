import * as bcrypt from "bcrypt"

export const comparePassword = async (candidatePassword:string,hashedPassword:string)=>{
    return await bcrypt.compare(candidatePassword,hashedPassword)
}

export const hashPassword = async (password:string)=>{
    const saltRounds = 10
    return await bcrypt.hash(password,saltRounds)
}