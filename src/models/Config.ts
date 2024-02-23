import { DataTypes, Model } from "sequelize"
import sequelize from "../helpers/db"

class Config extends Model {
    declare max_games_per_pair: number;
    declare wait_before_matching: number;
    declare win: number;
    declare loss: number;
    declare draw: number;
}

Config.init(
    {
        max_games_per_pair: {
            type: DataTypes.INTEGER,
            defaultValue: 4
        },
        wait_before_matching: {
            type: DataTypes.FLOAT,
            defaultValue: 2
        },
        win: {
            type: DataTypes.FLOAT,
            defaultValue: 1
        },
        loss: {
            type: DataTypes.FLOAT,
            defaultValue: 0
        },
        draw: {
            type: DataTypes.FLOAT,
            defaultValue: 0.5
        }
    }, 
    {
        sequelize, 
        modelName: "Config", tableName: "Config"
    }
)

export default Config
