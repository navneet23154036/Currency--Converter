const BASE_URL = "https://api.frankfurter.app/latest?";
// NOTE: Frankfurter API supports only major/global currencies (mostly EUR & Europe-based).
// It does NOT support all world currencies (e.g.,  PKR, many African/Middle-East currencies).

//const BASE_URL = "https://cdn.jsdelivr.net/gh/fawazahmed0/currency-api@1/latest/currencies";
 
  

const dropdowns = document.querySelectorAll(".dropdown select");
const btn = document.querySelector("form button");
const fromCurr = document.querySelector(".from select");
const toCurr = document.querySelector(".to select");
const msg = document.querySelector(".msg");

for (let select of dropdowns) {
  for (let currCode in countryList) 
   
{
    let newOption = document.createElement("option");
    newOption.innerText = currCode;
    newOption.value = currCode;

    if (select.name === "from" && currCode === "USD") {
      newOption.selected = true;
    } 
    if (select.name === "to" && currCode === "INR") {
      newOption.selected = true;
    }

    select.append(newOption);
  }

  select.addEventListener("change", (evt) => {
    updateFlag(evt.target);
  });
}



const updateExchangeRate = async () => {
  let amount = document.querySelector(".amount input");
  let amtVal = Number(amount.value);

  if (isNaN(amtVal) || amtVal < 1) {
    amtVal = 1;
    amount.value = "1";
  }

  const URL = `https://api.frankfurter.app/latest?amount=${amtVal}&from=${fromCurr.value}&to=${toCurr.value}`;

  let response = await fetch(URL);
  let data = await response.json();

  let rate = data.rates[toCurr.value];
  msg.innerText = `${amtVal} ${fromCurr.value} = ${rate} ${toCurr.value}`;
};

/*
const updateFlag = (element) => {
  let currCode = element.value;
  let countryCode = countryList[currCode];
  let newSrc = `https://flagsapi.com/${countryCode}/flat/64.png`;
  let img = element.parentElement.querySelector("img");
  img.src = newSrc;
};
*/

const updateFlag = (element) => {
  let currCode = element.value;
  let countryCode = countryList[currCode];

  let img = element.closest(".select-container").querySelector("img");

  if (!countryCode) {
    img.src = "https://via.placeholder.com/32";
    return;
  }

 // img.src = `https://flagsapi.com/${countryCode}/flat/64.png`;
   img.src = `https://flagcdn.com/w40/${countryCode.toLowerCase()}.png`;

  img.onerror = () => {
    img.src = "https://via.placeholder.com/32";
  };
};




btn.addEventListener("click", (evt) => {
  evt.preventDefault();
  updateExchangeRate();
});
/*
window.addEventListener("load", () => {
  updateExchangeRate();
});
*/
window.addEventListener("load", () => {
  updateFlag(fromCurr);
  updateFlag(toCurr);
  updateExchangeRate();
});
document.querySelector(".dropdown i").addEventListener("click", () => {
  let temp = fromCurr.value;
  fromCurr.value = toCurr.value;
  toCurr.value = temp;

  updateFlag(fromCurr);
  updateFlag(toCurr);
  updateExchangeRate();
});

