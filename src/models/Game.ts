import { DataTypes, Model } from "sequelize"
import sequelize from "../helpers/db"
import User from "./User"
import Player from "./Player"

class Game extends Model {}


Game.init(
    {
        gid: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        startTime: DataTypes.DATE,
        endTime: DataTypes.DATE,
        winner: DataTypes.INTEGER,
        outcome: DataTypes.STRING,

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


Game.belongsTo(Player, { as: "white", foreignKey: {allowNull: false} })
Game.belongsTo(Player, { as: "black", foreignKey: {allowNull: false} })
Player.hasMany(Game)


Game.belongsTo(User, { as: "startedBy", })
Game.belongsTo(User, { as: "resultDeclaredBy" })
Game.belongsTo(User, { as: "prevArbiterWhite" })
Game.belongsTo(User, { as: "prevArbiterBlack" })
User.hasMany(Game)

export default Game