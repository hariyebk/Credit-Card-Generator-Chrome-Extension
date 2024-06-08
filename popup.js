// Selecting all the necessary elements
const generateBtn = document.getElementById("generate-button")
const cardProvider = document.getElementById("credit-card-provider")
const resultElement = document.getElementById("credit-card-info")
const starElement = document.getElementById("stars")

generateBtn.addEventListener("click", async () => {
    // Get the selected provider and country
    const provider = cardProvider.value;
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
    // Let's generate a random ZIP code since our Credit Card Information provider doesn't give us the ZIP code
    const addressData = await fetch("https://random-data-api.com/api/address/random_address")
    const addressResult = await addressData.json()
    //  Get all the information from the data
    const cardNumber = data?.cardNumber
    const cvv = data?.cvv
    const expiration_date = data?.date.split("T")[0]
    const fullName = data?.fullName 
    const pin = data?.pin
    const zipCode = addressResult?.zip_code
    const streetAddress = addressResult?.street_address
    const type = data?.type
    const generated_date = new Date().toISOString().split("T")[0]
    // Enable the generate button
    generateBtn.removeAttribute("disabled")
    // return the button state to the original
    generateBtn.innerHTML = `
        <p class="text-black text-base font-semibold"> Generate </p>
    `
    // Append the result to the DOM
    resultElement.innerHTML = `
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
                    <h3 class="text-[17px] font-semibold"> Zip Code :</h3>
                    <p class="text-base mt-1"> ${zipCode} </p>
                </span>
                <button id="copy-btn" class="bg-card bg-opacity-80 px-2 py-1.5 mt-1 rounded-md border border-gray-700 focus-visible:outline-none" data-clipboard-text="${zipCode}">
                    <image src="./copy.png" alt="copy-icon" width="15px" height="8px" />
                </button>
            </div>
            <div class="flex items-start justify-center gap-5">
                <span class="flex items-center gap-2">
                    <h3 class="text-[17px] font-semibold"> Street Address :</h3>
                    <p class="text-base mt-1"> ${streetAddress} </p>
                </span>
                <button id="copy-btn" class="bg-card bg-opacity-80 px-2 py-1.5 mt-1 rounded-md border border-gray-700 focus-visible:outline-none" data-clipboard-text="${streetAddress}">
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
})