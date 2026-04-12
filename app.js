const API_KEY = "CG-teizHFS6WHgRrdaXkc3H44Sh";
const URL = "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=20&page=1";

const coinsGrid = document.getElementById("coinsGrid");
const errorMsg = document.getElementById("errorMsg");
const sortSelect = document.getElementById("sortSelect");

let coinsData = [];

async function fetchCoins() {
  try {
    const response = await fetch(URL, { headers: { "x-cg-demo-api-key": API_KEY } });
    coinsData = await response.json();
    renderCoins();
  } catch (error) {
    errorMsg.style.display = "block";
    console.error("Fetch error:", error);
  }
}

function renderCoins() {
  const sortOption = sortSelect ? sortSelect.value : 'market_cap_desc';
  let sortedCoins = [...coinsData];

  switch (sortOption) {
    case 'market_cap_asc': sortedCoins.sort((a, b) => a.market_cap - b.market_cap); break;
    case 'market_cap_desc': sortedCoins.sort((a, b) => b.market_cap - a.market_cap); break;
    case 'price_asc': sortedCoins.sort((a, b) => a.current_price - b.current_price); break;
    case 'price_desc': sortedCoins.sort((a, b) => b.current_price - a.current_price); break;
    case 'change_asc': sortedCoins.sort((a, b) => a.price_change_percentage_24h - b.price_change_percentage_24h); break;
    case 'change_desc': sortedCoins.sort((a, b) => b.price_change_percentage_24h - a.price_change_percentage_24h); break;
  }

  coinsGrid.innerHTML = sortedCoins.map(coin => {
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
          <a href="https://www.coingecko.com/en/coins/${coin.id}" target="_blank" class="more-info-btn">More Info</a>
        </div>
      `;
  }).join('');
}

if (sortSelect) {
  sortSelect.addEventListener("change", renderCoins);
}

fetchCoins();