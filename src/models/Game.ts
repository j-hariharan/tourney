import { DataTypes, Model } from "sequelize"
import sequelize from "../helpers/db"
import User from "./User"
import Player from "./Player"

class Game extends Model {}

let uid = () => ({
    type: DataTypes.INTEGER,
    references: {
        model: User,
        key: "uid"
    }
})

let pid = () => ({
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
        model: Player,
        key: "pid"
    }
})

Game.init(
    {
        gid: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },

        white: pid(),
        black: pid(),
        startTime: DataTypes.DATE,
        endTime: DataTypes.DATE,
        winner: DataTypes.INTEGER,
        outcome: DataTypes.STRING,
        startedBy: uid(),
        resultDeclaredBy: uid(),
        prevOrganizerWhite: uid(),
        prevOrganizerBlack: uid(),

        status: {
           type: DataTypes.INTEGER,
           allowNull: false
        }

    },
    { 
        sequelize,
        modelName: "Game"
    }
)

// Game.sync({ alter: true })
export default Game