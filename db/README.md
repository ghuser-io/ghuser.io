# Database

It is here to cache GitHub's data. During the prototyping phrase, it's just a set of
[JSON files](data/) that we update once per day by running [this bot](fetchBot/) on an
[EC2 instance](../aws/ec2/).

## Table of Contents

<!-- toc -->

- [Updating the database](#updating-the-database)
- [Serving one more user](#serving-one-more-user)
- [Deleting a profile](#deleting-a-profile)

<!-- tocstop -->

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
                       ├───────────────────────>[ ./fetchOrgs.js ]<──────┤
                       │                              ^     │            │
                       │                              │     │            │
                       │                              v     v            │
                       │                 ┌──────────────┐ ┌───────────┐  │
                       │                 │ nonOrgs.json │ │ orgs.json │  │
                       │                 └──────────────┘ └───┬───────┘  │
                       │                                      │          │
                       ├──>[ ./fetchRepos.js ]<──────────────────────────┘
                       │             │                        │
                       │             v                        │
                       │  ┌───────────────────────────┐       │
                       │  │ repos/myOwner/myRepo.json │─┐     │
                       │  └───────────────────────────┘ │─┐   │
                       │    └───────────────────────────┘ │   │
                       │      └────┬──────────────────────┘   │
                       │           │                          │
                       │           │      ┌───────────────────┘
                       │           │      │
                       v           v      v
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
    262 users
    largest: moul.json (20 KB)
    total: 634 KB
  contribs/
    largest: moul.json (216 KB)
    total: 3823 KB
  repos/
    8159 repos
    largest: jlord/patchwork.json (379 KB)
    total: 23889 KB
  orgs.json: 639 KB
  nonOrgs.json: 35 KB
  total: 28984 KB

=> 111 KB/user
GitHub API key found.
GitHub credentials found.

real    78m44.200s
user    2m58.520s
sys     0m23.160s
```

> **NOTE**: API keys can be created [here](https://github.com/settings/developers).

## Serving one more user

```bash
$ ./addUser.js newGreatUser
$ ./fetchAndCalculateAll.sh
```

## Deleting a profile

```bash
$ ./rmUser.js formerUser "you asked us to remove your profile in https://github.com/ghuser-io/ghuser.io/issues/666"
$ ./fetchAndCalculateAll.sh # will also perform some garbage collection
```
