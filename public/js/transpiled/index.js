"use strict";

System.register(["shared.js"], function (_export, _context) {
  "use strict";

  var shared;


  function saveNewitem() {
    var name = document.getElementById("new-item-name").value;
    var cost = document.getElementById("new-item-cost").value;
    var quantity = document.getElementById("new-item-quantity").value;
    var subTotal = cost * quantity;

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
      var snackbarContainer = document.querySelector("#toast");
      snackbarContainer.MaterialSnackbar.showSnackbar({
        message: "All fields are required"
      });
    }
  }

  function deleteRow(deletedItem) {
    var row = document.getElementById(deletedItem._id);
    var totalCost = Number.parseFloat(document.getElementById("total-cost").value);
    document.getElementById("total-cost").value = totalCost - deletedItem.subTotal;
    row.parentNode.removeChild(row);
  }

  function deleteItem(itemId) {
    hoodie.store.withIdPrefix("item").remove(itemId);
  }

  function init() {
    shared.updateDOMWithLoginStatus();
    hoodie.store.withIdPrefix("item").on("add", addItemToPage);
    hoodie.store.withIdPrefix("item").on("remove", deleteRow);

    document.getElementById("add-item").addEventListener("click", saveNewitem);

    //retrieve items on the current list and display on the page
    hoodie.store.withIdPrefix("item").findAll().then(function (items) {
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = items[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var item = _step.value;

          addItemToPage(item);
        }
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator.return) {
            _iterator.return();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
      }
    });

    window.pageEvents = {
      deleteItem: deleteItem,
      closeLogin: shared.closeLoginDialog,
      showLogin: shared.showLoginDialog,
      closeRegister: shared.closeRegisterDialog,
      showRegister: shared.showRegisterDialog,
      login: shared.login,
      register: shared.register,
      signout: shared.signOut
    };
  }

  function getIndexTemplate() {
    var template = document.querySelector("#item-row").innerHTML;
    return template;
  }

  function addItemToPage(item) {
    if (document.getElementById(item._id)) return; //skip items already added to the DOM
    var template = getIndexTemplate();
    template = template.replace("{{name}}", item.name);
    template = template.replace("{{cost}}", item.cost);
    template = template.replace("{{quantity}}", item.quantity);
    template = template.replace("{{subTotal}}", item.subTotal);
    template = template.replace("{{row-id}}", item._id);
    template = template.replace("{{item-id}}", item._id);
    document.getElementById("item-table").tBodies[0].innerHTML += template;

    var totalCost = Number.parseFloat(document.getElementById("total-cost").value);
    document.getElementById("total-cost").value = totalCost + item.subTotal;
  }
  return {
    setters: [function (_sharedJs) {
      shared = _sharedJs;
    }],
    execute: function () {
      init();
    }
  };
});