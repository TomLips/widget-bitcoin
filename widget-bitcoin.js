// Widget Previsión Bitcoin Intradía - Embebible vía CDN (sin DIV, aparece fijo en la esquina inferior derecha)

(function () {
  // ---- CONFIGURACIÓN ----
  const API_KEY = '47736816e45f47a7ae3c3676e68e662c';
  const SYMBOL = 'USD/CAD';
  const UPDATE_INTERVAL_MS = 60000; // 1 minuto
  const WIDGET_ID = 'widget-bitcoin-intradia';
  const STYLE_ID = 'widget-bitcoin-intradia-style';

  // ---- CSS ----
  const css = `
    #${WIDGET_ID} {
      position: fixed;
      bottom: 28px;
      right: 28px;
      z-index: 99999;
      max-width: 400px;
      min-width: 285px;
      background: #fff;
      border-radius: 16px;
      box-shadow: 0 12px 32px rgba(0,0,0,0.12);
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      padding: 18px 18px 10px 18px;
      border: 1.5px solid #e0e0e0;
      transition: box-shadow 0.2s;
    }
    #${WIDGET_ID}:hover {
      box-shadow: 0 16px 40px rgba(0,0,0,0.17);
    }
    #${WIDGET_ID} .header-line {
      text-align: center;
      font-weight: 600;
      margin: 2px 0 6px 0;
      font-size: 1em;
    }
    #${WIDGET_ID} .indicator-name {
      color: #222;
      font-size: 0.99em;
      letter-spacing: 0.09em;
      text-transform: uppercase;
      font-weight: 700;
      border-bottom: 2px solid #e0e0e0;
      padding-bottom: 3px;
      margin: 5px 0 8px 0;
    }
    #${WIDGET_ID} h1 {
      color: #000;
      font-size: 1.3em;
      font-weight: 900;
      margin: 0 0 10px 0;
      letter-spacing: -0.02em;
      font-family: 'Montserrat', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      text-align: center;
    }
    #${WIDGET_ID} .forecast-box {
      background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
      border-radius: 12px;
      padding: 16px 10px 12px 10px;
      margin-bottom: 8px;
      box-shadow: 0 3px 10px rgba(0,0,0,0.06);
      border: 1.5px solid #dee2e6;
      position: relative;
      overflow: hidden;
    }
    #${WIDGET_ID} .forecast-box::before {
      content: '';
      position: absolute;
      top: 0; left: 0; right: 0; height: 3px;
      background: linear-gradient(90deg, #667eea, #764ba2);
    }
    #${WIDGET_ID} .probability-display {
      text-align: center;
      margin: 5px 0 2px 0;
    }
    #${WIDGET_ID} .probability-number {
      font-size: 2.1em;
      font-weight: 900;
      color: #222;
      text-shadow: 1px 1px 2px rgba(40,167,69,0.13);
      display: inline-block;
      margin: 6px 0 2px 0;
      animation: pulse-green 2s infinite;
    }
    #${WIDGET_ID} .probability-number.positive { color: #28a745; }
    #${WIDGET_ID} .probability-number.negative { color: #dc3545; }
    @keyframes pulse-green {
      0% { transform: scale(1); }
      50% { transform: scale(1.05); }
      100% { transform: scale(1); }
    }
    #${WIDGET_ID} .forecast-text {
      font-size: 0.97em;
      line-height: 1.56;
      color: #495057;
      text-align: justify;
      padding: 10px;
      background: rgba(255, 255, 255, 0.7);
      border-radius: 8px;
      border-left: 4px solid #667eea;
      margin: 8px 0 0 0;
      min-height: 50px;
    }
    #${WIDGET_ID} .disclaimer-block {
      margin-top: 10px;
      text-align: center;
    }
    #${WIDGET_ID} .disclaimer-warning {
      font-size: 0.98em;
      color: #d35400;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 6px;
      margin-bottom: 3px;
      font-style: italic;
    }
    #${WIDGET_ID} .disclaimer-text {
      font-size: 0.91em;
      color: #888;
      font-style: italic;
      margin-bottom: 7px;
    }
    #${WIDGET_ID} .authors {
      margin-top: 2px;
      font-size: 0.95em;
      color: #333;
      font-style: normal;
      text-align: center;
      letter-spacing: 0.3px;
      margin-bottom: 3px;
    }
    #${WIDGET_ID} .authors a {
      color: #0072c6;
      text-decoration: none;
      font-weight: 500;
      transition: color 0.2s;
    }
    #${WIDGET_ID} .authors a:hover {
      color: #28a745;
      text-decoration: underline;
    }
    #${WIDGET_ID} .update-info {
      margin-top: 7px;
      font-size: 0.98em;
      color: #444;
      text-align: center;
      background: #f4f4f4;
      border-radius: 6px;
      padding: 7px 10px;
      font-style: normal;
      border-left: 3px solid #764ba2;
      border-right: 3px solid #764ba2;
      margin-bottom: 0;
      font-weight: bold;
    }
    #${WIDGET_ID} .close-btn {
      position: absolute;
      top: 8px; right: 10px;
      color: #aaa;
      background: none;
      border: none;
      font-size: 1.3em;
      cursor: pointer;
      transition: color 0.2s;
      z-index: 1;
      padding: 0;
    }
    #${WIDGET_ID} .close-btn:hover { color: #dc3545; }
    @media (max-width: 600px) {
      #${WIDGET_ID} { right: 2vw; bottom: 2vw; min-width: 90vw; max-width: 98vw; }
      #${WIDGET_ID} .forecast-text { font-size: 0.92em; }
      #${WIDGET_ID} h1 { font-size: 1.08em; }
    }
  `;

  // ---- CSS Injection ----
  function injectCSS() {
    if (document.getElementById(STYLE_ID)) return;
    const style = document.createElement('style');
    style.id = STYLE_ID;
    style.innerHTML = css;
    document.head.appendChild(style);
  }

  // ---- Widget HTML ----
  function makeWidgetHTML() {
    return `
      <button class="close-btn" title="Cerrar widget" aria-label="Cerrar widget">&times;</button>
      <div class="header-line update-time" id="${WIDGET_ID}-updateLine">Actualizado a --:--</div>
      <div class="header-line indicator-name">IA-TREND-BITCOIN</div>
      <h1>Previsión Bitcoin Intradía</h1>
      <div class="forecast-box">
        <div class="probability-display">
          <div class="probability-number" id="${WIDGET_ID}-probabilityNumber">--%</div>
        </div>
        <div class="forecast-text" id="${WIDGET_ID}-forecastText">
          Cargando análisis...
        </div>
        <div class="disclaimer-block">
          <div class="disclaimer-warning">
            <span style="font-size: 1.1em;">⚠️</span>
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

  // ---- Utils ----
  function pad(n) { return n < 10 ? '0' + n : n; }
  // Hora española (CET/CEST)
  function getSpanishTime(date = new Date()) {
    const utc = date.getTime() + (date.getTimezoneOffset() * 60000);
    const madridOffset = 2 * 60 * 60000;
    const madridTime = new Date(utc + madridOffset);
    return madridTime;
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
    const day = now.getDay(); // 0=Dom, 1=Lun, ..., 5=Vie, 6=Sáb
    const hour = now.getHours();
    const minute = now.getMinutes();
    if (day === 0) return false; // Domingo
    if (day === 6) return false; // Sábado
    if (day === 1 && (hour === 0 && minute < 1)) return false; // Lunes antes de 00:01
    if (day === 5 && (hour === 23 && minute > 59)) return false; // Viernes después de 23:59
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

  function updateTimes(isActive, prefix = '') {
    const now = getNowTime();
    const next = getNextUpdateTime();
    document.getElementById(`${WIDGET_ID}-updateLine`).textContent =
      `Actualizado a ${now}`;
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

  // ---- Crear Widget ----
  function createWidget() {
    // Evita duplicados
    if (document.getElementById(WIDGET_ID)) return;
    injectCSS();
    const widget = document.createElement('div');
    widget.id = WIDGET_ID;
    widget.innerHTML = makeWidgetHTML();
    document.body.appendChild(widget);

    // Botón cerrar
    widget.querySelector('.close-btn').onclick = function () {
      widget.style.display = 'none';
    };

    // Inicia actualización
    updateWidget();
    setInterval(updateWidget, UPDATE_INTERVAL_MS);
  }

  // ---- Esperar DOM listo ----
  if (document.readyState === 'complete' || document.readyState === 'interactive') {
    setTimeout(createWidget, 1);
  } else {
    document.addEventListener('DOMContentLoaded', createWidget);
  }
})();