// Función para obtener datos de Bitcoin y Bitcoin Cash
async function obtenerDatosCripto() {
    try {
        // Valor fijo para ATH
        const btcATH = 111814.00;

        // Obtener datos históricos de Bitcoin
        const btcHistoryResponse = await fetch('https://api.coingecko.com/api/v3/coins/bitcoin/market_chart?vs_currency=usd&days=365');
        if (!btcHistoryResponse.ok) throw new Error('Error en API CoinGecko para historial BTC');
        const btcHistoryData = await btcHistoryResponse.json();
        const prices = btcHistoryData.prices;
        const startPrice = prices[0][1];
        const currentPrice = prices[prices.length - 1][1];
        const btcYTD = ((currentPrice / startPrice) - 1) * 100;

        // Obtener precio actual de Bitcoin
        const btcResponse = await fetch('https://api.coingecko.com/api/v3/coins/bitcoin');
        if (!btcResponse.ok) throw new Error('Error en API CoinGecko para Bitcoin');
        const btcData = await btcResponse.json();
        const btcPrice = btcData.market_data.current_price.usd;

        // Obtener datos de Bitcoin Cash
        const bchResponse = await fetch('https://api.coingecko.com/api/v3/coins/bitcoin-cash');
        if (!bchResponse.ok) throw new Error('Error en API CoinGecko para Bitcoin Cash');
        const bchData = await bchResponse.json();
        const bchChange24h = bchData.market_data.price_change_percentage_24h;

        // Calcular previsión
        const adjustmentFactor = bchChange24h >= 0 ? 3 : 2;
        const adjustedBchChange = bchChange24h / adjustmentFactor;
        const combinedPrice = btcPrice + (adjustedBchChange / 100 * btcPrice);
        const combinedChange = adjustedBchChange;

        // Actualizar la interfaz
        document.getElementById('ath-bar').style.height = `${((btcATH - 80000) / 40000) * 100}%`;
        document.getElementById('price-bar').style.height = `${((btcPrice - 80000) / 40000) * 100}%`;
        document.getElementById('combined-bar').style.height = `${((combinedPrice - 80000) / 40000) * 100}%`;
        document.getElementById('combined-bar').style.backgroundColor = combinedChange >= 0 ? '#00cc00' : '#cc0000';

        console.log("Datos actualizados correctamente.");
    } catch (error) {
        console.error("Error al obtener datos:", error);
    }
}

// Actualizar cada 35 minutos
setInterval(obtenerDatosCripto, 35 * 60 * 1000);
obtenerDatosCripto(); // Ejecutar al cargar