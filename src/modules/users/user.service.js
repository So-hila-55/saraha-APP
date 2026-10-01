

import { OAuth2Client } from "google-auth-library"
import { Encrypt, Decrypt } from "../../common/security/encrypt.js"
import { Hash, Compare } from "../../common/security/hash.js"
import * as dbService from "../../DB/db.service.js"
import userModel from "../../DB/models/user.model.js"

const client = new OAuth2Client()


export const signUp = async (req, res, next) => {
    try {
        const { fName, lName, email, password, age, gender, phone } = req.body

        if (await userModel.findOne({ email: email.toLowerCase() })) {
            throw new Error("email already exist", { cause: 409 })
        }

        const [user] = await dbService.create({
            model: userModel,
            data: {
                fName, lName, email, age, gender,
                password: Hash({ plainText: password }),
                phone: Encrypt(phone)
            }
        })

        return res.status(201).json({ message: "Done", user })
    } catch (error) {
        return res.status(error.cause || 500).json({ message: error.message, stack: error.stack })
    }
}


export const signIn = async (req, res, next) => {
    try {
        const { email, password } = req.body

        const user = await dbService.findOne({
            model: userModel,
            filter: { email: email.toLowerCase(), provider: "system" }
        })

        if (!user) {
            throw new Error("email not exist or you can login on your signup", { cause: 400 })
        }

        if (!Compare({ plainText: password, hash: user.password })) {
            throw new Error("inValid password", { cause: 400 })
        }

        return res.status(200).json({
            message: "Done",
            user: { ...user._doc, phone: Decrypt(user.phone) }
        })
    } catch (error) {
        return res.status(error.cause || 500).json({ message: error.message, stack: error.stack })
    }
}


export const signUpWithGmail = async (req, res, next) => {
    try {
        const { idToken } = req.body

        const decoded = await client.verifyIdToken({
            idToken,
            audience: "126040009005-gpk19je1v652s6trd6630crlascqe7nh.apps.googleusercontent.com",
        })
        const { family_name, given_name, picture, email_verified, email } = decoded.getPayload()

        let user = await userModel.findOne({ email: email.toLowerCase() })

        if (!user) {
            user = await userModel.create({
                fName: given_name,
                lName: family_name,
                email,
                profileImage: picture,
                isConfirmed: email_verified,
                provider: "google"
            })
        }

        if (user.provider !== "google") {
            throw new Error("please login with your email and password", { cause: 400 })
        }

        return res.status(200).json({ message: "Done", user })
    } catch (error) {
        return res.status(error.cause || 500).json({ message: error.message, stack: error.stack })
    }
}