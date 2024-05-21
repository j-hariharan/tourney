import { Router } from "express"
import Player from "../models/Player"
import { Op } from "sequelize"
import sequelize from "../helpers/db"
import Game from "../models/Game"
import { calculateScores } from "../helpers/getScores"
import Score from "../types/Score"

const router = Router()

router.get("/games/schedule", async (req, res) => {
    let players = await getFreePlayers()

    let playerData = players.map(p => {
        return {
            name: p.name
        }
    })
    res.render("freeplayers", { players: playerData })
})


router.post("/games/schedule", async (req, res) => {
    let players = await getFreePlayers()
    let pids = players.map(p => p.pid)

    let games = await Game.findAll({
        where: {
            [Op.or]: [
                {
                    whitePid: { [Op.in]: pids }
                },
                {
                    blackPid: { [Op.in]: pids }
                }
            ]
        }
    })

    let playerStats = new Map<number, Map<number,{played: number, lastPlayed: number}>>()
    pids.map(pid => {
        let playerMap = new Map()
        for (let i of pids)
            if (i!=pid) playerMap.set(i, { played: 0, lastPlayed: 0 })
        playerStats.set(pid, playerMap)
        return
    })

    games.map(g => {
        let whiteStats = playerStats.get(g.whitePid)
        let blackstats = playerStats.get(g.blackPid)

        if (!whiteStats || !blackstats) return

        for (let [ pid, stats ] of whiteStats)
            if (stats.played != 0)
                stats.lastPlayed++
        
        for (let [ pid, stats ] of blackstats)
            if (stats.played != 0)
                stats.lastPlayed++
        
        whiteStats.get(g.blackPid)!.played++
        whiteStats.get(g.blackPid)!.lastPlayed = 0
        blackstats.get(g.whitePid)!.played++
        blackstats.get(g.whitePid)!.lastPlayed = 0
        return
    })

    for (let [i, stats] of playerStats)
        for (let [j, stat] of stats)
            if (stat.played == 0) stat.lastPlayed = Infinity

    let scores = await calculateScores(games)

    let playerData: { pid: number, score: Score, stats: Map<number,{played: number, lastPlayed: number}>}[] = []
})



async function getFreePlayers () {
    return await Player.findAll({
        where: {
            pid: {
                [Op.notIn]: sequelize.literal(`(
                    (
                        SELECT whitePid from Games where status in (0,1)
                    )
                    UNION
                    (
                        SELECT blackPid from Games where status in (0,1)
                    )
                )`),
            },
            disabled: false
        }
    })
}

export default router