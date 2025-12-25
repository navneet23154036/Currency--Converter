  
const BASE_URL = "https://api.frankfurter.app/latest";
 
const dropdowns = document.querySelectorAll(".custom-select select");
const btn = document.querySelector(".convert-button");
const fromCurr = document.querySelector("select[name='from']");
const toCurr = document.querySelector("select[name='to']");
const msg = document.querySelector(".msg");
const swapBtn = document.querySelector(".swap-btn");
const amountInput = document.querySelector("#amount");
 
for (let select of dropdowns) {
    for (let currCode in countryList) {
        let newOption = document.createElement("option");
        newOption.innerText = currCode;
        newOption.value = currCode;

        if (select.name === "from" && currCode === "USD") newOption.selected = true;
        if (select.name === "to" && currCode === "INR") newOption.selected = true;

        select.append(newOption);
    }

    select.addEventListener("change", (evt) => {
        updateFlag(evt.target);
    });
}

  
   const updateFlag = (element) => {
    const currCode = element.value;
    const countryCode = countryList[currCode];
    const img = element.parentElement.querySelector("img");

    if (!img) return;
 
    const fallback = "https://flagcdn.com/w40/un.png";

    if (!countryCode) {
        img.src = fallback;
        return;
    }

    const code = countryCode.toLowerCase();
 
    img.src = `https://flagcdn.com/w40/${code}.png`;
 
    img.onerror = () => {
        img.src = fallback;
    };
};


 
const updateExchangeRate = async () => {
    let amtVal = amountInput.value;
    if (amtVal === "" || amtVal < 0) {
        amtVal = 1;
        amountInput.value = " ";
    }

    msg.innerText = "Updating...";

    try {
        const URL = `${BASE_URL}?amount=${amtVal}&from=${fromCurr.value}&to=${toCurr.value}`;
        let response = await fetch(URL);
        let data = await response.json();
        let rate = data.rates[toCurr.value];
 
        let formattedRate = new Intl.NumberFormat('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }).format(rate);

        msg.innerText = `${amtVal} ${fromCurr.value} = ${formattedRate} ${toCurr.value}`;
    } catch (error) {
        msg.innerText = "Rate unavailable";
    }
};

 
swapBtn.addEventListener("click", (e) => {
     
    e.preventDefault();
 
    let tempCode = fromCurr.value;
    fromCurr.value = toCurr.value;
    toCurr.value = tempCode;
 
    updateFlag(fromCurr);
    updateFlag(toCurr);
 
    updateExchangeRate();
     
    const icon = swapBtn.querySelector("i");
    icon.style.transition = "transform 0.4s ease";
    icon.style.transform = icon.style.transform === "rotate(180deg)" ? "rotate(0deg)" : "rotate(180deg)";
});

 
btn.addEventListener("click", (evt) => {
    evt.preventDefault();
    updateExchangeRate();
});

window.addEventListener("load", () => {
    updateFlag(fromCurr);
    updateFlag(toCurr);
    updateExchangeRate();
});