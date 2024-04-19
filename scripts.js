// Find ID on boardgamegeek
var pathArray = window.location.pathname.split("/");
var BoardgameId = pathArray[2];

// Remove current buy button
$toolbarActions = document.querySelector(".toolbar-actions");
$toolbarActions
  .querySelector(".toolbar-actions .toolbar-action .buy-btn")
  .remove();

// Fetch data from braetspilspriser.dk and generate button with price and link to braetspilspriser.dk
fetch(
  "https://braetspilspriser.dk/api/info?eid=" +
    BoardgameId +
    "&currency=DKK&destination=DK&delivery=PACKAGE,POSTOFFICE&sort=SMART&sitename=lillefar.com"
)
  .then((response) => response.json())
  .then((data) => {
    var newBuyButton =
      '<a class="buy-btn btn btn-sm" title="Se alle priser på braetspilspriser.dk" href="' +
      data.items[0].url +
      '"><i class="fi-shopping-cart"></i> fra ' +
      Math.round(data.items[0].prices[0].product) +
      " kr</a>";
    $toolbarActions.querySelector(".toolbar-action").innerHTML = newBuyButton;
  })
  .catch((error) => console.error(error));
