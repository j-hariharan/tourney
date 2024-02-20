import { Router } from "express"
import User from "../models/User"
import jwt from 'jsonwebtoken'

const router = Router()

router.get("/login", (req, res) => {
    res.render("login")
})


router.post("/login", async (req, res) => {
    let email = req.body.email
    let password = req.body.password

    if (!email || !password) {
        res.render("login", { message: "An error occured :(" })
        return
    }

    let user = await User.findOne({
        where: { email }
    })
    
    if (user == null) {
        res.render("login", { message: "User not found :("})
        return
    }

    if (user.password != password) {
        res.render("login", { message: "Wrong password :(" })
        return;
    }

    let privatekey = process.env.JWT_PRIVATE_KEY
    if (!privatekey) return

    let token = jwt.sign({ jwt: user.uid.toString() },privatekey, {
        expiresIn: "1d"
    })

    res.cookie("token", token, { maxAge: 24 * 60 * 60 * 1000 })
    res.render("home")

})


export default router