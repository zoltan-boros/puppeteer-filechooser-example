const { describe, test } = require("@jest/globals");
const puppeteer = require('puppeteer');

const headlessViewport = {
  width: 1440,
  height: 1080,
};

let browser;
let page;

describe.each([ 'headful', 'headless' ])('Using %s browser', (head) => {

  beforeEach(async () => {
    const headless = head === 'headless';
    browser = await puppeteer.launch({
      headless,
      timeout: 8000,
      defaultViewport: headless ? headlessViewport : null,
    });
    page = (await browser.pages())[0];
  });

  afterEach(async () => {
    await browser.close();
  });

  test('Should be able to specify path using File Chooser, download should succeed.', async () => {

    await page.goto('https://github.com/puppeteer/puppeteer/releases');

    const [ fileChooser ] = await Promise.all([
      page.waitForFileChooser(),

      // Click immediately
      page.click('a[href="/puppeteer/puppeteer/archive/refs/tags/v10.0.0.zip"]'),

      // Click delayed
      // new Promise(resolve => {
      //   setTimeout(
      //     () => { return resolve(page.click('a[href="/puppeteer/puppeteer/archive/refs/tags/v10.0.0.zip"]')); },
      //     2000,
      //   );
      // }),
    ]);

    await fileChooser.accept([`${process.env.USERPROFILE}/pptr.zip`]);
  });
});
