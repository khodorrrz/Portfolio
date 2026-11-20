import { test, expect } from '@playwright/test';

const base = process.env.BASE_URL || 'http://localhost:8080';

test('RAG lab is a step-through with no autoplay packet', async ({ page }) => {
  await page.goto(`${base}/index.html#lab`);
  await expect(page.locator('[data-step]')).toHaveCount(4);
  await expect(page.locator('.packet, animateMotion')).toHaveCount(0);
  await expect(page.locator('[data-step="0"]')).toHaveAttribute('aria-current', 'step');

  await page.locator('[data-step="3"]').click();
  await expect(page.locator('.trace')).toHaveAttribute('data-active', '3');
  await expect(page.locator('[data-step="3"]')).toHaveAttribute('aria-current', 'step');
  await expect(page.locator('#status')).toContainText('30 days to return an order');
  await expect(page.locator('[data-step][aria-current="step"]')).toHaveCount(1);
});

test('LiveSyncher advances only on click', async ({ page }) => {
  await page.goto(`${base}/coderaas.html`);
  const next = page.locator('#sync-next');
  await expect(next).toHaveText('Receive event');
  await expect(page.locator('#sync-send, #sync-replay, #sync-reset')).toHaveCount(0);

  await next.click();
  await expect(page.locator('#sync-stage')).toHaveText('Staged');
  await expect(page.locator('#sync-price')).toHaveText('$2.50');
  await expect(next).toHaveText('Apply locally');

  await next.click();
  await expect(page.locator('#sync-stage')).toHaveText('Applied');
  await expect(page.locator('#sync-price')).toHaveText('$2.75');
  await expect(next).toHaveText('Acknowledge');

  await next.click();
  await expect(page.locator('#sync-stage')).toHaveText('Acknowledged');
  await expect(next).toHaveText('Start over');

  await next.click();
  await expect(page.locator('#sync-stage')).toHaveText('Idle');
  await expect(page.locator('#sync-price')).toHaveText('$2.50');
});

test('Case exhibit tabs switch without decorative animation', async ({ page }) => {
  await page.goto(`${base}/rag.html`);
  await page.locator('[aria-controls="rag-view-1"]').click();
  await expect(page.locator('#rag-view-1')).toBeVisible();
  await expect(page.locator('#rag-view-0')).toBeHidden();
  await expect(page.locator('[aria-controls="rag-view-1"]')).toHaveAttribute('aria-pressed', 'true');
  const animation = await page.locator('#rag-view-1 .case-frame > *').first().evaluate(
    (el) => getComputedStyle(el).animationName,
  );
  expect(animation).toBe('none');
});

test('Security fixtures and checkpoints update', async ({ page }) => {
  await page.goto(`${base}/security.html`);
  await page.locator('[data-scenario="receipt"]').click();
  await expect(page.locator('#security-route')).toHaveText('GET /receipts/:id');
  await expect(page.locator('#security-status')).toContainText('Receipt route');

  await page.locator('[data-checkpoint]').nth(5).click();
  await expect(page.locator('#security-counter')).toHaveText('06 / 06');
  await expect(page.locator('.security-chapter').nth(5)).toHaveAttribute('data-active', '');
});

test('ASL pause swaps the animation for its poster', async ({ page }) => {
  await page.goto(`${base}/asl.html`);
  const image = page.locator('#asl-view-0 img');
  await page.locator('.asl-artifact').scrollIntoViewIfNeeded();
  await expect(page.locator('.loop-motion')).toBeVisible();
  await expect(image).toHaveAttribute('src', /asl-alphabet-anim\.webp$/);

  await page.locator('.loop-motion').click();
  await expect(page.locator('.loop-motion')).toHaveText('Play animation');
  await expect(image).toHaveAttribute('src', /asl-alphabet\.webp$/);

  await page.locator('.loop-motion').click();
  await expect(page.locator('.loop-motion')).toHaveText('Pause animation');
  await expect(image).toHaveAttribute('src', /asl-alphabet-anim\.webp$/);
});
