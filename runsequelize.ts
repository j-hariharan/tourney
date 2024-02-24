import Game from './src/models/Game'
import Player from './src/models/Player'

async function fetchData () {
    let players = await Player.findAll()
    console.log(players.map(p => p.toJSON()))
}

fetchData()