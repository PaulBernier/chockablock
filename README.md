# ChockaBlock

ChockaBlock is a load testing tool for the Factom blockchain.

## Architecture

![](doc/chockablock_architecture.png)

Technology used:
- Frontend: Vue.js + Vuetify (1.5.x) + Chart.js
- Server: Node.js, GraphQL
- Database: MongoDB
- Agent: Go
- server/agents communication: websocket

This repository contains the code for the GraphQL server, the web frontend UI and the websocket server to communicate with agents. Agent source code can be found [here](https://github.com/PaulBernier/chockagent).

## Deploying ChockaBlock

Have a look at `deploy.sh` script for a basic way to deploy ChockaBlock and at the associated Nginx configs in `doc/nginx-config`.

### Frontend

To build the frontend:
```bash
npm run build
```
The frontend will be built in a `dist` folder. It needs to be moved to `www` folder which is where the server is expecting to serve static assets from.

### Database

ChockaBlock is using MongoDB. It expects it to be on port 27017. We recommend using the MongoDB docker container:

```bash
docker run --name mongodb -p 27017:27017 -d mongo:4.1-bionic
```

See `doc/database.md` for information on the database structure.

### Factomd

A Factomd (testnet) node is expected to run on localhost with its API exposed on port 8088. This node is used to read the block information and also create chains.

### Backend

Some environment variables need to be set before starting:
```bash
EC_ADDRESS=EsXXXXXXXXXXXXXX                                  # EC private address used to create chains
JWT_SECRET=XXXXXXXXXXXXXXX                                   # JWT secret for JWT based authentication (random string)
VUE_APP_GRAPHQL_HTTP=https://chockablock.luciap.ca/graphql   # Apollo GraphQL configs
VUE_APP_GRAPHQL_WS=wss://chockablock.luciap.ca/graphql
```

Then to launch ChockaBlock, using PM2:
```bash
pm2 reload ecosystem.config.js --env production
```

This will serve static files (UI) and GraphQL server on port 4000. Websocket server (for agents to connect to) is on port 4007.

## Running the stack locally for development


```bash
npm i # Install dependencies
docker start mongodb # Start local MongoDB Docker container
# Run the following commands in parallel (separate terminals)
npm run serve # for frontend development
npm run start # for backend development
```

`npm run serve` and `npm run start` will handle hot reloading both for the frontend and the backend.