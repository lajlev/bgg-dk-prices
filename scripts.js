/**
 * BoardGameGeek Price Button Extension
 *
 * This script adds a button to BoardGameGeek game pages that shows the lowest price
 * from braetspilspriser.dk (Danish board game price comparison site) and links to it.
 */

// Extract the board game ID from the URL
const pathArray = window.location.pathname.split("/");
const boardGameId = pathArray[2];

// DOM manipulation function to add or update the buy button
function updateBuyButton(priceData) {
  // Find the toolbar where we'll place our button
  const toolbarActions = document.querySelector(".toolbar-actions");

  // Exit if we can't find the toolbar
  if (!toolbarActions) {
    console.error("Could not find toolbar to add price button");
    return;
  }

  // Find the toolbar action where our button should go
  const toolbarAction = toolbarActions.querySelector(".toolbar-action");
  if (!toolbarAction) {
    console.error("Could not find toolbar action to add price button");
    return;
  }

  // Remove existing buy button if it exists
  const existingBuyButton = toolbarAction.querySelector(".buy-btn");
  if (existingBuyButton) {
    existingBuyButton.remove();
  }

  // Create new button element
  const buyButton = document.createElement("a");
  buyButton.className = "buy-btn btn btn-sm";
  buyButton.title = "Se alle priser på braetspilspriser.dk";
  buyButton.href = priceData.url;
  buyButton.innerHTML = `<i class="fi-shopping-cart"></i> fra ${Math.round(
    priceData.price
  )} kr`;

  // Add the button to the toolbar
  toolbarAction.appendChild(buyButton);
}

// Fetch price data from braetspilspriser.dk
function fetchPriceData() {
  const apiUrl = `https://braetspilspriser.dk/api/info?eid=${boardGameId}&currency=DKK&destination=DK&delivery=PACKAGE,POSTOFFICE&sort=SMART&sitename=lillefar.com`;

  fetch(apiUrl)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`API responded with status: ${response.status}`);
      }
      return response.json();
    })
    .then((data) => {
      // Check if we have valid data
      if (
        !data.items ||
        data.items.length === 0 ||
        !data.items[0].prices ||
        data.items[0].prices.length === 0
      ) {
        console.error("No price data available for this game");
        return;
      }

      // Extract the relevant price data
      const priceData = {
        url: data.items[0].url,
        price: data.items[0].prices[0].product,
      };

      // Update the UI with the price data
      updateBuyButton(priceData);
    })
    .catch((error) => {
      console.error("Error fetching price data:", error);
    });
}

// Initialize the extension
(function init() {
  // Only run on game pages
  if (boardGameId && !isNaN(boardGameId)) {
    fetchPriceData();
  }
})();
