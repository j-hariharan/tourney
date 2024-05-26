import { Op } from "sequelize"
import Player from "../../models/Player"
import sequelize from "../db"

export default async function getFreePlayers () {
    return await Player.findAll({
        where: {
            pid: {
                [Op.notIn]: sequelize.literal(`(
                    (
                        SELECT whitePid from Games where status in (0,1)
                    )
                    UNION
                    (
                        SELECT blackPid from Games where status in (0,1)
                    )
                )`),
            },
            disabled: false
        }
    })
}