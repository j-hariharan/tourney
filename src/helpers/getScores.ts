import Game from "../models/Game"
import Score from "../types/Score"
import getConfig from "./config"


export async function getScores () {
    let games = await Game.findAll({
        where: {
            status: 3
        }
    })
    
    return await calculateScores(games)
}

export async function calculateScores (games: Game[]) {
    let scores = new Map<number, Score>()
    let config = await getConfig()

    // cumulate games
    games.map(game => {
        if (!scores.has(game.whitePid)) scores.set(game.whitePid, new Score(config))
        if (!scores.has(game.blackPid)) scores.set(game.blackPid, new Score(config))

        scores.get(game.whitePid)!.recordGame(game, 1)
        scores.get(game.blackPid)!.recordGame(game, 2)
    })

    return scores
}