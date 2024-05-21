import { Response, Router } from "express"
import Game from "../models/Game"

const router = Router()


router.use("/games", (req, res, next) => {
    next()
})

router.get("/games", async (req, res) => {
    renderGames(res, req.user?.uid)
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


export default router