import dotenv from "dotenv"

dotenv.config()

export const appConfig = {
    jwtSecretKey : process.env.JWT_SECRET!
}