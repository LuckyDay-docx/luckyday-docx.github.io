document.addEventListener('DOMContentLoaded', () => {
  const root = document.querySelector('[data-kitchen-calculator]');

  if (!root) return;

  const form = root.querySelector('[data-calculator-form]');
  const widthInput = root.querySelector('[data-field="width"]');
  const lengthInput = root.querySelector('[data-field="length"]');

  const resultMin = root.querySelector('[data-result-min]');
  const resultMax = root.querySelector('[data-result-max]');
  const resultSummary = root.querySelector('[data-result-summary]');

  const breakdownBase = root.querySelector('[data-breakdown-base]');
  const breakdownLayout = root.querySelector('[data-breakdown-layout]');
  const breakdownOptions = root.querySelector('[data-breakdown-options]');
  const breakdownInstallation = root.querySelector('[data-breakdown-installation]');
  // форма лида давно переехала на data-lead-form — ищем поле напрямую внутри калькулятора
  const messageField = root.querySelector('[data-message-field]');

  const money = new Intl.NumberFormat('ru-RU');

  const layoutRates = {
    straight: 1,
    corner: 1.08,
    u_shape: 1.18,
  };

  const facadeRates = {
    ldsp: 0.9,
    mdf_pvh: 1.05,
    mdf_emal: 1.28,
  };

  const countertopRates = {
    '26': 0,
    '38': 9000,
    compact12: 26000,
  };

  const hardwareRates = {
    boyard: 0.94,
    boyard_premium: 1,
    blum: 1.16,
  };

  const plumbingRates = {
    none: 0,
    sink: 6500,
    sink_tap: 11500,
  };

  const labels = {
    layout: { straight: 'прямая', corner: 'угловая', u_shape: 'П-образная' },
    facade: { ldsp: 'ЛДСП', mdf_pvh: 'МДФ в плёнке ПВХ', mdf_emal: 'МДФ Эмаль' },
    countertop: { '26': '26 мм (не влагостойкая)', '38': '38 мм (влагостойкая)', compact12: 'компакт-плита 12 мм' },
    hardware: { boyard: 'Китай (Боярд)', boyard_premium: 'Китай (Боярд Премиум)', blum: 'Австрия (Blum)' },
    plumbing: { none: 'без мойки и смесителя', sink: 'мойка', sink_tap: 'мойка + смеситель' },
  };

  const getNumber = (input, fallback) => {
    const value = Number.parseFloat(input?.value ?? '');
    return Number.isFinite(value) ? value : fallback;
  };

  const getValue = (name) => {
    const field = root.querySelector(`[name="${name}"]:checked, [name="${name}"]`);
    if (!field) return '';

    if (field.type === 'checkbox') return field.checked;
    return field.value;
  };

  const formatMoney = (value) => `${money.format(Math.round(value))} ₽`;

  const setMessage = (message) => {
    if (!messageField) return;

    messageField.value = message;
    messageField.dispatchEvent(new Event('input', { bubbles: true }));
  };

  const calculate = () => {
    const width = Math.max(getNumber(widthInput, 3.2), 1);
    const length = Math.max(getNumber(lengthInput, 2.4), 1);
    const area = width * length;

    const layout = getValue('layout') || 'straight';
    const facade = getValue('facade') || 'ldsp';
    const countertop = getValue('countertop') || '26';
    const hardware = getValue('hardware') || 'boyard';
    const plumbing = getValue('plumbing') || 'none';
    const installation = Boolean(getValue('installation'));

    const base = 42000 + area * 14500;
    const baseWithMaterials = base * facadeRates[facade] * hardwareRates[hardware];
    const layoutPrice = baseWithMaterials * layoutRates[layout];
    const optionsPrice = countertopRates[countertop] + plumbingRates[plumbing];
    const installationPrice = installation ? 14000 : 0;

    const total = layoutPrice + optionsPrice + installationPrice;
    const min = total * 0.92;
    const max = total * 1.08;

    if (resultMin) resultMin.textContent = formatMoney(min);
    if (resultMax) resultMax.textContent = formatMoney(max);
    if (resultSummary) {
      resultSummary.textContent = `Площадь ${area.toFixed(1)} м², планировка ${labels.layout[layout]}.`;
    }

    if (breakdownBase) breakdownBase.textContent = formatMoney(base);
    if (breakdownLayout) breakdownLayout.textContent = formatMoney(layoutPrice - baseWithMaterials);
    if (breakdownOptions) breakdownOptions.textContent = formatMoney(optionsPrice);
    if (breakdownInstallation) breakdownInstallation.textContent = formatMoney(installationPrice);

    setMessage(
      `Здравствуйте! Хочу заказать кухню. Размеры: ширина ${width.toFixed(1)} м, длина ${length.toFixed(1)} м. Планировка: ${labels.layout[layout]}. Фасады: ${labels.facade[facade]}. Столешница: ${labels.countertop[countertop]}. Фурнитура: ${labels.hardware[hardware]}. Сантехника: ${labels.plumbing[plumbing]}. Ориентировочная стоимость: от ${money.format(Math.round(min))} ₽ до ${money.format(Math.round(max))} ₽.`
    );
  };

  form?.addEventListener('input', calculate);
  form?.addEventListener('change', calculate);
  form?.addEventListener('reset', () => window.setTimeout(calculate, 0));

  calculate();
});
