const ADMIN_USER_NAME = "John Doe"
const ADMIN_USER_EMAIL = "example@email.com"
const ADMIN_USER_PASSWORD = "examplepassword"


import Game from './src/models/Game'
import Player from './src/models/Player'
import User from './src/models/User'
import Config from './src/models/Config'

async function createAdminUser () {
    await Game.sync()
    await Player.sync()
    await User.sync()
    await Config.sync()

    await User.create({ name: ADMIN_USER_NAME, email: ADMIN_USER_EMAIL, password: ADMIN_USER_PASSWORD, role: 0 })
}

createAdminUser()