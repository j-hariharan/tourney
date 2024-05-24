import PlayerData from "../../types/PlayerData"
import checkPair from "./checkPair"

export default function match (playerData: PlayerData[], pair: number) : boolean {
    let n = playerData.length

    if (pair == Math.floor(n/2) + 1) return true

    for (let i = 0 ; i<n ; i++) {
        if (playerData[i].pair != 0) continue

        let firstPlayer = playerData[i]
        for (let j=i+1 ; j<n ; j++) {
            if (playerData[j].pair != 0) continue

            let secondPlayer = playerData[j]

            // check if pair is legal
            if (!checkPair(firstPlayer, secondPlayer)) continue

            firstPlayer.pair = pair
            secondPlayer.pair = pair

            let result = match(playerData, pair+1)

            if (result) return true

            firstPlayer.pair = 0
            secondPlayer.pair = 0
        }
    }

    return false
}
