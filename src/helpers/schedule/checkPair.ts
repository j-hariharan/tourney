import PlayerData from "../../types/PlayerData"

export default function checkPair (f: PlayerData, s: PlayerData) : boolean {
    // if they have played each other, skip
    if (f.stats.get(s.pid)?.played) return false
    if (s.stats.get(f.pid)?.played) return false

    // check colors
    let fw = f.score.white.played
    let fb = f.score.black.played
    let sw = s.score.white.played
    let sb = s.score.black.played

    if (fw >= fb + 1) {
        // first wants black

        // if second also wants black
        if (sw >= sb + 1) return false
        
        f.color = 2
        s.color = 1
    } else if (fb >= fw + 1) {
        // first wnats white

        // if second also wants white
        if (sb >= sw + 1) return false

        f.color = 1
        s.color = 2
    } else if (f.lastColor == 1) {
        // first doesn't mind but prefers black

        // if second doesn't mind white
        if (sw < sb + 1) {
            f.color = 2
            s.color = 1
        } else {
            f.color = 1
            s.color = 2
        }
    } else {
        // first doesn't mind but prefers white

        // if second doesn't mind black
        if (sb < sw + 1) {
            f.color = 1
            s.color = 2
        } else {
            f.color = 2
            s.color = 1
        }
    }

    return true
}