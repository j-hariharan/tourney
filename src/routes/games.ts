import { Response, Router } from "express"
import Game from "../models/Game"

const router = Router()


router.use("/games", (req, res, next) => {
    if (!req.user?.isArbiter && !req.user?.isOrganizer) {
        res.redirect("/")
    } else {
        next()
    }
})

router.get("/games", async (req, res) => {
    renderGames(res, req.user?.uid)
})

router.get("/games/:id", async (req, res) => {
    renderGame(res, req.params.id)
})

router.post("/games/:id", async (req, res) => {
    let { action, winner, outcome } = req.body
    winner = parseInt(winner)
    
    let gid = req.params.id

    let game = await Game.findByPk(gid)
    if (game == null) {
        res.redirect("/games")
        return
    }

    if (action == "start" || action == "cancel") {
        if (game.status == 0) {
            await game.update({ status: action == "start" ? 1 : 2 })
            return renderGame(res, gid)
        } else {
            res.status(403).send("Cannot perform action")
            return
        }
    }

    else if (action == "result") {
        if (game.status == 1 && [0,1,2].includes(winner)) {
            await game.update({ status: 3, winner, resultDeclaredByUid: req.user?.uid, outcome })
            return renderGame(res, gid)
        } else {
            res.status(403).send("Cannot perform action")
        }
    }
})



async function renderGames (res: Response, currentUid: number = -1, options: Record<string, string> = {}) {
    let games = await Game.findAll({ include: ['white', 'black', "startedBy", "resultDeclaredBy", "prevArbiterWhite", "prevArbiterBlack"] })
    let gameData = games.map(g => {
        let associated = []
        if (g.prevArbiterWhite)
            associated.push({ uid: g.prevArbiterWhite.uid, name: g.prevArbiterWhite.name })
        if (g.prevArbiterBlack) 
            associated.push({ uid: g.prevArbiterBlack.uid, name: g.prevArbiterBlack.name })

        let color = ""
        if (g.isCancelled) color = "red"
        else if (g.isScheduled) color = "orange"
        else color = "green"

        let priority: number
        if (g.isScheduled) {
            if (g.prevArbiterWhite?.uid == currentUid || g.prevArbiterBlack?.uid == currentUid) priority = 0
            else priority = 3
        }
        else if (g.isStarted) {
            if (g.startedBy?.uid == currentUid) priority = 1
            else if (g.prevArbiterWhite?.uid == currentUid || g.prevArbiterBlack?.uid == currentUid) priority = 2
            else priority = 4
        }
        else if (g.isCompleted) {
            if (g.resultDeclaredBy?.uid == currentUid) priority = 5
            else priority = 6
        }
        else {
            priority = 7
        }


        return {
            gid: g.gid,
            startTime: g.startTime,
            endTime: g.endTime,
            result: g.resultString,
            color,
            priority,

            white: {
                pid: g.white.pid,
                name: g.white.name
            },
            black: {
                pid: g.black.pid,
                name: g.black.name
            },

            associated,

            startedBy: g.startedBy ? {
                uid: g.startedBy.uid,
                name: g.startedBy.name
            } : null,

            resultDeclaredBy: g.resultDeclaredBy ? {
                uid: g.resultDeclaredBy.uid,
                name: g.resultDeclaredBy.name
            } : null
        }
    })

    gameData.sort((a, b) => {
        if (a.priority == b.priority) {
            if (a.endTime && b.endTime) {
                return b.endTime.getTime() - a.endTime.getTime()
            } else if (a.startTime && b.startTime) {
                return b.startTime.getTime() - a.startTime.getTime()
            } else {
                return a.gid - b.gid
            }
        }

        return a.priority - b.priority
    })

    res.render("games", { games: gameData, ...options })
}

 async function renderGame (res: Response, id: string, options: Record<string, string> = {}) {
    let game = await Game.findByPk(id, { include: ['white', 'black', "startedBy", "resultDeclaredBy", "prevArbiterWhite", "prevArbiterBlack"]})

    if (game == null) {
        res.redirect("/games")
        return
    }

    let color = ""
    if (game.isCancelled) color = "red"
    else if (game.isScheduled) color = "orange"
    else color = "green"

    let data = {
        gid: game.gid,
        white: {
            pid: game.whitePid,
            name: game.white.name
        },
        black: {
            pid: game.blackPid,
            name: game.black.name
        },
        result: game.resultString,
        color,
        isScheduled: game.isScheduled,
        isStarted: game.isStarted

    }

    res.render("game", { ...data, ...options });
 }


export default router