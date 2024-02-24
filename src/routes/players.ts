import { Response, Router } from "express"
import Player from "../models/Player"

const router = Router()



router.use("/players", (req, res, next) => {
    if (!req.user?.isOrganizer) {
        res.redirect("/")
    } 
    else {
        next()
    }
})

router.get("/players", async (req, res) => {
    renderPlayers(res)
})

router.post("/players", async (req, res) => {
    let body = req.body
    let pid = body.pid

    if (body.action == "enable") {
        await Player.update({ disabled: false }, { where: { pid } })
        renderPlayers(res, { message: "Enabled successfully!" })
    }
    else if (body.action == "disable") {
        await Player.update({ disabled: true }, { where: { pid } })
        renderPlayers(res, { message: "Disabled successfully!" })
    }

})


router.get("/players/add", (req, res) => {
    res.render("addplayer")
})

router.post("/players/add", async (req, res) => {
    let name = req.body.name

    if (!name) {
        res.render("addplayer", { message: "Please enter a name" })
        return
    }

    let playersFound = await Player.count({
        where: { name }
    })
    
    if (playersFound > 0) {
        res.render("addplayer", { message: "Player with the same name already exists. Please enter a different name."})
        return
    }

    let user = await Player.create({ name })

    res.redirect("/players")
})


async function renderPlayers (res: Response, options: Record<string, string> = {}) {
    let players = await Player.findAll({ 
        order: [
            ["disabled", "ASC"],
            ["createdAt", "DESC"]
        ]
     })
    let playerData = players.map(p => {
        return {
            pid: p.pid,
            name: p.name,
            disabled: p.disabled
        }
    })

    playerData.sort((a, b) => {
        if (a.disabled && !b.disabled) return 1
        if (b.disabled && !a.disabled) return -1
        else return a<b ? -1 : 1
    })

    res.render("players", { players: playerData, ...options })
}



export default router