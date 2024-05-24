import Game from "../models/Game"

interface ScoreType {
    played: number
    won: number
    lost: number
    drew: number
    points: number
    black: {
        played: number
        won: number
        lost: number
        drew: number
    }
    white: {
        played: number
        won: number
        lost: number
        drew: number
    }
}


export default class Score implements ScoreType {
    played = 0
    won = 0
    lost = 0
    drew = 0
    points = 0
    black = { played: 0, won: 0, lost: 0, drew: 0 }
    white = { played: 0, won: 0, lost: 0, drew: 0 }

    constructor (public config: { win: number, loss: number, draw: number } = {win:0, loss: 0, draw: 0}) {}

    recordGame (game: Game, color: number) {
        let colorScore
        if (color == 1) colorScore = this.white
        else colorScore = this.black
        
        this.played++
        colorScore.played++
        
        // draw
        if (game.winner == 0) {
            this.drew++
            colorScore.drew++
            this.points += this.config.draw
        }
        
        // won
        else if (game.winner == color) {
            this.won++
            colorScore.won++
            this.points += this.config.win
        }

        // lost
        else {
            this.lost++
            colorScore.lost++
            this.points += this.config.loss
        }
    }
}