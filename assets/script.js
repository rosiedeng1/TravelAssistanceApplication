let api = `https://v6.exchangerate-api.com/v6/${apiKey}/latest/USD`;
const fromDropDown = document.getElementById("from-currency-select");
const toDropDown = document.getElementById("to-currency-select");

// Dropdown for the Base currencies array
currencies_abrev.forEach((currency) => {
    const option = document.createElement("option");
    option.value = Object.values(currency);
    option.text = Object.keys(currency)[0];
    fromDropDown.add(option);
})

// Dropdown for the End currencies array
currencies_abrev.forEach((currency) => {
    const option = document.createElement("option");
    option.value = Object.values(currency);
    option.text = Object.keys(currency)[0];
    toDropDown.add(option);
})

//Setting default values
fromDropDown.value = "USD";
toDropDown.value = "EUR";

let convertCurrency = () => {
    const amount = document.querySelector("#amount").value;
    const fromCurrency = fromDropDown.value;
    const toCurrency = toDropDown.value;
;


if(amount.length != 0) {
    fetch(api).then((resp) => resp.json()).then((data) => {
        let fromExchangeRate = data.conversion_rates[fromCurrency];
        let toExchangeRate = data.conversion_rates[toCurrency];
        const convertedAmount = (amount / fromExchangeRate) * toExchangeRate;
        result.innerHTML = `${amount} ${fromCurrency} = ${convertedAmount.toFixed(2)} ${toCurrency}`;

  //Local Storage

  var testTransaction = {
    amountFrom: amount,
    currencyFrom: fromCurrency,
    amountTo: convertedAmount,
    currencyTo: toCurrency,
  };
  
  function addLatestTransactionToLocalStorage(transaction) {
    // Check local storage for existing data
    var transactions = JSON.parse(localStorage.getItem("transactions")) || [];
    // Add the new transaction to the array
    transactions.push(transaction);
    // Save the updated array back to local storage
    localStorage.setItem("transactions", JSON.stringify(transactions));
  }
  
  function getLast3FromLocalStorage() {
    // Read from local storage
    var transactions = JSON.parse(localStorage.getItem("transactions")) || [];
    // Return the last 3 transactions (or all transactions if there are less than 3)
    return console.log(transactions.slice(-3));
  }
  
  addLatestTransactionToLocalStorage(testTransaction);
  //console.log(getLast3FromLocalStorage);
  getLast3FromLocalStorage();



    });


  
} else {
    alert("Please fill in the amount");
}






};

document.querySelector("#fetch-button").addEventListener("click", convertCurrency);
window.addEventListener("load", convertCurrency);


// Local Storage
