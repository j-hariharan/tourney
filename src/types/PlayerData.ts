import PlayerStats from "./PlayerStats"
import Score from "./Score"

export default interface PlayerData {
    pid: number
    name: string
    pair: number
    color: 0 | 1 | 2
    score: Score
    lastColor: 0 | 1 | 2
    stats: Map<number,PlayerStats>
}