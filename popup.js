// Selecting all the necessary elements
const generateBtn = document.getElementById("generate-button")
const cardProvider = document.getElementById("credit-card-provider")
const countryElement = document.getElementById("country")
const stars = document.querySelectorAll(".star")

generateBtn.addEventListener("click", async () => {
    // Get the selected provider and country
    const provider = cardProvider.value;
    const country = countryElement.value
    const apikey = "a7e0945c7f524a25b636223e2049d5c2";
    // Disable the generate button
    generateBtn.setAttribute("disabled", true)
    // remove the content inside the buton
    generateBtn.innerHTML = ''
    // Add a spinner to notify the user that we are processing the request
    generateBtn.innerHTML = `
        <div class="flex items-center gap-2">
            <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <p class="text-black text-base font-semibold"> processing... </p>
        </div>
    `
    // Make an Http request to get the credit card information
    const response = await fetch(`https://randommer.io/api/Card?type=${provider}`, {
        method: "GET",
        headers: {
            "X-Api-Key": apikey, 
            "Content-Type": "application/json",
        }
    });
    // Parse the result
    const data = await response.json();
    // Let's generate a random ZIP code and address in the US since our Credit Card Information provider API doesn't give us the ZIP code  and adress
    const randomUserAddress = await fetch(`https://randomuser.me/api/?nat=${country}`)
    const randomUserAddressResult = await randomUserAddress.json()
    const {city, state, street, postcode } = randomUserAddressResult?.results[0].location
    const {first, last} = randomUserAddressResult?.results[0].name
    const credit_card_data = {
        cardNumber: data?.cardNumber,
        cvv: data?.cvv,
        expiration_date: data?.date.split("T")[0],
        fullName: `${first} ${last}`,
        pin: data?.pin,
        postCode: postcode,
        address: `${street.number} ${street.name}, ${city}, ${state}`,
        type: data?.type,
        generated_date: new Date().toISOString().split("T")[0],
        cardSelected: provider,
        countrySelected: country
    }
    // Enable the generate button
    generateBtn.removeAttribute("disabled")
    // return the button state to the original
    generateBtn.innerHTML = `
        <p class="text-black text-base font-semibold"> Generate </p>
    `
    // Append the result to the DOM
    appendResult(credit_card_data.cardNumber, credit_card_data.cvv, credit_card_data.fullName, credit_card_data.pin, credit_card_data.postCode, credit_card_data.address, credit_card_data.type, credit_card_data.expiration_date, credit_card_data.generated_date)
    // store the result in the chrome storage
    chrome.storage.local.set({ creditCardInfo: credit_card_data}, function() {
        console.log('Credit card information stored successfully');
    });
    Copy()
})

let currentRating = 0;

stars.forEach((star, index) => {
    // For each star we're listening for a hover event to fire , then we will remove any existing hover effects and add a new one for each star
    star.addEventListener('mouseover', () => {
        resetStars();
        for (let i = 0; i <= index; i++) {
            stars[i].classList.add('hovered');
        }
    });

    // During Mouse out event we remove any hover effects from all stars using the resetStars function , then if the current rating is greater than 0, we will add the hover effect for thise special stars.
    star.addEventListener('mouseout', () => {
        resetStars();
        if (currentRating > 0 && currentRating >= 4) {
            for (let i = 0; i < currentRating; i++) {
                stars[i].classList.add('hovered');
            }
        }

        if(currentRating > 0 && currentRating <= 3){
            for (let i = 0; i < currentRating; i++) {
                stars[i].classList.add('red');
            }
        }
    });
    

    // Lisening to the click event  to redirect the user based on the rating
    star.addEventListener('click', () => {
        currentRating = index + 1;
        if (currentRating >= 4) {
            window.open("https://www.google.com/", "_blank");
        } 
        else if (currentRating <= 3) {
            for (let i = 0; i <= index; i++) {
                stars[i].classList.add('red');
            }
            window.open('https://www.youtube.com/hashtag/funnyvideo' , "_blank");
        }
    });
})

// A function that removes the hover and red property from each star by looping over them
function resetStars() {
    stars.forEach(star => {
        star.classList.remove('hovered');
        star.classList.remove('red')
    });
}

// A reusable function to display the results in the DOM
function appendResult(cardNumber, cvv, fullName, pin, postCode, address, type, expiration_date, generated_date){
    const resultElement = document.getElementById("credit-card-info")
    return resultElement.innerHTML = `
        <div class="text-primary text-base flex flex-col items-start gap-4">
            <div class="flex items-start justify-center gap-5">
                <span class="flex items-center gap-2">
                    <h3 class="text-[17px] font-semibold"> Card Number :</h3>
                    <p class="text-base mt-1"> ${cardNumber} </p>
                </span>
                <button id="copy-btn" class="bg-card bg-opacity-80 px-2 py-1.5 mt-1 rounded-md border border-gray-700 focus-visible:outline-none" data-clipboard-text="${cardNumber}">
                    <image src="./copy.png" alt="copy-icon" width="15px" height="8px" />
                </button>
            </div>
            <div class="flex items-start justify-center gap-5">
                <span class="flex items-center gap-2">
                    <h3 class="text-[17px] font-semibold"> CVV :</h3>
                    <p class="text-base mt-1"> ${cvv} </p>
                </span>
                <button id="copy-btn" class="bg-card bg-opacity-80 px-2 py-1.5 mt-1 rounded-md border border-gray-700 focus-visible:outline-none" data-clipboard-text="${cvv}">
                    <image src="./copy.png" alt="copy-icon" width="15px" height="8px" />
                </button>
            </div>
            <div class="flex items-start justify-center gap-5">
                <span class="flex items-center gap-2">
                    <h3 class="text-[17px] font-semibold"> Full Name :</h3>
                    <p class="text-base mt-1"> ${fullName} </p>
                </span>
                <button id="copy-btn" class="bg-card bg-opacity-80 px-2 py-1.5 mt-1 rounded-md border border-gray-700 focus-visible:outline-none" data-clipboard-text="${fullName}">
                    <image src="./copy.png" alt="copy-icon" width="15px" height="8px" />
                </button>
            </div>
            <div class="flex items-start justify-center gap-5">
                <span class="flex items-center gap-2">
                    <h3 class="text-[17px] font-semibold"> Pin :</h3>
                    <p class="text-base mt-1"> ${pin} </p>
                </span>
                <button id="copy-btn" class="bg-card bg-opacity-80 px-2 py-1.5 mt-1 rounded-md border border-gray-700 focus-visible:outline-none" data-clipboard-text="${pin}">
                    <image src="./copy.png" alt="copy-icon" width="15px" height="8px" />
                </button>
            </div>
            <div class="flex items-start justify-center gap-5">
                <span class="flex items-center gap-2">
                    <h3 class="text-[17px] font-semibold"> postcode :</h3>
                    <p class="text-base mt-1"> ${postCode} </p>
                </span>
                <button id="copy-btn" class="bg-card bg-opacity-80 px-2 py-1.5 mt-1 rounded-md border border-gray-700 focus-visible:outline-none" data-clipboard-text="${postCode}">
                    <image src="./copy.png" alt="copy-icon" width="15px" height="8px" />
                </button>
            </div>
            <div class="flex flex-wrap items-start justify-center gap-2">
                <span class="flex items-center gap-2">
                    <h3 class="text-[17px] font-semibold"> Address :</h3>
                    <p class="text-base mt-1"> ${address} </p>
                </span>
                <button id="copy-btn" class="bg-card bg-opacity-80 px-2 py-1.5 mt-1 rounded-md border border-gray-700 focus-visible:outline-none" data-clipboard-text="${address}">
                    <image src="./copy.png" alt="copy-icon" width="15px" height="8px" />
                </button>
            </div>
            <div class="flex items-start justify-center gap-5">
                <span class="flex items-center gap-2">
                    <h3 class="text-[17px] font-semibold"> Credit card type :</h3>
                    <p class="text-base mt-1"> ${type} </p>
                </span>
                <button id="copy-btn" class="copy-btn bg-card bg-opacity-80 px-2 py-1.5 mt-1 rounded-md border border-gray-700 focus-visible:outline-none" data-clipboard-text="${type}">
                    <image src="./copy.png" alt="copy-icon" width="15px" height="8px" />
                </button>
            </div>
            <div class="flex items-start justify-center gap-5">
                <span class="flex items-center gap-2">
                    <h3 class="text-[17px] font-semibold"> Expiration Date :</h3>
                    <p class="text-base mt-1"> ${expiration_date} </p>
                </span>
                <button id="copy-btn" class="bg-card bg-opacity-80 px-2 py-1.5 mt-1 rounded-md border border-gray-700 focus-visible:outline-none" data-clipboard-text="${expiration_date}">
                    <image src="./copy.png" alt="copy-icon" width="15px" height="8px" />
                </button>
            </div>
            <div class="flex items-start justify-center gap-5">
                <span class="flex items-center gap-2">
                    <h3 class="text-[17px] font-semibold"> Generated date :</h3>
                    <p class="text-base mt-1"> ${generated_date} </p>
                </span>
                <button id="copy-btn" class="bg-card bg-opacity-80 px-2 py-1.5 mt-1 rounded-md border border-gray-700 focus-visible:outline-none" data-clipboard-text="${generated_date}">
                    <image src="./copy.png" alt="copy-icon" width="15px" height="8px" />
                </button>
            </div>
        </div>
    `
}

// A function that copies the clicked values into the user's clipboard
function Copy(){
    const copyButtons = document.querySelectorAll("#copy-btn")
    // Litsen for click event on the copy button
    copyButtons.forEach((button) => {
        button.addEventListener('click', () => {
            const text = button.getAttribute('data-clipboard-text');
            navigator.clipboard.writeText(text);
            button.innerHTML = `
                <image src="./checked.png" alt="check-icon" width="15px" height="8px" />
            `;
        })
    })
}

// Litsening for the user to open our extension , then we will load the data from the storage to display it on the DOM.
document.addEventListener('DOMContentLoaded', function() {
    chrome.storage.local.get('creditCardInfo', function(result) {
        if (result.creditCardInfo) {
            const data = result.creditCardInfo
            // Show the stored data
            appendResult(data.cardNumber, data.cvv, data.fullName, data.pin, data.postCode, data.address, data.type, data.expiration_date, data.generated_date)
            // Enable the copy feature
            Copy()
            // Change the credit card provider and country to match the stored data
            cardProvider.value = data.cardSelected
            countryElement.value = data.countrySelected
        } 
        else return 
    });
})
