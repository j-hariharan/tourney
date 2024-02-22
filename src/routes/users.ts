import { Response, Router } from "express"
import User from "../models/User"

let router = Router()


router.use("/users", (req, res, next) => {
    if (!req.user?.isAdmin) {
        res.redirect("/")
    } 
    else {
        next()
    }
})


router.get("/users", async (req, res) => {
    await renderUsers(res, req.user)
})


router.post("/users", async (req, res) => {
    let body = req.body
    let uid = body.uid

    if (body.action == "update") {
        let role = parseInt(body.role)
        await User.update({ role }, { where: { uid } })
    }
    else if (body.action == "delete") {
        await User.destroy({ where: { uid }})
    }

    renderUsers(res, req.user, { message: "Updated successfully!" })
})



async function renderUsers (res: Response,  currentUser?: User, options: Record<string, string> = {}) {
    let users = await User.findAll()
    let userData = users.map(u => {
        return {
            uid: u.uid,
            name: u.name,
            email: u.email,
            role: u.role,
            isCurrentUser: u.uid == currentUser?.uid,
            roleText: u.roleText
        }
    })

    userData.sort((a, b) => {
        if (a.isCurrentUser == true) return -1
        else if (b.isCurrentUser == true) return 1
        else return a.name < b.name ? -1 : 1 
    })

    res.render("users", { users: userData, ...options })
}


export default router