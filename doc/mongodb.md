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

## Indexes

db.users.createIndex( { "name": 1 }, { unique: true } )

## Commands

Add/update user:
require('bcrypt').hashSync('aaaaaaaa', 12)

db.users.insertOne({name: 'paul', password: '', roles: ['admin']});
db.users.updateOne({ name : "paul" }, { $set: { password : "$2b$12$s3Hoi9hfrQSu3Vj9Z.Yek.HvtwpasQQbeJsGasW0tCCjGZncMlHPG" } });
