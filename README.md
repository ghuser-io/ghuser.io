[![Build Status](https://travis-ci.org/ghuser-io/ghuser.io.svg?branch=master)](https://travis-ci.org/ghuser-io/ghuser.io)
[![All Contributors](https://img.shields.io/badge/all_contributors-33-orange.svg?style=flat-square)](#contributors)
[![Twitter](https://img.shields.io/badge/-twitter-black.svg?style=flat-square&logo=twitter&colorB=555555)](https://twitter.com/ghuserio)

<p align="center">
  <a href="https://ghuser.io">
    <img src="https://cdn.jsdelivr.net/gh/ghuser-io/ghuser.io@f44119258dfeade99c800232044cf7c3e3a91982/docs/logo.png"
         width="400" height="108" />
  </a>
</p>
<p align="center">
  <b>Better GitHub profiles</b>
</p>
<br />

<!-- issue190 -->
> **WARNING**: This project
> [isn't actively maintained anymore](https://github.com/ghuser-io/ghuser.io/issues/190).

# Table of Contents

<!-- toc -->

- [What we are building](#what-we-are-building)
- [Contributing](#contributing)
  * [To the web app's implementation](#to-the-web-apps-implementation)
  * [To the documentation](#to-the-documentation)
  * [Contributors](#contributors)
- [FAQ](#faq)
  * [Is my profile static or dynamic?](#is-my-profile-static-or-dynamic)
  * [Some of my repos are not showing up on my profile, why?](#some-of-my-repos-are-not-showing-up-on-my-profile-why)
  * [Does ghuser.io intend to compete with the default GitHub profiles?](#does-ghuserio-intend-to-compete-with-the-default-github-profiles)
  * [How are the organizations sorted in the `Contributed to` section?](#how-are-the-organizations-sorted-in-the-contributed-to-section)

<!-- tocstop -->

# What we are building

> *Example: https://ghuser.io/AurelienLourot*
>
> ![screenshot](docs/screenshot.png)

We love the default GitHub profiles and we want to enhance them:

* The GitHub profiles aren't clearly showing all the repos you have contributed to since you joined
  GitHub. We are showing them **all**, even those you don't own and those owned by organizations
  you're not in.<sup>[1](#footnote1)</sup>
* The GitHub profiles are listing all the repos you own but they sort them only by age of the
  latest commit. We prefer to **sort repos** by a combination of how much you
  have contributed to them, their size, how popular they are, etc. For each user we want to see
  first the latest greatest repos they have most contributed to.
* On GitHub only repos earn stars. We push it one step further by having **users earn stars**:
  You earn stars when you contribute to a repo.
  We add all these earned stars and show how many you've earned in total.
* The GitHub profiles don't clearly show how big your contribution to a repo was, when you don't own
  it. Maybe you wrote 5%. Maybe 90%. We **make it clear**.
* GitHub detects programming languages. We also want to know about
  [**technologies/frameworks**](docs/repo-settings.md), e.g. "react", "docker", etc.
* The GitHub profiles allow filtering your repos by programming language. We will allow **filtering
  by technologies/frameworks** as well.
* The GitHub profiles can be tweaked by clicking around. We allow them to be
  [**tweaked programmatically**](docs/user-settings.md).
* On GitHub only users and organizations have avatars. We bring
  [**avatars to repos**](docs/repo-settings.md).

Our enhanced profiles are accessible at `https://ghuser.io/<github-username>`, e.g.
[ghuser.io/AurelienLourot](https://ghuser.io/AurelienLourot).

<a name="footnote1"><sup>1</sup></a> We achieve this by using [github-contribs](https://github.com/ghuser-io/github-contribs).

# Contributing

## To the web app's implementation

* Fork this project.
* Make some changes to the [web app](reframe/).
* Validate your changes by [running the app locally](reframe/README.md#run-locally).
* Create a [pull request](https://github.com/ghuser-io/ghuser.io/compare) :)

## To the documentation

* Fork this project.
* Make some changes to the markdown files.
* Validate your changes by running `./build.sh`.
* Create a [pull request](https://github.com/ghuser-io/ghuser.io/compare) :)

## Contributors

Thanks goes to these wonderful people ([emoji key](https://github.com/kentcdodds/all-contributors#emoji-key)):

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore -->
<table><tr><td align="center"><a href="https://ghuser.io/AurelienLourot"><img src="https://avatars1.githubusercontent.com/u/11795312?v=4" width="100px;" alt="Aurelien Lourot"/><br /><sub><b>Aurelien Lourot</b></sub></a><br /><a href="#question-AurelienLourot" title="Answering Questions">💬</a> <a href="https://github.com/ghuser-io/ghuser.io/issues?q=author%3AAurelienLourot" title="Bug reports">🐛</a> <a href="https://github.com/ghuser-io/ghuser.io/commits?author=AurelienLourot" title="Code">💻</a> <a href="https://github.com/ghuser-io/ghuser.io/commits?author=AurelienLourot" title="Documentation">📖</a> <a href="#ideas-AurelienLourot" title="Ideas, Planning, & Feedback">🤔</a> <a href="#review-AurelienLourot" title="Reviewed Pull Requests">👀</a></td><td align="center"><a href="https://twitter.com/brillout"><img src="https://avatars2.githubusercontent.com/u/1005638?v=4" width="100px;" alt="Romuald Brillout"/><br /><sub><b>Romuald Brillout</b></sub></a><br /><a href="https://github.com/ghuser-io/ghuser.io/issues?q=author%3Abrillout" title="Bug reports">🐛</a> <a href="https://github.com/ghuser-io/ghuser.io/commits?author=brillout" title="Code">💻</a> <a href="#ideas-brillout" title="Ideas, Planning, & Feedback">🤔</a> <a href="#infra-brillout" title="Infrastructure (Hosting, Build-Tools, etc)">🚇</a> <a href="#review-brillout" title="Reviewed Pull Requests">👀</a> <a href="#question-brillout" title="Answering Questions">💬</a></td><td align="center"><a href="https://github.com/wowawiwa"><img src="https://avatars3.githubusercontent.com/u/4883293?v=4" width="100px;" alt="Charles"/><br /><sub><b>Charles</b></sub></a><br /><a href="https://github.com/ghuser-io/ghuser.io/commits?author=wowawiwa" title="Code">💻</a> <a href="#ideas-wowawiwa" title="Ideas, Planning, & Feedback">🤔</a></td><td align="center"><a href="http://timlange.me"><img src="https://avatars3.githubusercontent.com/u/13546486?v=4" width="100px;" alt="Tim Lange"/><br /><sub><b>Tim Lange</b></sub></a><br /><a href="#question-venarius" title="Answering Questions">💬</a> <a href="https://github.com/ghuser-io/ghuser.io/commits?author=venarius" title="Code">💻</a></td><td align="center"><a href="https://ghuser.io/jamesgeorge007"><img src="https://avatars2.githubusercontent.com/u/25279263?v=4" width="100px;" alt="James George"/><br /><sub><b>James George</b></sub></a><br /><a href="https://github.com/ghuser-io/ghuser.io/issues?q=author%3Ajamesgeorge007" title="Bug reports">🐛</a> <a href="https://github.com/ghuser-io/ghuser.io/commits?author=jamesgeorge007" title="Code">💻</a></td><td align="center"><a href="https://www.ceriously.com"><img src="https://avatars1.githubusercontent.com/u/229881?v=4" width="100px;" alt="Steven"/><br /><sub><b>Steven</b></sub></a><br /><a href="#ideas-styfle" title="Ideas, Planning, & Feedback">🤔</a> <a href="https://github.com/ghuser-io/ghuser.io/commits?author=styfle" title="Code">💻</a></td><td align="center"><a href="http://weblog.terrellrussell.com"><img src="https://avatars3.githubusercontent.com/u/55238?v=4" width="100px;" alt="Terrell Russell"/><br /><sub><b>Terrell Russell</b></sub></a><br /><a href="https://github.com/ghuser-io/ghuser.io/commits?author=trel" title="Code">💻</a></td></tr><tr><td align="center"><a href="https://github.com/G7-TheKing"><img src="https://avatars3.githubusercontent.com/u/35304641?v=4" width="100px;" alt="K Yasaswi Sri Chandra Gandhi"/><br /><sub><b>K Yasaswi Sri Chandra Gandhi</b></sub></a><br /><a href="https://github.com/ghuser-io/ghuser.io/commits?author=G7-TheKing" title="Code">💻</a></td><td align="center"><a href="https://rdil.rocks/"><img src="https://avatars3.githubusercontent.com/u/34555510?v=4" width="100px;" alt="Reece Dunham"/><br /><sub><b>Reece Dunham</b></sub></a><br /><a href="https://github.com/ghuser-io/ghuser.io/commits?author=RDIL" title="Code">💻</a></td><td align="center"><a href="https://jayvdb.github.io/"><img src="https://avatars1.githubusercontent.com/u/15092?v=4" width="100px;" alt="John Vandenberg"/><br /><sub><b>John Vandenberg</b></sub></a><br /><a href="https://github.com/ghuser-io/ghuser.io/issues?q=author%3Ajayvdb" title="Bug reports">🐛</a> <a href="#ideas-jayvdb" title="Ideas, Planning, & Feedback">🤔</a></td><td align="center"><a href="https://github.com/Naveenaidu"><img src="https://avatars1.githubusercontent.com/u/30195193?v=4" width="100px;" alt="Naveen Naidu"/><br /><sub><b>Naveen Naidu</b></sub></a><br /><a href="https://github.com/ghuser-io/ghuser.io/issues?q=author%3ANaveenaidu" title="Bug reports">🐛</a></td><td align="center"><a href="https://sr6033.github.io/"><img src="https://avatars3.githubusercontent.com/u/15799589?v=4" width="100px;" alt="Shubham Rath"/><br /><sub><b>Shubham Rath</b></sub></a><br /><a href="https://github.com/ghuser-io/ghuser.io/issues?q=author%3Asr6033" title="Bug reports">🐛</a></td><td align="center"><a href="http://adi.surge.sh"><img src="https://avatars1.githubusercontent.com/u/15871340?v=4" width="100px;" alt="Aditya Agarwal"/><br /><sub><b>Aditya Agarwal</b></sub></a><br /><a href="#blog-itaditya" title="Blogposts">📝</a></td><td align="center"><a href="https://www.linkedin.com/in/rupesh-jha-7aab6b155/"><img src="https://avatars1.githubusercontent.com/u/31209617?v=4" width="100px;" alt="Rupesh Krishna Jha"/><br /><sub><b>Rupesh Krishna Jha</b></sub></a><br /><a href="https://github.com/ghuser-io/ghuser.io/issues?q=author%3ARupeshiya" title="Bug reports">🐛</a></td></tr><tr><td align="center"><a href="https://github.com/crazy-max"><img src="https://avatars2.githubusercontent.com/u/1951866?v=4" width="100px;" alt="CrazyMax"/><br /><sub><b>CrazyMax</b></sub></a><br /><a href="https://github.com/ghuser-io/ghuser.io/issues?q=author%3Acrazy-max" title="Bug reports">🐛</a></td><td align="center"><a href="http://hakabuk.com"><img src="https://avatars2.githubusercontent.com/u/16784959?v=4" width="100px;" alt="Michal Weizman"/><br /><sub><b>Michal Weizman</b></sub></a><br /><a href="https://github.com/ghuser-io/ghuser.io/issues?q=author%3Azurda" title="Bug reports">🐛</a> <a href="#ideas-zurda" title="Ideas, Planning, & Feedback">🤔</a></td><td align="center"><a href="https://www.marsrainbow.cn"><img src="https://avatars1.githubusercontent.com/u/12212282?v=4" width="100px;" alt="Wei WANG"/><br /><sub><b>Wei WANG</b></sub></a><br /><a href="#infra-tianshanghong" title="Infrastructure (Hosting, Build-Tools, etc)">🚇</a></td><td align="center"><a href="http://rhodesmill.org/brandon"><img src="https://avatars1.githubusercontent.com/u/166162?v=4" width="100px;" alt="Brandon Rhodes"/><br /><sub><b>Brandon Rhodes</b></sub></a><br /><a href="#infra-brandon-rhodes" title="Infrastructure (Hosting, Build-Tools, etc)">🚇</a></td><td align="center"><a href="https://burntfen.com"><img src="https://avatars3.githubusercontent.com/u/910753?v=4" width="100px;" alt="Richard Littauer"/><br /><sub><b>Richard Littauer</b></sub></a><br /><a href="#ideas-RichardLitt" title="Ideas, Planning, & Feedback">🤔</a></td><td align="center"><a href="http://www.semicomplete.com/"><img src="https://avatars1.githubusercontent.com/u/131818?v=4" width="100px;" alt="Jordan Sissel"/><br /><sub><b>Jordan Sissel</b></sub></a><br /><a href="#infra-jordansissel" title="Infrastructure (Hosting, Build-Tools, etc)">🚇</a></td><td align="center"><a href="https://github.com/JPBotelho"><img src="https://avatars2.githubusercontent.com/u/19894116?v=4" width="100px;" alt="JPBotelho"/><br /><sub><b>JPBotelho</b></sub></a><br /><a href="#ideas-JPBotelho" title="Ideas, Planning, & Feedback">🤔</a></td></tr><tr><td align="center"><a href="http://xiegeo.com"><img src="https://avatars2.githubusercontent.com/u/3104386?v=4" width="100px;" alt="George Xie"/><br /><sub><b>George Xie</b></sub></a><br /><a href="#ideas-xiegeo" title="Ideas, Planning, & Feedback">🤔</a></td><td align="center"><a href="https://github.com/anishkny"><img src="https://avatars0.githubusercontent.com/u/357499?v=4" width="100px;" alt="Anish Karandikar"/><br /><sub><b>Anish Karandikar</b></sub></a><br /><a href="#ideas-anishkny" title="Ideas, Planning, & Feedback">🤔</a></td><td align="center"><a href="https://www.linkedin.com/in/palash25/"><img src="https://avatars0.githubusercontent.com/u/21367710?v=4" width="100px;" alt="Palash Nigam"/><br /><sub><b>Palash Nigam</b></sub></a><br /><a href="#blog-palash25" title="Blogposts">📝</a></td><td align="center"><a href="http://andrewbredow.com"><img src="https://avatars0.githubusercontent.com/u/96793?v=4" width="100px;" alt="Andrew Bredow"/><br /><sub><b>Andrew Bredow</b></sub></a><br /><a href="#ideas-andrewbredow" title="Ideas, Planning, & Feedback">🤔</a></td><td align="center"><a href="http://dufferzafar.github.io"><img src="https://avatars0.githubusercontent.com/u/1449512?v=4" width="100px;" alt="Shadab Zafar"/><br /><sub><b>Shadab Zafar</b></sub></a><br /><a href="#ideas-dufferzafar" title="Ideas, Planning, & Feedback">🤔</a></td><td align="center"><a href="https://github.com/philderbeast"><img src="https://avatars2.githubusercontent.com/u/633283?v=4" width="100px;" alt="Phil de Joux"/><br /><sub><b>Phil de Joux</b></sub></a><br /><a href="#ideas-philderbeast" title="Ideas, Planning, & Feedback">🤔</a></td><td align="center"><a href="https://github.com/sam0x17"><img src="https://avatars3.githubusercontent.com/u/1855021?v=4" width="100px;" alt="Sam Johnson"/><br /><sub><b>Sam Johnson</b></sub></a><br /><a href="#ideas-sam0x17" title="Ideas, Planning, & Feedback">🤔</a></td></tr><tr><td align="center"><a href="https://github.com/adklempner"><img src="https://avatars2.githubusercontent.com/u/22138672?v=4" width="100px;" alt="Arseniy Klempner"/><br /><sub><b>Arseniy Klempner</b></sub></a><br /><a href="#ideas-adklempner" title="Ideas, Planning, & Feedback">🤔</a></td><td align="center"><a href="https://daniel-ruf.de"><img src="https://avatars1.githubusercontent.com/u/827205?v=4" width="100px;" alt="Daniel Ruf"/><br /><sub><b>Daniel Ruf</b></sub></a><br /><a href="#ideas-DanielRuf" title="Ideas, Planning, & Feedback">🤔</a></td><td align="center"><a href="https://joecohens.com"><img src="https://avatars0.githubusercontent.com/u/1803556?v=4" width="100px;" alt="Joe Cohen"/><br /><sub><b>Joe Cohen</b></sub></a><br /><a href="#ideas-joecohens" title="Ideas, Planning, & Feedback">🤔</a></td><td align="center"><a href="http://www.jacobweisz.com"><img src="https://avatars0.githubusercontent.com/u/4399499?v=4" width="100px;" alt="Jacob Weisz"/><br /><sub><b>Jacob Weisz</b></sub></a><br /><a href="#ideas-ocdtrekkie" title="Ideas, Planning, & Feedback">🤔</a> <a href="https://github.com/ghuser-io/ghuser.io/issues?q=author%3Aocdtrekkie" title="Bug reports">🐛</a></td><td align="center"><a href="http://mzfr.github.io"><img src="https://avatars3.githubusercontent.com/u/16623935?v=4" width="100px;" alt="Mehtab Zafar"/><br /><sub><b>Mehtab Zafar</b></sub></a><br /><a href="#ideas-mzfr" title="Ideas, Planning, & Feedback">🤔</a></td></tr></table>

<!-- ALL-CONTRIBUTORS-LIST:END -->

This project follows the [all-contributors](https://github.com/kentcdodds/all-contributors)
specification. Contributions of any kind welcome!

> **NOTE**: if you should be on the list of contributors but we forgot you, don't be shy and let us
> know!

# FAQ

## Is my profile static or dynamic?

For now it's static and the data<sup>[2](#footnote2)</sup> is refreshed at least
[once per day](https://github.com/ghuser-io/db/tree/master/fetchBot). If you scroll down to the
bottom of your profile you can see how old the data is:

> ![screenshot](docs/screenshot-data-age.png)

<a name="footnote2"><sup>2</sup></a> All the data about you and your contributions.

## Some of my repos are not showing up on my profile, why?

Did you give them a star? We don't display repos with no stars at all. We think that if even you
haven't given them a star, then you probably aren't proud of them (yet).

## Does ghuser.io intend to compete with the default GitHub profiles?

No, in fact we'd love GitHub to copy ghuser.io or to even do better, so that this project can die.

## How are the organizations sorted in the `Contributed to` section?

For now it's kind of random. See
[#142](https://github.com/ghuser-io/ghuser.io/issues/142#issuecomment-419743403) for more
details.
