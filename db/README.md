# Database

It is here to cache GitHub's data. During the prototyping phrase, it's just a [JSON file](db.json)
that we update once per day.

## Updating the database

```bash
$ npm install
$ export GITHUB_CLIENT_ID=0123456789abcdef0123
$ export GITHUB_CLIENT_SECRET=0123456789abcdef0123456789abcdef01234567
$ export GITHUB_USERNAME=AurelienLourot
$ export GITHUB_PASSWORD=********
$ ./fetch.js
...
9 users
DB size: 4536 KB
```

> **NOTE**: API keys can be created [here](https://github.com/settings/developers).

## Serving one more user

```bash
$ ./addUser.js newGreatUser
$ ./fetch.js
```

## Garbage collection

Sometimes repos get deleted or moved and users leave organizations. Then we end up with objects in
the database that don't contribute to any profile anymore. Run the garbage collector from time to
time:

> Not implemented yet
