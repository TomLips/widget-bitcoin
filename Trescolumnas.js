// Bitcoin Indicators Dashboard - Complete JavaScript Version
// Desarrollado por: Tom Lips & VipTrader

class BitcoinDashboard {
    constructor() {
        this.btcATH = 111814.00; // ATH fijo del 22 mayo
        this.updateInterval = 35 * 60 * 1000; // 35 minutos
        this.init();
    }

    // Crear los estilos CSS
    createStyles() {
        const styles = `
            body {
                font-family: 'Arial', sans-serif;
                margin: 0;
                padding: 20px;
                background-color: #f0f0f0;
                display: flex;
                justify-content: center;
                align-items: center;
                min-height: 100vh;
                color: #333;
            }
            .container {
                display: flex;
                justify-content: center;
                max-width: 617px;
                width: 100%;
                margin: 0 auto;
            }
            .chart {
                text-align: center;
                padding: 0;
                margin: 0 1px;
                flex: 1;
                min-width: 45px;
                position: relative;
            }
            .chart-label {
                font-size: 1.1rem;
                margin-bottom: 5px;
                position: relative;
                font-weight: 500;
            }
            .chart-label::after {
                content: '';
                position: absolute;
                bottom: -3px;
                left: 0;
                width: 100%;
                height: 1px;
                background-color: #bbb;
            }
            .bar-container {
                height: 280px;
                position: relative;
                border-left: 1px solid #bbb;
                border-bottom: 1px solid #bbb;
                width: 100%;
                display: flex;
                justify-content: center;
            }
            .bar {
                position: absolute;
                bottom: 0;
                width: 30%;
                left: 50%;
                transform: translateX(-50%);
                background-color: #00cc00;
                transition: height 0.5s ease;
                border-radius: 3px;
            }
            .bar.blue {
                background-color: #0066cc;
            }
            .y-axis {
                position: absolute;
                left: 0;
                width: 60px;
                text-align: left;
                font-size: 0.8rem;
                top: 0;
                height: 100%;
            }
            .y-axis span {
                display: block;
                height: 56px;
                line-height: 56px;
                white-space: nowrap;
            }
            .value {
                display: none;
            }
            .info {
                margin-top: 5px;
                font-size: 0.75rem;
                color: #555;
                white-space: nowrap;
            }
            .summary {
                margin-top: 15px;
                padding: 12px;
                background-color: #ffffff;
                border: 1px solid #ddd;
                border-radius: 6px;
                text-align: left;
                font-size: 0.9rem;
                box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
            }
            .update-info {
                margin-top: 10px;
                font-size: 0.8rem;
                text-align: center;
                color: #666;
            }
            .disclaimer {
                margin-top: 10px;
                padding: 10px;
                background-color: #fff3e6;
                border: 1px solid #ffcc99;
                border-radius: 6px;
                font-size: 0.8rem;
                text-align: center;
                color: #744700;
            }
            .viptrend-info {
                margin-top: 10px;
                padding: 10px;
                background-color: #000;
                border: 1px solid #333;
                border-radius: 6px;
                font-size: 0.8rem;
                text-align: center;
                color: #fff;
                font-weight: normal;
            }
            .viptrend-info h3 {
                margin: 0 0 5px 0;
                font-size: 0.9rem;
                font-weight: 500;
                color: #ddd;
            }
            .authors {
                margin-top: 15px;
                padding: 10px;
                background-color: #e6f3ff;
                border: 1px solid #99ccff;
                border-radius: 6px;
                font-size: 0.8rem;
                text-align: center;
                color: #004d99;
            }
            @media (max-width: 600px) {
                .container {
                    flex-wrap: nowrap;
                    overflow-x: auto;
                }
                .chart {
                    min-width: 35px;
                }
                .bar-container {
                    min-width: 35px;
                }
                .bar {
                    width: 40%;
                }
                .y-axis {
                    width: 50px;
                    font-size: 0.7rem;
                }
                .chart-label {
                    font-size: 0.9rem;
                }
                .info {
                    font-size: 0.7rem;
                }
            }
        `;

        const styleSheet = document.createElement('style');
        styleSheet.textContent = styles;
        document.head.appendChild(styleSheet);
    }

    // Crear la estructura HTML
    createHTML() {
        document.title = 'Indicadores de Bitcoin y Bitcoin Cash';
        
        // Configurar el viewport
        const viewport = document.createElement('meta');
        viewport.name = 'viewport';
        viewport.content = 'width=device-width, initial-scale=1.0';
        document.head.appendChild(viewport);

        // Configurar charset
        const charset = document.createElement('meta');
        charset.setAttribute('charset', 'UTF-8');
        document.head.appendChild(charset);

        document.body.innerHTML = `
            <div class="container">
                <!-- Gráfico 1: Máximo Histórico (ATH) -->
                <div class="chart">
                    <div class="chart-label">ATH (22 mayo)</div>
                    <div class="bar-container">
                        <div class="y-axis">
                            <span>$120,000</span>
                            <span>$110,000</span>
                            <span>$100,000</span>
                            <span>$90,000</span>
                            <span>$80,000</span>
                        </div>
                        <div class="bar" id="ath-bar" style="height: 0%;"></div>
                        <div class="value" id="ath-value">Cargando...</div>
                    </div>
                    <div class="info" id="ath-price">Máximo Histórico: $${this.btcATH.toFixed(2)}</div>
                </div>

                <!-- Gráfico 2: Precio Actual de Bitcoin -->
                <div class="chart">
                    <div class="chart-label">BTC Hoy</div>
                    <div class="bar-container">
                        <div class="bar blue" id="price-bar" style="height: 0%;"></div>
                    </div>
                    <div class="info" id="btc-price">Precio: Cargando...</div>
                </div>

                <!-- Gráfico 3: PREVISIÓN -->
                <div class="chart">
                    <div class="chart-label">PREVISIÓN</div>
                    <div class="bar-container">
                        <div class="bar" id="combined-bar" style="height: 0%;"></div>
                    </div>
                    <div class="info">Según indicador VipTrend-Bitcoin</div>
                </div>
            </div>

            <!-- Resumen Comentado -->
            <div class="summary" id="summary">Cargando resumen...</div>

            <!-- Información de actualización -->
            <div class="update-info" id="update-info">Cargando información de actualización...</div>

            <!-- Descargo de Responsabilidad -->
            <div class="disclaimer">Descargo de Responsabilidad: Esto es un ejemplo educativo y nunca se tomará para trading ni inversiones</div>

            <!-- Información sobre VipTrend-Bitcoin -->
            <div class="viptrend-info">
                <h3>Sobre VipTrend-Bitcoin</h3>
                Nuestro indicador prevé los posibles movimientos alcistas o bajistas de Bitcoin calculando si se acerca o aleja del actual ATH de Bitcoin
            </div>

            <!-- Autores -->
            <div class="authors">
                Desarrollado por: Tom Lips & VipTrader
            </div>
        `;
    }

    // Función para obtener datos de Bitcoin y Bitcoin Cash
    async obtenerDatosCripto() {
        try {
            // Obtener datos históricos de Bitcoin para estimar YTD (365 días)
            const btcHistoryResponse = await fetch('https://api.coingecko.com/api/v3/coins/bitcoin/market_chart?vs_currency=usd&days=365');
            if (!btcHistoryResponse.ok) throw new Error('Error en API CoinGecko para historial BTC: ' + btcHistoryResponse.statusText);
            const btcHistoryData = await btcHistoryResponse.json();
            console.log('BTC History Data:', btcHistoryData);
            
            const prices = btcHistoryData.prices;
            const startPrice = prices[0][1];
            const currentPrice = prices[prices.length - 1][1];
            const btcYTD = ((currentPrice / startPrice) - 1) * 100;

            // Obtener datos actuales de Bitcoin (precio)
            const btcResponse = await fetch('https://api.coingecko.com/api/v3/coins/bitcoin');
            if (!btcResponse.ok) throw new Error('Error en API CoinGecko para Bitcoin: ' + btcResponse.statusText);
            const btcData = await btcResponse.json();
            console.log('BTC Data:', btcData);
            const btcPrice = btcData.market_data.current_price.usd;

            // Obtener datos de Bitcoin Cash (cambio porcentual 24h)
            const bchResponse = await fetch('https://api.coingecko.com/api/v3/coins/bitcoin-cash');
            if (!bchResponse.ok) throw new Error('Error en API CoinGecko para Bitcoin Cash: ' + bchResponse.statusText);
            const bchData = await bchResponse.json();
            console.log('BCH Data:', bchData);
            const bchChange24h = bchData.market_data.price_change_percentage_24h;

            // Calcular la previsión según la lógica original
            const adjustmentFactor = bchChange24h >= 0 ? 3 : 2;
            const adjustedBchChange = bchChange24h / adjustmentFactor;
            const combinedPrice = btcPrice + (adjustedBchChange / 100 * btcPrice);
            const combinedChange = adjustedBchChange;

            // Escalar las alturas de las barras según la escala ($80,000 a $120,000)
            const maxHeight = 280;
            const range = 40000; // $120,000 - $80,000
            const athBarHeight = Math.min(((this.btcATH - 80000) / range) * 100, 100);
            const priceBarHeight = Math.min(((btcPrice - 80000) / range) * 100, 100);
            const combinedBarHeight = Math.min(((combinedPrice - 80000) / range) * 100, 100);

            // Validar valores antes de actualizar
            if (isNaN(btcPrice) || isNaN(this.btcATH) || isNaN(combinedPrice)) {
                throw new Error('Valores inválidos en los datos: btcPrice, btcATH, o combinedPrice no son números.');
            }

            // Actualizar gráficos
            document.getElementById('ath-bar').style.height = `${athBarHeight}%`;
            document.getElementById('ath-value').textContent = `$${this.btcATH.toFixed(2)}`;
            document.getElementById('ath-price').textContent = `Máximo Histórico: $${this.btcATH.toFixed(2)}`;

            document.getElementById('price-bar').style.height = `${priceBarHeight}%`;
            document.getElementById('btc-price').textContent = `Precio: $${btcPrice.toFixed(2)}`;

            document.getElementById('combined-bar').style.height = `${combinedBarHeight}%`;
            document.getElementById('combined-bar').style.backgroundColor = combinedChange >= 0 ? '#00cc00' : '#cc0000';

            // Generar Resumen Comentado dinámico
            let summaryText = '';
            const priceVsATH = (btcPrice / this.btcATH) * 100;
            const isNearATH = priceVsATH > 90;
            const isAboveCurrent = combinedBarHeight > priceBarHeight;

            if (isNearATH) {
                if (isAboveCurrent) {
                    summaryText = 'El precio de Bitcoin está cerca de su máximo histórico (ATH). La previsión sugiere una tendencia al alza, con posibilidad de superar el ATH en el corto plazo.';
                } else {
                    summaryText = 'El precio de Bitcoin está cerca de su máximo histórico (ATH), pero la previsión indica resistencia, sugiriendo un posible retroceso o consolidación en el precio.';
                }
            } else {
                if (isAboveCurrent) {
                    summaryText = 'El precio de Bitcoin está lejos de su máximo histórico (ATH). La previsión muestra una tendencia al alza, indicando un posible acercamiento gradual al ATH.';
                } else {
                    summaryText = 'El precio de Bitcoin está lejos de su máximo histórico (ATH). La previsión sugiere un retroceso adicional en el precio a corto plazo.';
                }
            }

            document.getElementById('summary').textContent = `Resumen Comentado: ${summaryText}`;

            // Calcular y mostrar información de actualización
            const now = new Date();
            const lastUpdate = now.toLocaleTimeString('es-ES', { timeZone: 'CET', hour: '2-digit', minute: '2-digit' }) + ' CEST';
            const nextUpdate = new Date(now.getTime() + this.updateInterval).toLocaleTimeString('es-ES', { timeZone: 'CET', hour: '2-digit', minute: '2-digit' }) + ' CEST';
            document.getElementById('update-info').textContent = `Actualiza cada 35 minutos | Última actualización: ${lastUpdate} | Próxima actualización: ${nextUpdate}`;

            console.log(`BTC Price: $${btcPrice}, BCH Change: ${bchChange24h}%, Adjusted: ${adjustedBchChange}%, Combined Price: $${combinedPrice.toFixed(2)}, Heights: ATH=${athBarHeight}%, BTC=${priceBarHeight}%, Combined=${combinedBarHeight}%`);

        } catch (error) {
            console.error('Error detallado:', error.message);
            document.getElementById('ath-value').textContent = 'Error';
            document.getElementById('ath-price').textContent = 'Máximo Histórico: Error';
            document.getElementById('btc-price').textContent = 'Precio: Error';
            document.getElementById('summary').textContent = `Resumen Comentado: Error al cargar datos - ${error.message}`;
            document.getElementById('update-info').textContent = 'Información de actualización: Error';
        }
    }

    // Inicializar el dashboard
    init() {
        // Esperar a que el DOM esté listo
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                this.createStyles();
                this.createHTML();
                this.obtenerDatosCripto();
                setInterval(() => this.obtenerDatosCripto(), this.updateInterval);
            });
        } else {
            this.createStyles();
            this.createHTML();
            this.obtenerDatosCripto();
            setInterval(() => this.obtenerDatosCripto(), this.updateInterval);
        }
    }
}

// Función para inicializar manualmente si se necesita
function initBitcoinDashboard() {
    return new BitcoinDashboard();
}

// Auto-inicializar cuando se carga el script
if (typeof window !== 'undefined') {
    const dashboard = new BitcoinDashboard();
    
    // Exportar para uso manual si se necesita
    window.BitcoinDashboard = BitcoinDashboard;
    window.initBitcoinDashboard = initBitcoinDashboard;
}

// Para uso en Node.js (opcional)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { BitcoinDashboard, initBitcoinDashboard };
}
