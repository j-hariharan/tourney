import { Router } from "express"

const router = Router()

router.get("/login", (req, res) => {
    res.render("login")
})


router.post("/login", (req, res) => {
    console.log(req.body)
    res.send("done")
})


export default router