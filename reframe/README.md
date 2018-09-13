# Web app

[ghuser.io](https://ghuser.io) is a [Reframe](https://github.com/reframejs/reframe) web app.

## Table of Contents

<!-- toc -->

- [Run locally](#run-locally)
- [How is the code organized](#how-is-the-code-organized)
  * [Pages](#pages)
  * [React components](#react-components)
- [Deploy the app online](#deploy-the-app-online)

<!-- tocstop -->

## Run locally

```bash
/reframe$ cd reframe/
/reframe$ npm install
/reframe$ npm run local
...
 ✔ Server running (for development)
     http://localhost:3000/ -> LandingPage
     http://localhost:3000/:username -> ProfilePage
     http://localhost:3000/logo -> LogoPage
```

You can now open e.g. http://localhost:3000/AurelienLourot in your browser.

## How is the code organized

### Pages

Each page is defined as a [pages/*.config.js](pages/) file. It connects a route/endpoint to a React
component. The most important page [ProfilePage](pages/ProfilePage.config.js) for example connects
any `/:username` URL to the [Profile](views/profile/Profile.js) React component:

```js
const ProfilePage = {
  route: '/:username',
  view: ({route: {args: {username}}}) => <Profile ... />
};
```

### React components

Each React component is defined as a [views/**/*.js](views/) file starting with a capital letter.
Some components also have a special `*.css` stylesheet. The main component of a profile page is
[Profile](views/profile/Profile.js) and is implemented by the
[LeftPanel](views/profile/leftpanel/LeftPanel.js) and
[RightPanel](views/profile/rightpanel/RightPanel.js) components.

> **NOTE**: we're trying to keep ghuser's style as close as possible to GitHub's style.

## Deploy the app online

We run the web app on [AWS Lambda](https://docs.aws.amazon.com/lambda/latest/dg/welcome.html) using
[Up](https://up.docs.apex.sh/). See
[How to deploy a Reframe web app on Up](https://github.com/AurelienLourot/reframe-on-up/).

> **NOTE**: this can only be done by the
> [maintainers](https://github.com/orgs/ghuser-io/people).

The scripts used to set up AWS IAM accordingly can be found [here](../aws/apex-up).
