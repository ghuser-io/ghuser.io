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
Ran in 35 minutes.
7 users
DB size: 3477 KB
=> 5 minutes/user
=> 497 KB/user
```

> **NOTE**: API keys can be created [here](https://github.com/settings/developers).

## Serving one more user

```bash
$ ./addUser.js newGreatUser
$ ./fetch.js
```

## Deleting a profile

```bash
$ ./rmUser.js formerUser "you asked us to remove your profile in https://github.com/AurelienLourot/ghuser.io/issues/666"
$ ./fetch.js # will also perform some garbage collection
```
