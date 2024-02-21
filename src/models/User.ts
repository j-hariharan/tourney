import { DataTypes, Model } from "sequelize"
import sequelize from "../helpers/db"

class User extends Model {
    declare uid: number;
    declare name: string;
    declare email: string;
    declare password: string;
    declare role: number;

    get isOrganizer () {
        return [0,2,3].includes(this.role)
    }

    get isArbiter () {
        return [0,1,3].includes(this.role)
    }

    get isAdmin () {
        return this.role == 0
    }
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
            type: DataTypes.INTEGER,
            defaultValue: -1
        }
    },
    {
        sequelize,
        modelName: "User"
    }
)

// User.sync({ alter: true })
export default User