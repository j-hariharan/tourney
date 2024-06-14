import { Response, Router } from "express"
import Player from "../models/Player"
import { getScores } from "../helpers/getScores"
import { Op } from "sequelize"
import { ScoreType } from "../types/Score"
import assert from "assert"

const router = Router()



router.get("/scoreboard", async (req, res) => {
    let scores = await getScores()

    let pids = Array.from(scores.keys())
    let players = await Player.findAll({
        where: {
            pid: {
                [Op.in]: pids
            }
        }
    })

    let data: { pid: number, name: string, disabled: boolean, score: ScoreType }[] =
    players.map(p => {
        let s = scores.get(p.pid)
        assert(s)

        return {
            pid: p.pid,
            name: p.name,
            disabled: p.disabled,
            score: s
        }
    })

    data.sort((a, b) => b.score.points - a.score.points)

    res.render("scoreboard", { players: data })
})



export default router