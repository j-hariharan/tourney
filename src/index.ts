import express from 'express'
import cookieParser from 'cookie-parser'
import bodyParser from 'body-parser'
import { engine } from 'express-handlebars'
import "dotenv/config"

import login_routes from './routes/login'
import register_routes from './routes/register'
import home_routes from './routes/home'
import settings_routes from './routes/settings'
import users_routes from './routes/users'
import players_routes from './routes/players'
import games_routes from './routes/games'


import auth_middleware from './helpers/auth'


const app = express()
const PORT = 3000



// middleware

app.use(cookieParser())
app.use(express.static('public'))
app.use(bodyParser.urlencoded({ extended: true }))

app.use(auth_middleware)




// handlebars

app.engine('handlebars', engine())
app.set('view engine', 'handlebars')
app.set('views', 'views')


// routes

app.use(home_routes)
app.use(login_routes)
app.use(register_routes)
app.use(settings_routes)
app.use(users_routes)
app.use(players_routes)
app.use(games_routes)



// start app

app.listen(PORT, () => {
    console.log("Listening...")
})