"use strict";

System.register(["shared.js"], function (_export, _context) {
  "use strict";

  var shared;


  function addSpell() {
    console.log("addSpell");
  }

  function searchForSpells() {
    console.log("searchForSpells");
  }

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

  function deleteSpell(spellId) {
    var row = document.getElementById(spellId);
    row.parentNode.removeChild(row);

    hoodie.store.withIdPrefix("spellbook_").remove(spellId);
  }

  function init() {
    //shared.updateDOMWithLoginStatus();
    //hoodie.store.withIdPrefix("item").on("add", addItemToPage);
    //hoodie.store.withIdPrefix("item").on("remove", deleteRow);

    //document.getElementById("search-spell").addEventListener("click", searchForSpells);

    //retrieve items on the current list and display on the page
    hoodie.store.withIdPrefix("spellbook_").findAll().then(function (spells) {
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        var _loop = function _loop() {
          var spellId = _step.value;

          hoodie.store.withIdPrefix("spell_").findAll().then(function (storedSpells) {
            var found = false;
            var storedSpellFound = null;
            var _iteratorNormalCompletion2 = true;
            var _didIteratorError2 = false;
            var _iteratorError2 = undefined;

            try {
              for (var _iterator2 = storedSpells[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                var storedSpell = _step2.value;

                if (storedSpell.id === spellId.id) {
                  found = true;
                  storedSpellFound = storedSpell;
                  break;
                }
              }
            } catch (err) {
              _didIteratorError2 = true;
              _iteratorError2 = err;
            } finally {
              try {
                if (!_iteratorNormalCompletion2 && _iterator2.return) {
                  _iterator2.return();
                }
              } finally {
                if (_didIteratorError2) {
                  throw _iteratorError2;
                }
              }
            }

            if (found === false) {
              console.log("spell does not exist!");
            } else {
              console.log("spell with id " + spellId.id + " found");
              addSpellToPage(storedSpellFound, spellId._id);
            }
          });
        };

        for (var _iterator = spells[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          _loop();
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
      //    addSpell: addSpell,
      deleteSpell: deleteSpell
    };
  }

  function getIndexTemplateHeader() {
    var template = document.querySelector("#spell-col-header").innerHTML;
    return template;
  }

  function getIndexTemplateNormal() {
    var template = document.querySelector("#spell-col-normal").innerHTML;
    return template;
  }

  function getIndexTemplateBody() {
    var template = document.querySelector("#spell-col-body").innerHTML;
    return template;
  }

  function getIndexTemplateBodyWithTitle() {
    var template = document.querySelector("#spell-col-body-with-title").innerHTML;
    return template;
  }

  function appendTemplateHeader(html, text) {
    var template = getIndexTemplateHeader();
    template = template.replace("{{text}}", text);

    html += template;
    return html;
  }

  function appendTemplateNormal(html, title, text) {
    var template = getIndexTemplateNormal();
    template = template.replace("{{text}}", text);
    template = template.replace("{{title}}", title);

    html += template;
    return html;
  }

  function appendTemplateBody(html, text) {
    var template = getIndexTemplateBody();
    template = template.replace("{{text}}", text);

    html += template;
    return html;
  }

  function appendTemplateBodyWithTitle(html, title, text) {
    var template = getIndexTemplateBodyWithTitle();
    template = template.replace("{{text}}", text);
    template = template.replace("{{title}}", title);

    html += template;
    return html;
  }

  function hasValue(prop) {
    if (prop !== null && prop !== "") {
      return true;
    }
    return false;
  }

  function addSpellToPage(storedSpell, storedId) {
    if (document.getElementById(storedId)) return; //skip items already added to the DOM
    var fullHtml = "<div id=\"" + storedId + "\" class=\"mdl-card-collapsable mdl-card mdl-shadow--2dp\">";
    fullHtml += "<div class=\"mdl-card__title\"><h2 class=\"mdl-card__title-text\">" + storedSpell.name + "</h2></div><div class=\"mdl-card__supporting-text\">";

    if (hasValue(storedSpell.type)) {
      fullHtml = appendTemplateHeader(fullHtml, storedSpell.type);
    }
    if (hasValue(storedSpell.level)) {
      fullHtml = appendTemplateNormal(fullHtml, "Level", storedSpell.level);
    }
    if (hasValue(storedSpell.components)) {
      fullHtml = appendTemplateNormal(fullHtml, "Components", storedSpell.components);
    }
    if (hasValue(storedSpell.castingTime)) {
      fullHtml = appendTemplateNormal(fullHtml, "Casting Time", storedSpell.castingTime);
    }
    if (hasValue(storedSpell.range)) {
      fullHtml = appendTemplateNormal(fullHtml, "Range", storedSpell.range);
    }
    if (hasValue(storedSpell.targetType)) {
      fullHtml = appendTemplateNormal(fullHtml, storedSpell.targetType, storedSpell.targetDescription);
    }
    if (hasValue(storedSpell.duration)) {
      fullHtml = appendTemplateNormal(fullHtml, "Duration", storedSpell.duration);
    }
    if (hasValue(storedSpell.savingThrow)) {
      fullHtml = appendTemplateNormal(fullHtml, "Saving Throw", storedSpell.savingThrow);
    }
    if (hasValue(storedSpell.spellResistance)) {
      fullHtml = appendTemplateNormal(fullHtml, "Spell resistance", storedSpell.spellResistance);
    }
    if (hasValue(storedSpell.description)) {
      var _iteratorNormalCompletion3 = true;
      var _didIteratorError3 = false;
      var _iteratorError3 = undefined;

      try {
        for (var _iterator3 = storedSpell.description.split("\n")[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
          var desc = _step3.value;

          fullHtml = appendTemplateBody(fullHtml, desc);
        }
      } catch (err) {
        _didIteratorError3 = true;
        _iteratorError3 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion3 && _iterator3.return) {
            _iterator3.return();
          }
        } finally {
          if (_didIteratorError3) {
            throw _iteratorError3;
          }
        }
      }
    }
    if (hasValue(storedSpell.materialComponent)) {
      for (var prop in storedSpell.materialComponent) {
        if (Object.prototype.hasOwnProperty.call(storedSpell.materialComponent, prop)) {
          fullHtml = appendTemplateBodyWithTitle(fullHtml, prop, storedSpell.materialComponent[prop]);
        }
      }
    }
    if (hasValue(storedSpell.focus)) {
      for (var prop in storedSpell.focus) {
        if (Object.prototype.hasOwnProperty.call(storedSpell.focus, prop)) {
          fullHtml = appendTemplateBodyWithTitle(fullHtml, prop, storedSpell.focus[prop]);
        }
      }
    }
    if (hasValue(storedSpell.xpCost)) {
      fullHtml = appendTemplateBodyWithTitle(fullHtml, "XP Cost", storedSpell.xpCost);
    }

    fullHtml += "</div>";

    var deleteTemplate = document.querySelector("#spell-card-delete").innerHTML;
    deleteTemplate = deleteTemplate.replace("{{spell-id}}", storedId);

    fullHtml += deleteTemplate;
    //fullHtml += document.querySelector("#spell-card-use").innerHTML
    fullHtml += "</div>";
    document.getElementById("spells").innerHTML += fullHtml;
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