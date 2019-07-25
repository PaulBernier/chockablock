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
db.blocks.createIndex( { "timestamp": 1 })

## Commands

Add/update user:
require('bcrypt').hashSync('gwPPStRr', 12)

db.users.insertOne({name: 'brian', password: '$2b$12$zBgVuFIJHesH3lwFiWvrOuAAWPTfbbJiR9mF8EHDq0eH2LiKaUoMq', roles: ['admin']});


db.users.updateOne({ name : "paul" }, { $set: { password : "$2b$12$s3Hoi9hfrQSu3Vj9Z.Yek.HvtwpasQQbeJsGasW0tCCjGZncMlHPG" } });

niels:YKekdY2y
steven:LfMsTGEh
andrew:puTrZGHJ
brian:gwPPStRr