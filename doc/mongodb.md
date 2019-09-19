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

db.users.save({name: 'andrew', password: '$2b$12$k6cd0Qp7hQgm.xUr7jElwOVDtuFS1KECWk6yQUlNdV6k.XjMjmMYK', roles: ['admin']});
db.users.save({name: 'steven', password: '$2b$12$Ds0G1pW7XYy4xuH4RuJpYuWVbCm/qG7zHIpQPjwxW5A4DdEO1sMSC', roles: ['admin']});
db.users.save({name: 'brian', password: '$2b$12$mZatEoyX2pg2WzAjmTS31OGb9g3mZ/3yoL.JOGgA6ZI7rtcvUMMHG', roles: ['admin']});
db.users.save({name: 'niels', password: '$2b$12$PRNd/y5cEOqkebqVRhPoE.O7y7l4w0W1waGtdDR97lYZJKXUNvmA.', roles: ['admin']});
db.users.save({name: 'paul', password: '$2b$12$eeJffu.VOif/dEC/phnud.saA5O0mWV90Unka3vIf0hKloshwnqZu', roles: ['admin']});


db.users.updateOne({ name : "paul" }, { $set: { password : "$2b$12$s3Hoi9hfrQSu3Vj9Z.Yek.HvtwpasQQbeJsGasW0tCCjGZncMlHPG" } });

niels:YKekdY2y
steven:LfMsTGEh
andrew:puTrZGHJ
brian:gwPPStRr