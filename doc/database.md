# Database

The database used is MongoDB on port 27017. The db name is `chocka`.

Docker is recommended to run MongoDB.:

```bash
docker run --name mongodb -p 27017:27017 -d mongo:4.1-bionic
```

Commands to get a mongo shell:

```bash
docker exec -it mongodb bash
mongo
use chocka
```

## Collections

```
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

loadtests_v2 {
    start: {
        user: string,
        time: Date
    },
    end: {
        user: string,
        time: Date
    },
    type: string,
    chainIds: [],
    entrySizeRange: {
        min: int,
        max: int
    },
    authoritySet: {
        ...
    },
    generatorConfig: {
        ...
    },
    agentsCount: int
}
```

### Notes

- user.password: must be a password hashed by bcrypt. Online tool like https://passwordhashing.com/BCrypt can be used to generate this.
- user.roles: only "admin" role is currently recognized.

## Indexes

db.users.createIndex( { "name": 1 }, { unique: true } )
db.blocks.createIndex( { "height": 1 }, { unique: true } )
db.blocks.createIndex( { "timestamp": 1 })
db["loadtests_v2"].createIndex( { "start.timestamp": 1 })
