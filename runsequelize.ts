import { where } from 'sequelize'
import Game from './src/models/Game'
import Player from './src/models/Player'
import User from './src/models/User'

async function fetchData () {
    let games = await Game.findAll()
    // console.log(games.map(g => g.toJSON()))

    // let users = await User.findAll()
    // console.log(users.map(u => u.toJSON()))

    // await Game.destroy({ where: {gid: 2}})
    // 1 4 5 7 8 9

    await Game.update({ prevArbiterWhiteUid: 2 }, { where: {gid: 5}})


}

fetchData()