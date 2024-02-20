import { DataTypes, Model } from "sequelize"
import sequelize from "../helpers/db"

class User extends Model {
    declare uid: number;
    declare name: string;
    declare email: string;
    declare password: string;
    declare role: number;
}

User.init(
    {
        uid: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        role: {
            type: DataTypes.INTEGER
        }
    },
    {
        sequelize,
        modelName: "User"
    }
)

// User.sync({ alter: true })
export default User