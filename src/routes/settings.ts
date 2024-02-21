import { Router } from "express"
import getConfig from "../helpers/config"
import Config from "../models/Config"

const router = Router()

router.use("/settings", (req, res, next) => {
    if (!req.user?.isAdmin) {
        res.redirect("/")
    } 
    else {
        next()
    }
})

router.get("/settings", async (req, res) => {
    res.render("settings", await getConfig())
})

router.post("/settings", async (req, res) => {
    let { max_games, wait, win, loss, draw } = req.body

    if (isNaN(max_games) || isNaN(wait) || isNaN(win) || isNaN(loss) || isNaN(draw)) {
        res.render("settings", { error: "Invalid values provided", ...(await getConfig()) })
        return
    }

    let max_games_per_pair = parseInt(max_games)
    let wait_before_matching = parseFloat(wait)
    win = parseFloat(win)
    loss = parseFloat(loss)
    draw = parseFloat(draw)

    await Config.update(
        { 
            max_games_per_pair, wait_before_matching, win, loss, draw 
        }, 
        { where: {} }
    )

    res.render("settings", { success: "Details updated successfully", ...(await getConfig()) })
})

export default router