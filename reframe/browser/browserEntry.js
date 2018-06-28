import browserConfig from '@brillout/browser-config';

import './jquery-global'; // see https://stackoverflow.com/a/39820703/1855917
import './thirdparty/semantic-ui-2.3.2/accordion.min';

initBrowser();

async function initBrowser() {
    await browserConfig.hydratePage();
}
