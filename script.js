const price = document.getElementById("price");
const marketCap = document.getElementById("marketCap");
const change = document.getElementById("change");
const coinName = document.getElementById("coinName");
const historyList = document.getElementById("historyList");
const chartFrame = document.getElementById("chartFrame");
const coinList = document.getElementById("coinList");

const markets = [

  // CRYPTO

  { name: "Bitcoin", id: "bitcoin", symbol: "BTCUSDT" },
  { name: "Ethereum", id: "ethereum", symbol: "ETHUSDT" },
  { name: "Solana", id: "solana", symbol: "SOLUSDT" },
  { name: "BNB", id: "binancecoin", symbol: "BNBUSDT" },
  { name: "XRP", id: "ripple", symbol: "XRPUSDT" },
  { name: "Dogecoin", id: "dogecoin", symbol: "DOGEUSDT" },
  { name: "Cardano", id: "cardano", symbol: "ADAUSDT" },
  { name: "Toncoin", id: "the-open-network", symbol: "TONUSDT" },
  { name: "Avalanche", id: "avalanche-2", symbol: "AVAXUSDT" },
  { name: "Shiba Inu", id: "shiba-inu", symbol: "SHIBUSDT" },
  { name: "Pepe", id: "pepe", symbol: "PEPEUSDT" },
  { name: "Litecoin", id: "litecoin", symbol: "LTCUSDT" },
  { name: "Polygon", id: "matic-network", symbol: "MATICUSDT" },
  { name: "Chainlink", id: "chainlink", symbol: "LINKUSDT" },
  { name: "Polkadot", id: "polkadot", symbol: "DOTUSDT" },

  // FOREX

  { name: "EUR/USD", type: "forex", symbol: "EURUSD" },
  { name: "GBP/USD", type: "forex", symbol: "GBPUSD" },
  { name: "USD/JPY", type: "forex", symbol: "USDJPY" },
  { name: "AUD/USD", type: "forex", symbol: "AUDUSD" },
  { name: "USD/CAD", type: "forex", symbol: "USDCAD" },
  { name: "NZD/USD", type: "forex", symbol: "NZDUSD" },
  { name: "EUR/GBP", type: "forex", symbol: "EURGBP" },
  { name: "EUR/JPY", type: "forex", symbol: "EURJPY" },
  { name: "GBP/JPY", type: "forex", symbol: "GBPJPY" },
  { name: "USD/CHF", type: "forex", symbol: "USDCHF" }
];

async function getCoinData(coin = "bitcoin") {

  try {

    const response = await fetch(
      `https://api.coingecko.com/api/v3/coins/${coin}`
    );

    const data = await response.json();

    coinName.innerText = data.name;

    price.innerText =
      "$" + data.market_data.current_price.usd;

    marketCap.innerText =
      "$" + data.market_data.market_cap.usd.toLocaleString();

    change.innerText =
      data.market_data.price_change_percentage_24h.toFixed(2) + "%";

  } catch (error) {

    alert("Coin not found");
  }
}

function updateChart(symbol, type = "crypto") {

  let tradingSymbol;

  if (type === "forex") {

    tradingSymbol = `FX:${symbol}`;

  } else {

    tradingSymbol = `BINANCE:${symbol}`;
  }

  chartFrame.src =
    `https://s.tradingview.com/widgetembed/?frameElementId=tradingview_chart&symbol=${tradingSymbol}&interval=60&theme=dark`;
}

function searchMarket() {

  const input = document
    .getElementById("coinInput")
    .value
    .toLowerCase();

  const found = markets.find(item =>
    item.name.toLowerCase().includes(input) ||
    item.id === input
  );

  if (!found) {

    alert("Coin or pair not found");
    return;
  }

  if (found.type === "forex") {

    coinName.innerText = found.name;

    price.innerText = "Live Forex Chart";

    marketCap.innerText = "N/A";

    change.innerText = "Live Market";

    updateChart(found.symbol, "forex");

  } else {

    getCoinData(found.id);

    updateChart(found.symbol);
  }

  saveSearch(found.name);
}

function toggleCoins() {

  if (coinList.style.display === "block") {

    coinList.style.display = "none";

  } else {

    coinList.style.display = "block";
  }
}

function loadCoins() {

  coinList.innerHTML = "";

  markets.forEach(item => {

    const div = document.createElement("div");

    div.className = "coin-item";

    div.innerText = item.name;

    div.onclick = () => {

      document.getElementById("coinInput").value = item.name;

      if (item.type === "forex") {

        coinName.innerText = item.name;

        price.innerText = "Live Forex Chart";

        marketCap.innerText = "N/A";

        change.innerText = "Live Market";

        updateChart(item.symbol, "forex");

      } else {

        getCoinData(item.id);

        updateChart(item.symbol);
      }

      saveSearch(item.name);
    };

    coinList.appendChild(div);
  });
}

function saveSearch(search) {

  let searches = JSON.parse(localStorage.getItem("searches")) || [];

  searches.unshift(search);

  searches = searches.slice(0, 5);

  localStorage.setItem("searches", JSON.stringify(searches));

  loadHistory();
}

function loadHistory() {

  let searches = JSON.parse(localStorage.getItem("searches")) || [];

  historyList.innerHTML = "";

  searches.forEach(item => {

    const li = document.createElement("li");

    li.innerText = item;

    historyList.appendChild(li);
  });
}

getCoinData();
updateChart("BTCUSDT");
loadHistory();
loadCoins();
setInterval(() => {

  const current = coinName.innerText.toLowerCase();

  getCoinData(current);

}, 30000);
