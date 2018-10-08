import browserConfig from '@brillout/browser-config';

import './jquery-global'; // see https://stackoverflow.com/a/39820703/1855917
import './thirdparty/semantic-ui-2.3.2/accordion.min';
import './thirdparty/semantic-ui-2.3.2/progress.min';

initBrowser();

async function initBrowser() {
    // Include pre-init code here

    // Plugins can add init functions
    // For example:
    //  - page hydration (i.e. rendering of the page to the DOM)
    //  - user tracking initialization
    for(const initFunction of Object.values(browserConfig.initFunctions)) {
        await initFunction();
    }

    // Include post-init code here
}
