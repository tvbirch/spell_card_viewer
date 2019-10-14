import * as shared from "shared.js";

function addSpell() {
  console.log("addSpell");
}

function searchForSpells() {
  console.log("searchForSpells");
}

function saveNewitem() {
  let name = document.getElementById("new-item-name").value;
  let cost = document.getElementById("new-item-cost").value;
  let quantity = document.getElementById("new-item-quantity").value;
  let subTotal = cost * quantity;



  if (name && cost && quantity) {
    hoodie.store.withIdPrefix("item").add({
      name: name,
      cost: cost,
      quantity: quantity,
      subTotal: subTotal
    });



    document.getElementById("new-item-name").value = "";
    document.getElementById("new-item-cost").value = "";
    document.getElementById("new-item-quantity").value = "";
  } else {
    let snackbarContainer = document.querySelector("#toast");
    snackbarContainer.MaterialSnackbar.showSnackbar({
      message: "All fields are required"
    });
  }
}


function deleteRow(deletedItem) {
  let row = document.getElementById(deletedItem._id);
  let totalCost = Number.parseFloat(
    document.getElementById("total-cost").value
  );
  document.getElementById("total-cost").value =
    totalCost - deletedItem.subTotal;
  row.parentNode.removeChild(row);
}

function deleteItem(itemId) {
  hoodie.store.withIdPrefix("item").remove(itemId);
}

function init() {
  shared.updateDOMWithLoginStatus();
  //hoodie.store.withIdPrefix("item").on("add", addItemToPage);
  //hoodie.store.withIdPrefix("item").on("remove", deleteRow);

  //document.getElementById("search-spell").addEventListener("click", searchForSpells);

  //retrieve items on the current list and display on the page
  /*hoodie.store
    .withIdPrefix("item")
    .findAll()
    .then(function(items) {
      for (let item of items) {
        addItemToPage(item);
      }
    });
*/
    window.pageEvents = {
  //    addSpell: addSpell,
      closeLogin: shared.closeLoginDialog,
      showLogin: shared.showLoginDialog,
      closeRegister: shared.closeRegisterDialog,
      showRegister: shared.showRegisterDialog,
      login: shared.login,
      register: shared.register,
      signout: shared.signOut
    };
}


init();

function getIndexTemplate() {
  let template = document.querySelector("#item-row").innerHTML;
  return template;
}

function addItemToPage(item) {
  if (document.getElementById(item._id)) return;//skip items already added to the DOM
  let template = getIndexTemplate();
  template = template.replace("{{name}}", item.name);
  template = template.replace("{{cost}}", item.cost);
  template = template.replace("{{quantity}}", item.quantity);
  template = template.replace("{{subTotal}}", item.subTotal);
  template = template.replace("{{row-id}}", item._id);
  template = template.replace("{{item-id}}", item._id);
  document.getElementById("item-table").tBodies[0].innerHTML += template;

  let totalCost = Number.parseFloat(
    document.getElementById("total-cost").value
  );
  document.getElementById("total-cost").value = totalCost + item.subTotal;
}
