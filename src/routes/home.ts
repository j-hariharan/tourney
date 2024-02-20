import { Router } from "express"

const router = Router()

router.get("/", (req, res) => {
    res.render("home", {
        name: req.user?.name
    })
})

export default router