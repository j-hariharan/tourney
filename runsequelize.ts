import User from "./src/models/User"

async function fetchData () {
    let user = await User.findAll()
    user.forEach(u => console.log(u.toJSON()))

    // await User.update({ role: 0 }, { where: { uid: 2 }})
}

fetchData()