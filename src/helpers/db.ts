import { Sequelize } from "sequelize"
import UserFields from "../models/User"


const sequelize = new Sequelize('mysql://root:tourney@localhost:8080/tourney')

async function test () {
    try {
        await sequelize.authenticate()
        console.log("Connected to database!")
    }
    catch {
        console.log("Error connecting to database :(")
    }
}

test()

export default sequelize