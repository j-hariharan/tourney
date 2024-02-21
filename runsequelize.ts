import Config from './src/models/Config'

async function fetchData () {
    let config = await Config.findOne()
    console.log(config?.toJSON())
}

fetchData()