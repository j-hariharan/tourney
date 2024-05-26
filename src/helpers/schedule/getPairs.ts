import PlayerData from "../../types/PlayerData"

export default function getPairs (players: PlayerData[]) {
    let pairs: PlayerData[][] = []

    for (let i=0 ; i<Math.floor(players.length/2) ; i++) {
        pairs.push([])
    }

    for (let i of players) {
        if (i.color == 1) {
            pairs[i.pair-1].splice(0, 0, i)
        } else {
            pairs[i.pair-1].push(i)
        }
    }

    return pairs
}