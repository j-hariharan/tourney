import { Router } from "express"

const router = Router()

router.get("/", (req, res) => {
    if (!req.user) return

    res.render("home", {
        name: req.user.name,
        email: req.user.email,
        isAdmin: req.user.isAdmin,
        isOrganizer: req.user.isOrganizer,
        isArbiter: req.user.isArbiter
    })
})

export default router