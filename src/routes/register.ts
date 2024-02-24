import { Response, Router } from "express"
import User from "../models/User"
import { handleLogin } from "./login"

const router = Router()

router.get("/register", (req, res) => {
    res.render("register")
})


router.post("/register", async (req, res) => {
    let email = req.body.email
    let password = req.body.password
    let name = req.body.name

    if (!email || !password || !name) {
        res.render("register", { message: "All fields are compulsory" })
        return
    }

    let usersFound = await User.count({
        where: { email }
    })
    
    if (usersFound > 0) {
        res.render("register", { message: "Email already exists, consider logging in."})
        return
    }

    let user = await User.create({ email, name, password })

    handleLogin(res, user.uid)
    res.redirect("/")
})

export default router