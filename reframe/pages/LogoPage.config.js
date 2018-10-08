import BigLogo from '../views/BigLogo';

const LogoPage = {
  route: '/logo',
  view: BigLogo,
  renderHtmlAtBuildTime: true
  doNotRenderInBrowser: true
};

export default LogoPage;
