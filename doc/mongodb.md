docker run --name mongodb -p 27017:27017 -d mongo:4.1-bionic

```bash
docker exec -it mongodb bash
mongo
use chocka
```

## Collections

users {
    name: string,
    password: string,
    roles: string[]
}

blocks {
    height: number,
    timestamp: number,
    entryCount: number,
    hasElection: boolean
}

loadTest {
    start: {
        user: string,
        time: Date
    },
    end: {
        user: string,
        time: Date
    },
    authoritySet: {

    },
    type: string,
    generatorConfig: {

    },
    chainIds: [],
    events: [{type: string, time: Date}]
}

db.blocks.find({}).sort([["height", 1]]).limit(5).toArray()

## Indexes

db.users.createIndex( { "name": 1 }, { unique: true } )
db.blocks.createIndex( { "height": 1 }, { unique: true } )

## Commands

Add/update user:
require('bcrypt').hashSync('aaaaaaaa', 12)

db.users.insertOne({name: 'paul', password: '$2b$12$lj58fv7mI2I/99ps01E/tevT3olHNUzrlCJuhkW.NCYIEPz8Ra54a', roles: ['admin']});
db.users.updateOne({ name : "paul" }, { $set: { password : "$2b$12$s3Hoi9hfrQSu3Vj9Z.Yek.HvtwpasQQbeJsGasW0tCCjGZncMlHPG" } });
