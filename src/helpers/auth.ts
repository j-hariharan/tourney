import { NextFunction, Request, Response } from "express"
import jwt from "jsonwebtoken"
import User from "../models/User"

interface CookieJwtPayload {
    uid: number
}


export default async function auth_middleware (req: Request, res: Response, next: NextFunction) {
    let token = req.cookies['token']

    if (req.path == "/login") {
        res.clearCookie("token")
        next()
        return
    }

    if (!token) {
        res.redirect("/login")
        return
    }

    try {
        let payload = jwt.verify(token, process.env.JWT_PRIVATE_KEY || "") as CookieJwtPayload
        let uid = payload.uid
        let user = await User.findByPk(uid)

        if (user) req.user = user
        else throw Error()

        next()
    }
    catch (e) {
        res.redirect("/login")
        return
    }
}