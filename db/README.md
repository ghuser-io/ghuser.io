# Database

It is here to cache GitHub's data. During the prototyping phrase, it's just a set of
[JSON files](data/) that we update once per day.

## Updating the database

Several scripts form a pipeline for updating the database. Here is the data flow:

```
[ ./addUser.js myUser ]   [ ./rmUser.js myUser ]
                 │             │
                 v             v
              ┌───────────────────┐
              │ users/myuser.json │<───────────┐
              └────────────────┬──┘ │─┐        │
                └──────────────│────┘ │        │                    ╔════════╗
                  └────┬───────│──────┘        │                    ║ GitHub ║
                       │       │               │                    ╚════╤═══╝
                       │       v               │                         │
                       │   [ ./fetchUserDetailsAndContribs.js myUser ]<──┤
                       │                                                 │
                       ├──────────────────>[ ./fetchOrgs.js ]<───────────┤
                       │                            │                    │
                       │                            v                    │
                       │                      ┌───────────┐              │
                       │                      │ orgs.json │              │
                       │                      └─────┬─────┘              │
                       │                            │                    │
                       ├──>[ ./fetchRepos.js ]<──────────────────────────┘
                       │         │                  │
                       │         v        ┌─────────┘
                       │  ┌────────────┐  │
                       │  │ repos.json │  │
                       │  └──────┬─────┘  │
                       │         │        │
                       v         v        v
                   [ ./calculateContribs.js ]
                                 │
                                 v
                      ┌──────────────────────┐
                      │ contribs/myuser.json │─┐
                      └──────────────────────┘ │─┐
                        └──────────────────────┘ │
                          └──────────────────────┘
```

For running the entire data pipeline at once, do

```bash
$ npm install
$ export GITHUB_CLIENT_ID=0123456789abcdef0123
$ export GITHUB_CLIENT_SECRET=0123456789abcdef0123456789abcdef01234567
$ export GITHUB_USERNAME=AurelienLourot
$ export GITHUB_PASSWORD=********
$ ./fetchAndCalculateAll.sh
...
data/
  users/
    42 users
    largest: richardlitt.json (39 KB)
    total: 158 KB
  contribs/
    largest: richardlitt.json (268 KB)
    total: 861 KB
  orgs.json: 123 KB
  repos.json: 5216 KB
  total: 6358 KB

=> 151 KB/user

real    16m37.964s
user    3m41.584s
sys     0m27.292s
```

> **NOTE**: API keys can be created [here](https://github.com/settings/developers).

## Serving one more user

```bash
$ ./addUser.js newGreatUser
$ ./fetchAndCalculateAll.sh
```

## Deleting a profile

```bash
$ ./rmUser.js formerUser "you asked us to remove your profile in https://github.com/AurelienLourot/ghuser.io/issues/666"
$ ./fetchAndCalculateAll.sh # will also perform some garbage collection
```
