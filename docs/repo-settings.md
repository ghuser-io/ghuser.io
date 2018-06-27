# Per-repo settings

You can define an avatar for any `owner/repo` by committing a `.ghuser.io.json` file in
`https://github.com/owner/repo`:

```json
{
  "_comment": "Settings for ghuser.io. See https://github.com/AurelienLourot/ghuser.io/blob/master/docs/repo-settings.md",
  "avatar_url": "https://rawgit.com/AurelienLourot/ghuser.io/master/docs/logo_square.png"
}
```

This avatar will be used on any ghuser-profile mentioning this repo.

See [this example](../.ghuser.io.json).
