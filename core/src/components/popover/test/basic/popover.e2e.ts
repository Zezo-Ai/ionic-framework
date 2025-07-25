import { expect } from '@playwright/test';
import { configs, test } from '@utils/test/playwright';

import { PopoverFixture } from '../fixture';

configs().forEach(({ title, screenshot, config }) => {
  test.describe(title('popover: rendering'), async () => {
    test('should not have visual regressions', async ({ page }) => {
      const popoverFixture = new PopoverFixture(page);

      await popoverFixture.goto(`src/components/popover/test/basic`, config);
      await popoverFixture.open('#basic-popover');
      await popoverFixture.screenshot('basic-basic-popover', screenshot);
    });
  });
});

/**
 * This behavior does not vary across directions.
 */
configs({ directions: ['ltr'] }).forEach(({ title, screenshot, config }) => {
  test.describe(title('popover: rendering variants'), async () => {
    let popoverFixture!: PopoverFixture;
    test.beforeEach(async ({ page }) => {
      popoverFixture = new PopoverFixture(page);
      await popoverFixture.goto(`src/components/popover/test/basic`, config);
    });
    test('should render long list popover', async () => {
      await popoverFixture.open('#long-list-popover');
      await popoverFixture.screenshot('basic-long-list-popover', screenshot);
    });
    // TODO(FW-6588): Remove skip once the flaky test is fixed
    test.skip('should render no event popover', async () => {
      await popoverFixture.open('#no-event-popover');
      await popoverFixture.screenshot('basic-no-event-popover', screenshot);
    });
    test('should render custom class popover', async () => {
      await popoverFixture.open('#custom-class-popover');
      await popoverFixture.screenshot('basic-custom-class-popover', screenshot);
    });
    test('should render header popover', async () => {
      await popoverFixture.open('#header-popover');
      await popoverFixture.screenshot('basic-header-popover', screenshot);
    });
  });
});

/**
 * Translucent popovers are only available on iOS
 */
configs({ modes: ['ios'], directions: ['ltr'] }).forEach(({ title, screenshot, config }) => {
  test.describe(title('popover: scrolling'), async () => {
    test.beforeEach(({ skip }) => {
      test.info().annotations.push({
        type: 'issue',
        description: 'https://github.com/ionic-team/ionic-framework/issues/29211',
      });
      // We are testing if Ionic sets overflow is set correctly on elements,
      // so we do not need to test across browsers
      skip.browser('webkit', 'Behavior does not vary across browsers');
      skip.browser('firefox', 'Behavior does not vary across browsers');
    });
    test('should scroll to bottom without IonContent', async ({ page }) => {
      await page.setContent(
        `
        <style>
          ion-popover {
            --height: 150px;
          }
        </style>
        <ion-popover>
          <p>Text</p>
          <p>Text</p>
          <p>Text</p>
          <p>Text</p>
          <p>Text</p>
          <p>Text</p>
          <p>Text</p>
          <p>Text</p>
          <p>Text</p>
          <p>Text</p>
        </ion-popover>
      `,
        config
      );

      const popover = page.locator('ion-popover');
      const viewport = popover.locator('.popover-viewport');
      const p = popover.locator('p');
      const lastP = await p.last();

      await popover.evaluate((el: HTMLIonPopoverElement) => el.present());

      await expect(lastP).not.toBeInViewport();

      // hover over viewport and scroll to bottom
      await viewport.hover();
      await page.mouse.wheel(0, 500);

      await expect(lastP).toBeInViewport();
    });
    test('should scroll to bottom with IonContent', async ({ page }) => {
      await page.setContent(
        `
        <style>
          ion-popover {
            --height: 150px;
          }
        </style>
        <ion-popover>
          <ion-content>
            <p>Text</p>
            <p>Text</p>
            <p>Text</p>
            <p>Text</p>
            <p>Text</p>
            <p>Text</p>
            <p>Text</p>
            <p>Text</p>
            <p>Text</p>
            <p>Text</p>
          </ion-content>
        </ion-popover>
      `,
        config
      );

      const popover = page.locator('ion-popover');
      const content = popover.locator('ion-content');
      const p = popover.locator('p');
      const lastP = await p.last();

      await popover.evaluate((el: HTMLIonPopoverElement) => el.present());

      await expect(lastP).not.toBeInViewport();

      // hover over viewport and scroll to bottom
      await content.hover();
      await page.mouse.wheel(0, 500);

      await expect(lastP).toBeInViewport();
    });
  });
  test.describe(title('popover: translucent variants'), async () => {
    let popoverFixture!: PopoverFixture;
    test.beforeEach(async ({ page }) => {
      popoverFixture = new PopoverFixture(page);
      await popoverFixture.goto(`src/components/popover/test/basic`, config);
    });
    test('should render translucent popover', async () => {
      await popoverFixture.open('#translucent-popover');
      await popoverFixture.screenshot('basic-translucent-popover', screenshot);
    });
    test('should render translucent header popover', async () => {
      await popoverFixture.open('#translucent-header-popover');
      await popoverFixture.screenshot('basic-translucent-header-popover', screenshot);
    });
  });
});

/**
 * This behavior does not vary across modes/directions.
 */
configs({ modes: ['ios'], directions: ['ltr'] }).forEach(({ title, config }) => {
  test.describe(title('popover: focus trap'), async () => {
    let popoverFixture!: PopoverFixture;
    test.beforeEach(async ({ page }) => {
      popoverFixture = new PopoverFixture(page);
      await popoverFixture.goto('/src/components/popover/test/basic', config);
    });

    test('should focus the first ion-item on ArrowDown', async ({ page }) => {
      const item0 = page.locator('ion-popover ion-item:nth-of-type(1)');

      await popoverFixture.open('#basic-popover');

      await page.keyboard.press('ArrowDown');
      await expect(item0).toBeFocused();
    });

    test('should trap focus', async ({ page, browserName }) => {
      const tabKey = browserName === 'webkit' ? 'Alt+Tab' : 'Tab';
      const items = page.locator('ion-popover ion-item');

      await popoverFixture.open('#basic-popover');

      await page.keyboard.press(tabKey);
      await expect(items.nth(0)).toBeFocused();

      await page.keyboard.press(`Shift+${tabKey}`);
      await expect(items.nth(3)).toBeFocused();

      await page.keyboard.press(tabKey);
      await expect(items.nth(0)).toBeFocused();

      await page.keyboard.press('ArrowDown');
      await expect(items.nth(1)).toBeFocused();

      await page.keyboard.press('ArrowDown');
      await expect(items.nth(2)).toBeFocused();

      await page.keyboard.press('Home');
      await expect(items.nth(0)).toBeFocused();

      await page.keyboard.press('End');
      await expect(items.nth(3)).toBeFocused();
    });

    test('should not override keyboard interactions for textarea elements', async ({ page, browserName }) => {
      const tabKey = browserName === 'webkit' ? 'Alt+Tab' : 'Tab';
      const popover = page.locator('ion-popover');
      const innerNativeTextarea = page.locator('ion-textarea textarea').nth(0);
      const vanillaTextarea = page.locator('ion-textarea + textarea');

      await popoverFixture.open('#popover-with-textarea');

      /**
       * Focusing happens async inside of popover so we need
       * to wait for the requestAnimationFrame to fire.
       */
      await expect(popover).toBeFocused();

      await page.keyboard.press(tabKey);

      // for Firefox, ion-textarea is focused first
      // need to tab again to get to native input
      if (browserName === 'firefox') {
        await page.keyboard.press(tabKey);
      }

      await expect(innerNativeTextarea).toBeFocused();

      await page.keyboard.press('ArrowDown');

      await expect(innerNativeTextarea).toBeFocused();

      await page.keyboard.press('ArrowUp');

      await expect(innerNativeTextarea).toBeFocused();

      await page.keyboard.press(tabKey);
      // Checking within HTML textarea

      await expect(vanillaTextarea).toBeFocused();

      await page.keyboard.press('ArrowDown');

      await expect(vanillaTextarea).toBeFocused();

      await page.keyboard.press('ArrowUp');

      await expect(vanillaTextarea).toBeFocused();

      await page.keyboard.press('Home');

      await expect(vanillaTextarea).toBeFocused();

      await page.keyboard.press('End');

      await expect(vanillaTextarea).toBeFocused();
    });
  });
});
