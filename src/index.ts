import express from 'express'
import cookieParser from 'cookie-parser'
import bodyParser from 'body-parser'
import { engine } from 'express-handlebars'
import "dotenv/config"

import login_routes from './routes/login'


const app = express()
const PORT = 3000



// middleware

app.use(cookieParser())
app.use(express.static('public'))
app.use(bodyParser.urlencoded({ extended: true }))




// handlebars

app.engine('handlebars', engine())
app.set('view engine', 'handlebars')
app.set('views', 'views')


// routes

app.use(login_routes)



// start app

app.listen(PORT, () => {
    console.log("Listening...")
})