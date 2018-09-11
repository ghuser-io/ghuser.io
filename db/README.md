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
    65 users
    largest: jordansissel.json (11 KB)
    total: 189 KB
  contribs/
    largest: calinou.json (111 KB)
    total: 1134 KB
  repos/
    2346 repos
    largest: deadlyvipers/dojo_rules.json (164 KB)
    total: 7687 KB
  orgs.json: 181 KB
  total: 9192 KB

=> 141 KB/user

2888 GitHub API calls were made.

real    18m26.658s
user    0m41.492s
sys     0m4.604s
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
