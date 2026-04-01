const API_KEY = "CG-teizHFS6WHgRrdaXkc3H44Sh";
const URL = "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=20&page=1";

const coinsGrid = document.getElementById("coinsGrid");
const errorMsg = document.getElementById("errorMsg");

async function fetchCoins() {
  try {
    const response = await fetch(URL, { headers: { "x-cg-demo-api-key": API_KEY } });
    const coins = await response.json();
    
    coinsGrid.innerHTML = coins.map(coin => {
      const isUp = coin.price_change_percentage_24h >= 0;
      
      // Helper to format large numbers (e.g., 1.2B)
      const formatCompact = (num) => {
        return new Intl.NumberFormat('en-US', {
          notation: 'compact',
          maximumFractionDigits: 1
        }).format(num);
      };

      return `
        <div class="card">
          <img src="${coin.image}" class="coin-img" alt="${coin.name}">
          <span class="coin-name">${coin.name}</span>
          <span class="coin-symbol">${coin.symbol}</span>
          
          <div class="coin-price">$${coin.current_price.toLocaleString()}</div>
          
          <div class="coin-change ${isUp ? 'up' : 'down'}">
            ${isUp ? '▲' : '▼'} ${Math.abs(coin.price_change_percentage_24h).toFixed(2)}%
          </div>

          <div class="card-stats">
            <div class="stat-box">
              <span class="stat-label">Market Cap</span>
              <span class="stat-value">$${formatCompact(coin.market_cap)}</span>
            </div>
            <div class="stat-box">
              <span class="stat-label">24h Vol</span>
              <span class="stat-value">$${formatCompact(coin.total_volume)}</span>
            </div>
          </div>
        </div>
      `;
    }).join('');

  } catch (error) {
    errorMsg.style.display = "block";
    console.error("Fetch error:", error);
  }
}

fetchCoins();
