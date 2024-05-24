import { Router } from "express"
import Player from "../models/Player"
import { Op } from "sequelize"
import sequelize from "../helpers/db"
import Game from "../models/Game"
import { calculateScores } from "../helpers/getScores"
import Score from "../types/Score"
import PlayerData from "../types/PlayerData"
import PlayerStats from "../types/PlayerStats"
import match from "../helpers/schedule/match"

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
            ],
            status: 3
        }
        // add sorting by game id
    })

    let playerStats = new Map<number, Map<number,PlayerStats>>()
    let lastColor = new Map<number, 0|1|2>()

    pids.map(pid => {
        lastColor.set(pid, 0)
        let playerMap = new Map<number,PlayerStats>()

        for (let i of pids)
            if (i!=pid) playerMap.set(i, { played: 0, lastPlayed: 0, lastColor: 0 })
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
        whiteStats.get(g.blackPid)!.lastColor = 1

        blackstats.get(g.whitePid)!.played++
        blackstats.get(g.whitePid)!.lastPlayed = 0
        blackstats.get(g.whitePid)!.lastColor = 2

        lastColor.set(g.whitePid, 1)
        lastColor.set(g.blackPid, 2)
        return
    })

    for (let [i, stats] of playerStats)
        for (let [j, stat] of stats)
            if (stat.played == 0) stat.lastPlayed = Infinity

    let scores = await calculateScores(games)
    let playerData: PlayerData[] = []

    pids.map(pid => {
        let stats = playerStats.get(pid)
        if (!stats) return

        playerData.push({
            pid,
            pair: 0,
            color: 0,
            score: scores.get(pid) || new Score(),
            lastColor: lastColor.get(pid) || 0,
            stats
        })
    })

    playerData.sort((a,b) => b.score.points - a.score.points || a.pid - b.pid)
    
    let result = match(playerData, 1)

    if (result) {
        for (let i of playerData) {
            console.log(`${i.pid}:${players.find(p => p.pid == i.pid)?.name}\t${i.score.points}\t${i.pair}\t${i.color == 1 ? "white" : "black"}`)
        }
    }
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