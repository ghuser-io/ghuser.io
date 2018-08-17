# Per-user settings/metadata

You can tweak your profile by creating a `<your-username>/ghuser.io.settings` repo containing a
`ghuser.io.json` file, or by forking
[AurelienLourot/ghuser.io.settings](https://github.com/AurelienLourot/ghuser.io.settings).

## Table of Contents

<!-- toc -->

- [Links to Twitter/Reddit/LinkedIn/StackOverflow](#links-to-twitterredditlinkedinstackoverflow)

<!-- tocstop -->

## Links to Twitter/Reddit/LinkedIn/StackOverflow

```json
{
  "_comment": "User metadata for ghuser.io. See https://github.com/AurelienLourot/ghuser.io/blob/master/docs/user-settings.md",
  "twitter_username": "AurelienLourot",
  "reddit_username": "lourot",
  "linkedin_id": "aurelien-lourot-67317748",
  "stackoverflow_id": "1855917"
}
```

Your profile will then link to:

* `https://twitter.com/<twitter_username>`
* `https://www.reddit.com/user/<reddit_username>`
* `https://linkedin.com/in/<linkedin_id>`
* `https://stackoverflow.com/users/<stackoverflow_id>`

> ![screenshot](user-settings.png)

See [this example](https://github.com/AurelienLourot/ghuser.io.settings/blob/master/ghuser.io.json).
