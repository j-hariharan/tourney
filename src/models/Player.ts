import { DataTypes, Model } from "sequelize"
import sequelize from "../helpers/db"

class Player extends Model {}

Player.init(
    {
        pid: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false
        }
    },
    {
        sequelize,
        modelName: "Player"
    }
)

// Player.sync({ alter: true })
export default Player