let api = `https://v6.exchangerate-api.com/v6/${apiKey}/latest/USD`;
const fromDropDown = document.getElementById("from-currency-select");
const toDropDown = document.getElementById("to-currency-select");
var conversions = document.getElementById("conversion-container");

// Dropdown for the Base currencies array
currencies_abrev.forEach((currency) => {
  const option = document.createElement("option");
  option.value = Object.values(currency);
  option.text = Object.keys(currency)[0];
  if (option.text === "UNITED STATES OF AMERICA") {
    option.selected = true;
  }
  fromDropDown.add(option);
});

// Dropdown for the End currencies array
currencies_abrev.forEach((currency) => {
  const option = document.createElement("option");
  option.value = Object.values(currency);
  option.text = Object.keys(currency)[0];
  if (option.text === "UNITED STATES OF AMERICA") {
    option.selected = true;
  }
  toDropDown.add(option);
});

let convertCurrency = () => {
  const amount = document.querySelector("#amount").value;
  const fromCurrency = fromDropDown.value;
  const toCurrency = toDropDown.value;
  if (amount.length != 0) {
    fetch(api)
      .then((resp) => resp.json())
      .then((data) => {
        let fromExchangeRate = data.conversion_rates[fromCurrency];
        let toExchangeRate = data.conversion_rates[toCurrency];
        const convertedAmount = (amount / fromExchangeRate) * toExchangeRate;
        let formattedAmount =
          Intl.NumberFormat("en-US").format(convertedAmount);
        result.innerHTML = `${amount} ${fromCurrency} = ${formattedAmount} ${toCurrency}`;

        //Local Storage

        var testTransaction = {
          amountFrom: amount,
          currencyFrom: fromCurrency,
          amountTo: convertedAmount,
          currencyTo: toCurrency,
        };

        function addLatestTransactionToLocalStorage(transaction) {
          var key = "transactions";
          // Check local storage for existing data
          var transactions = localStorage.getItem(key);
          //  Parsed data into an array
          var transactions =
            JSON.parse(localStorage.getItem("transactions")) || [];
          // Add the new transaction to the array
          transactions.push(transaction);
          // Save the updated array back to local storage
          localStorage.setItem(key, JSON.stringify(transactions));
        }
        addLatestTransactionToLocalStorage(testTransaction);
      });

    renderLatest3Transactions();
  }
  function renderLatest3Transactions() {
    var latestTransactions =
      JSON.parse(localStorage.getItem("transactions")) || [];
    var latestTransactionsList = document.getElementById(
      "conversion-container"
    );
    var last3Transactions = latestTransactions.slice(
      Math.max(latestTransactions.length - 3, 0)
    );
    // Clears the previous content upon click
    latestTransactionsList.innerHTML = "";
    // Created for loop for last3Transactions
    for (let i = 0; i < last3Transactions.length; i++) {
      var transaction = last3Transactions[i];
      var p = document.createElement("p");
      // Extracted values you want to show
      p.textContent = `${transaction.amountFrom} ${
        transaction.currencyFrom
      } = ${transaction.amountTo.toFixed(2)} ${transaction.currencyTo}`;
      // Appended p element into the conversion-container id
      latestTransactionsList.appendChild(p);
    }
  }
};

document
  .querySelector("#fetch-button")
  .addEventListener("click", convertCurrency);
window.addEventListener("load", convertCurrency);

const countryApiUrl = "https://api.api-ninjas.com/v1/country?name=";
const countryApiKey = "q89lgkdr7g0Ta6sOQ0c4WRkkXrc49W8jXpF7WZUe";

// Function to fetch country information
function fetchCountryInfo(currencyCode) {
  const countryName = currencyCode.split(" ")[0]; // Assuming country name is the first word in currencyCode
  fetch(`${countryApiUrl}${countryName}`, {
    headers: { 'X-Api-Key': countryApiKey }
  })
    .then(response => response.json())
    .then(data => {
      displayCountryInfo(data[0]);
    })
    
}

// Function to display country information
function displayCountryInfo(countryData) {
  const countryInfoDiv = document.getElementById("country-info");
  countryInfoDiv.innerHTML = `
    <p><strong>Country:</strong> ${countryData.name}</p>
    <p><strong>Capital:</strong> ${countryData.capital}</p>
    <p><strong>Population:</strong> ${countryData.population}</p>
    <p><strong>Area:</strong> ${countryData.area} km²</p>`;
}

// Update event listener for currency selection
fromDropDown.addEventListener("change", () => {
  const selectedCurrency = fromDropDown.options[fromDropDown.selectedIndex].text;
  fetchCountryInfo(selectedCurrency);
});

toDropDown.addEventListener("change", () => {
  const selectedCurrency = toDropDown.options[toDropDown.selectedIndex].text;
  fetchCountryInfo(selectedCurrency);
});

