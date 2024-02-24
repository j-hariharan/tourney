import { DataTypes, Model } from "sequelize"
import sequelize from "../helpers/db"

class Player extends Model {
    declare pid: number;
    declare name: string;
    declare disabled: boolean;
}

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
        },
        disabled: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        }
    },
    {
        sequelize,
        modelName: "Player"
    }
)

export default Player