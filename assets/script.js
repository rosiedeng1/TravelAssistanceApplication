let api = `https://v6.exchangerate-api.com/v6/${apiKey}/latest/USD`;
const fromDropDown = document.getElementById("from-currency-select");
const toDropDown = document.getElementById("to-currency-select");
var conversions = document.getElementById("conversion-container")

// Dropdown for the Base currencies array
currencies_abrev.forEach((currency) => {
  const option = document.createElement("option");
  option.value = Object.values(currency);
  option.text = Object.keys(currency)[0];
  if (option.text === "UNITED STATES OF AMERICA") {
    option.selected = true;
  }
  fromDropDown.add(option);
})

// Dropdown for the End currencies array
currencies_abrev.forEach((currency) => {
  const option = document.createElement("option");
  option.value = Object.values(currency);
  option.text = Object.keys(currency)[0];
  if (option.text === "UNITED STATES OF AMERICA") {
    option.selected = true;
  }
  toDropDown.add(option);
})


let convertCurrency = () => {
  const amount = document.querySelector("#amount").value;
  const fromCurrency = fromDropDown.value;
  const toCurrency = toDropDown.value;
  ;


  if (amount.length != 0) {
    fetch(api).then((resp) => resp.json()).then((data) => {
      let fromExchangeRate = data.conversion_rates[fromCurrency];
      let toExchangeRate = data.conversion_rates[toCurrency];
      const convertedAmount = (amount / fromExchangeRate) * toExchangeRate;
      let formattedAmount = Intl.NumberFormat('en-US').format(convertedAmount);
      result.innerHTML = `${amount} ${fromCurrency} = ${formattedAmount} ${toCurrency}`;

      //Local Storage

      var testTransaction = {
        amountFrom: amount,
        currencyFrom: fromCurrency,
        amountTo: convertedAmount,
        currencyTo: toCurrency,
      };

      function addLatestTransactionToLocalStorage(transaction) {
        var key = "transactions"
        // Check local storage for existing data
        var transactions = localStorage.getItem(key)
        console.log(transactions)
        //  Parsed data into an array 
        var transactions = JSON.parse(localStorage.getItem("transactions")) || [];
        console.log(transactions)
        // Add the new transaction to the array
        transactions.push(transaction);
        // Save the updated array back to local storage
        localStorage.setItem(key, JSON.stringify(transactions));

      }
      addLatestTransactionToLocalStorage(testTransaction);

    });

    renderLatest3Transactions()
  }
  function renderLatest3Transactions() {
    var latestTransactions = JSON.parse(localStorage.getItem("transactions")) || [];
    var latestTransactionsList = document.getElementById("conversion-container");
    var last3Transactions = latestTransactions.slice(-3)
    // Clears the previous content upon click
    latestTransactionsList.innerHTML= ""
    // Created for loop for last3Transactions 
    for (let i=0; i<last3Transactions.length; i++) {
      var transaction = last3Transactions[i]
      var p = document.createElement("p")
      // Extracted values you want to show 
      p.textContent = `${transaction.amountFrom} ${transaction.currencyFrom} = ${transaction.amountTo.toFixed(2)} ${transaction.currencyTo}`
      // Appended p element into the conversion-container id
      latestTransactionsList.appendChild(p);
    }

  }

}

document.querySelector("#fetch-button").addEventListener("click", convertCurrency);
window.addEventListener("load", convertCurrency);

