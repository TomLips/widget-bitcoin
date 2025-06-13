(function () {
  // CONFIGURACIÓN
  const API_KEY = '47736816e45f47a7ae3c3676e68e662c';
  const SYMBOL = 'USD/CAD';
  const UPDATE_INTERVAL_MS = 60000;
  const WIDGET_ID = 'widget-bitcoin';
  const STYLE_ID = 'widget-bitcoin-style';

  // CSS
  const css = `
    #${WIDGET_ID} {
      max-width: 700px;
      margin: 20px auto;
      background: rgba(255, 255, 255, 0.98);
      border-radius: 20px;
      padding: 30px;
      box-shadow: 0 12px 32px rgba(0,0,0,0.08);
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      color: #111;
    }
    .header-line {text-align: center;font-weight: 600;margin: 4px 0;}
    .indicator-name {color: #222;font-size: 1.13em;letter-spacing: 0.1em;text-transform: uppercase;font-weight: 700;border-bottom: 2px solid #e0e0e0;padding-bottom: 6px;margin: 10px 0 14px 0;}
    h1 {color: #000;font-size: 2.2em;font-weight: 900;margin: 0 0 24px 0;letter-spacing: -0.02em;font-family: 'Montserrat', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;text-align: center;}
    .forecast-box {background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);border-radius: 16px;padding: 30px;margin-bottom: 18px;box-shadow: 0 6px 20px rgba(0,0,0,0.07);border: 2px solid #dee2e6;position: relative;overflow: hidden;}
    .forecast-box::before {content: '';position: absolute;top: 0; left: 0; right: 0; height: 4px;background: linear-gradient(90deg, #667eea, #764ba2);}
    .probability-display {text-align: center;margin: 20px 0 10px 0;}
    .probability-number {font-size: 3em;font-weight: 900;color: #222;text-shadow: 2px 2px 4px rgba(40,167,69,0.18);display: inline-block;margin: 10px 0;animation: pulse-green 2s infinite;}
    .probability-number.positive { color: #28a745; }
    .probability-number.negative { color: #dc3545; }
    @keyframes pulse-green {0% { transform: scale(1); }50% { transform: scale(1.05); }100% { transform: scale(1); }}
    .forecast-text {font-size: 1.14em;line-height: 1.8;color: #495057;text-align: justify;padding: 18px;background: rgba(255, 255, 255, 0.7);border-radius: 12px;border-left: 5px solid #667eea;margin: 12px 0 0 0;min-height: 120px;}
    .disclaimer-block {margin-top: 24px;text-align: center;}
    .disclaimer-warning {font-size: 1em;color: #d35400;display: flex;align-items: center;justify-content: center;gap: 8px;margin-bottom: 4px;font-style: italic;}
    .disclaimer-text {font-size: 0.98em;color: #888;font-style: italic;margin-bottom: 10px;}
    .authors {margin-top: 2px;font-size: 1em;color: #333;font-style: normal;text-align: center;letter-spacing: 0.5px;margin-bottom: 4px;}
    .authors a {color: #0072c6;text-decoration: none;font-weight: 500;transition: color 0.2s;}
    .authors a:hover {color: #28a745;text-decoration: underline;}
    .update-info {margin-top: 12px;font-size: 1.08em;color: #444;text-align: center;background: #f4f4f4;border-radius: 8px;padding: 10px 18px;font-style: normal;border-left: 4px solid #764ba2;border-right: 4px solid #764ba2;margin-bottom: 0;font-weight: bold;}
    @media (max-width: 768px) {h1 { font-size: 1.3em; }.probability-number { font-size: 2.1em; }.forecast-text { font-size: 1em; }#${WIDGET_ID} { padding: 10px; }}
  `;

  function injectCSS() {
    if (document.getElementById(STYLE_ID)) return;
    const style = document.createElement('style');
    style.id = STYLE_ID;
    style.innerHTML = css;
    document.head.appendChild(style);
  }

  function makeWidgetHTML() {
    return `
      <div class="header-line update-time" id="${WIDGET_ID}-updateLine">Actualizado a --:-- | Actualiza cada 1 minuto</div>
      <div class="header-line indicator-name">IA-TREND-BITCOIN</div>
      <h1>Previsión de tendencia de Bitcoin en Intradía</h1>
      <div class="forecast-box">
        <div class="probability-display">
          <div class="probability-number" id="${WIDGET_ID}-probabilityNumber">--%</div>
        </div>
        <div class="forecast-text" id="${WIDGET_ID}-forecastText">
          Cargando análisis...
        </div>
        <div class="disclaimer-block">
          <div class="disclaimer-warning">
            <span style="font-size: 1.3em;">⚠️</span>
            <span>Advertencia (descargo de responsabilidad):</span>
          </div>
          <div class="disclaimer-text">
            Este indicador no es ninguna recomendación para trading ni para inversión, tan sólo es educativo.
          </div>
          <div class="authors">
            Autores: Tom Lips (<a href="https://x.com/mercadounico" rel="noopener noreferrer" target="_blank">@mercadounico</a>)
            &nbsp;|&nbsp;
            VipTrader (<a href="https://x.com/SUMAZERO1" rel="noopener noreferrer" target="_blank">@SUMAZERO1</a>)
          </div>
          <div class="update-info" id="${WIDGET_ID}-nextUpdateText">
            Actualiza cada 1 minuto. Próxima actualización: --:--
          </div>
        </div>
      </div>
    `;
  }

  function pad(n) { return n < 10 ? '0' + n : n; }
  function getSpanishTime(date = new Date()) {
    const utc = date.getTime() + (date.getTimezoneOffset() * 60000);
    const madridOffset = 2 * 60 * 60000;
    return new Date(utc + madridOffset);
  }
  function getNowTime() {
    const now = getSpanishTime();
    return pad(now.getHours()) + ':' + pad(now.getMinutes());
  }
  function getNextUpdateTime() {
    const now = getSpanishTime();
    now.setMinutes(now.getMinutes() + 1);
    return pad(now.getHours()) + ':' + pad(now.getMinutes());
  }
  function isForexActive() {
    const now = getSpanishTime();
    const day = now.getDay();
    const hour = now.getHours();
    const minute = now.getMinutes();
    if (day === 0) return false;
    if (day === 6) return false;
    if (day === 1 && (hour === 0 && minute < 1)) return false;
    if (day === 5 && (hour === 23 && minute > 59)) return false;
    return true;
  }
  function getForecastComment(percent) {
    let abs = Math.abs(percent);
    let colorClass = percent > 0 ? 'positive' : 'negative';
    if (percent > 0) {
      if (abs > 0.40) {
        return {
          text: `Según valor actual en estos instantes, <strong>la presión compradora es fuerte</strong> para Bitcoin, con una probabilidad de <strong style="color: #28a745;">+${percent.toFixed(2)}%</strong>. Se esperan avances claros y un predominio del impulso alcista durante la jornada.`,
          colorClass
        };
      } else if (abs > 0.20) {
        return {
          text: `Según valor actual en estos instantes, <strong>la presión compradora es moderada</strong> para Bitcoin, con una probabilidad de <strong style="color: #28a745;">+${percent.toFixed(2)}%</strong>. Se esperan avances graduales o consolidación durante la jornada.`,
          colorClass
        };
      } else {
        return {
          text: `Según valor actual en estos instantes, <strong>la presión compradora es leve</strong> para Bitcoin, con una probabilidad de <strong style="color: #28a745;">+${percent.toFixed(2)}%</strong>. El impulso alcista es limitado, se esperan avances moderados o consolidación.`,
          colorClass
        };
      }
    } else if (percent < 0) {
      if (abs > 0.40) {
        return {
          text: `Según valor actual en estos instantes, <strong>la presión vendedora es fuerte</strong> para Bitcoin, con una probabilidad de <strong style="color: #dc3545;">${percent.toFixed(2)}%</strong>. Se esperan caídas claras y predominio bajista durante la jornada.`,
          colorClass
        };
      } else if (abs > 0.20) {
        return {
          text: `Según valor actual en estos instantes, <strong>la presión vendedora es moderada</strong> para Bitcoin, con una probabilidad de <strong style="color: #dc3545;">${percent.toFixed(2)}%</strong>. Se esperan caídas suaves o consolidación durante la jornada.`,
          colorClass
        };
      } else {
        return {
          text: `Según valor actual en estos instantes, <strong>la presión vendedora es leve</strong> para Bitcoin, con una probabilidad de <strong style="color: #dc3545;">${percent.toFixed(2)}%</strong>. Se esperan caídas suaves o consolidación durante la jornada.`,
          colorClass
        };
      }
    } else {
      return {
        text: `Según valor actual, <strong>no se detecta presión relevante</strong> para Bitcoin, con una probabilidad de <strong>0.00%</strong>. Predomina la neutralidad.`,
        colorClass: ''
      };
    }
  }
  async function fetchPercentFromDailyClose() {
    const url = `https://api.twelvedata.com/time_series?symbol=${SYMBOL}&interval=1day&outputsize=2&apikey=${API_KEY}`;
    const urlCurrent = `https://api.twelvedata.com/price?symbol=${SYMBOL}&apikey=${API_KEY}`;
    try {
      const res = await fetch(url);
      const data = await res.json();
      if (!data || !data.values || data.values.length < 2) throw new Error('No daily close');
      const lastClose = parseFloat(data.values[1].close);
      const resCurrent = await fetch(urlCurrent);
      const dataCurrent = await resCurrent.json();
      if (!dataCurrent || !dataCurrent.price) throw new Error('No current price');
      const currentPrice = parseFloat(dataCurrent.price);
      const percent = ((currentPrice - lastClose) / lastClose) * 100;
      return percent;
    } catch (e) {
      return null;
    }
  }
  function updateTimes(isActive) {
    const now = getNowTime();
    const next = getNextUpdateTime();
    document.getElementById(`${WIDGET_ID}-updateLine`).textContent =
      `Actualizado a ${now} | Actualiza cada 1 minuto`;
    if (isActive) {
      document.getElementById(`${WIDGET_ID}-nextUpdateText`).textContent =
        `Actualiza cada 1 minuto. Próxima actualización: ${next}`;
    } else {
      document.getElementById(`${WIDGET_ID}-nextUpdateText`).textContent =
        `No activo. El indicador volverá a estar operativo el lunes a las 00:01 hora española.`;
    }
  }
  async function updateWidget() {
    const isActive = isForexActive();
    updateTimes(isActive);
    const probElem = document.getElementById(`${WIDGET_ID}-probabilityNumber`);
    const textElem = document.getElementById(`${WIDGET_ID}-forecastText`);
    if (!isActive) {
      probElem.textContent = '--%';
      probElem.className = 'probability-number';
      textElem.innerHTML = 'El mercado Forex está cerrado los fines de semana.<br>El indicador volverá a actualizarse el lunes a las 00:01 hora española.';
      return;
    }
    const percent = await fetchPercentFromDailyClose();
    if (percent === null) {
      probElem.textContent = '--%';
      probElem.className = 'probability-number';
      textElem.innerHTML = 'No se pudo obtener el dato de cierre. Reintentando...';
      return;
    }
    const sign = percent > 0 ? '+' : '';
    probElem.textContent = `${sign}${percent.toFixed(2)}%`;
    const { text, colorClass } = getForecastComment(percent);
    probElem.className = `probability-number ${colorClass}`;
    textElem.innerHTML = text;
  }

  function createWidget() {
    injectCSS();
    // Busca el div id="widget-bitcoin"
    var cont = document.getElementById(WIDGET_ID);
    if (!cont) return;
    cont.innerHTML = makeWidgetHTML();
    updateWidget();
    setInterval(updateWidget, UPDATE_INTERVAL_MS);
  }

  if (document.readyState === 'complete' || document.readyState === 'interactive') {
    setTimeout(createWidget, 1);
  } else {
    document.addEventListener('DOMContentLoaded', createWidget);
  }
})();
