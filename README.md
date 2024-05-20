# tourney
A platform to manage chess tournaments with a special requirement: new pairings are made soon after some players finish their game, not waiting for every game to complete.

# Setup

### Prerequisites
1. Updated version of NodeJS installed
2. Docker Desktop or CLI installed

### Project Setup
- Clone this repository
- Inside the project folder, run `npm install` in the terminal

### Database Setup
- To create a MySQL database using docker, run `docker compose up` in the terminal
- Go to [createadminuser.ts](/createadminuser.ts) and modify the admin user name, email and password according to the requirement
- To create the admin user, run `npx ts-node createadminuser.ts` in the terminal

### Run the project
- Inside the project, run `npm run dev` to start up a development version of the project