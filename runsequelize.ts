import Config from './src/models/Config'
import User from './src/models/User'

async function fetchData () {
    await User.create({
        name: "def",
        email: "def@email",
        password: "def"
    })
}

fetchData()