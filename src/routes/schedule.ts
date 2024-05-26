import { Router } from "express"
import { Op } from "sequelize"
import Game from "../models/Game"
import { calculateScores } from "../helpers/getScores"
import Score from "../types/Score"
import PlayerData from "../types/PlayerData"
import PlayerStats from "../types/PlayerStats"
import match from "../helpers/schedule/match"
import getFreePlayers from "../helpers/schedule/getFreePlayers"
import getPairs from "../helpers/schedule/getPairs"

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
    let playersMap = new Map(players.map(p => [p.pid, p]))
    
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
            name: playersMap.get(pid)!.name,
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
        let pairs = getPairs(playerData)
        res.json(pairs)
    } else {
        res.status(201).send("nope")
    }
})


export default router