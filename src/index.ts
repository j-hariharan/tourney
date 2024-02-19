import express from 'express'
import cookieParser from 'cookie-parser'
import "dotenv/config"
import { engine } from 'express-handlebars'

const app = express()
const PORT = 3000



// middleware

app.use(cookieParser())
app.use(express.static('public'))




// handlebars

app.engine('handlebars', engine())
app.set('view engine', 'handlebars')
app.set('views', 'views')


// routes

app.get('/', (req, res) => {
    res.render('home')
})




// start app

app.listen(PORT, () => {
    console.log("Listening...")
})