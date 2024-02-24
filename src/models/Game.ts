import { DataTypes, Model } from "sequelize"
import sequelize from "../helpers/db"
import User from "./User"
import Player from "./Player"

class Game extends Model {
    declare gid: number;
    declare startTime?: Date;
    declare endTime?: Date;
    declare winner?: number;
    declare outcome?: string;
    declare status: number;

    declare black: Player;
    declare white: Player;
    declare startedBy?: User;
    declare resultDeclaredBy?: User;
    declare prevArbiterWhite?: User;
    declare prevArbiterBlack?: User;


    get isScheduled () { return this.status == 0 }
    get isStarted () { return this.status == 1 }
    get isCancelled () { return this.status == 2}
    get isCompleted () { return this.status == 3 }
    
    get resultString () {
        if (this.isScheduled) return "scheduled"
        if (this.isStarted) return "ongoing"
        if (this.isCancelled) return "cancelled"

        let s = ""
        if (this.winner == 0) s = "draw"
        else if (this.winner == 1) s = "white won"
        else if (this.winner == 2) s = "black won"

        s += ` (${this.outcome})`
        return s
    }
}


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