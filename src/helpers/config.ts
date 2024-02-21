import Config from "../models/Config"

export default async function getConfig () {
    let config = await Config.findOne()
    
    return {
        max_games_per_pair: config?.max_games_per_pair,
        wait_before_matching: config?.wait_before_matching,
        win: config?.win,
        loss: config?.loss,
        draw: config?.draw
    }
}