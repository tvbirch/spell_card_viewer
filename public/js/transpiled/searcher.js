"use strict";

System.register(["shared.js"], function (_export, _context) {
  "use strict";

  var shared;


  function showSnackBarMessage(msg) {
    var snackbarContainer = document.querySelector("#toast");
    snackbarContainer.MaterialSnackbar.showSnackbar({
      message: msg
    });
  }

  function addSpellToBook(id) {
    hoodie.store.withIdPrefix("spell_").find(id).then(function (spell) {
      hoodie.store.withIdPrefix("spellbook_").findAll().then(function (storedSpells) {
        var found = false;
        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
          for (var _iterator = storedSpells[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var storedSpell = _step.value;

            if (storedSpell.id === spell.id) {
              found = true;
              break;
            }
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

        if (found === false) {
          hoodie.store.withIdPrefix("spellbook_").add({ id: spell.id });
          showSnackBarMessage(spell.name + " added to spellbook");
        } else {
          showSnackBarMessage(spell.name + " is already in spellbook");
        }
        console.log("Spells updated");
      });
    }).catch(function (error) {
      alert(error);
    });
  }

  function searchForSpells() {
    resetSpellPage();
    var name = document.getElementById("search-spell-name").value.toLowerCase();
    var casterClass = document.getElementById("search-spell-class").value.toLowerCase();

    hoodie.store.withIdPrefix("spell_").findAll().then(function (spells) {
      var currentSpellsAdded = 0;
      var _iteratorNormalCompletion2 = true;
      var _didIteratorError2 = false;
      var _iteratorError2 = undefined;

      try {
        for (var _iterator2 = spells[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
          var spell = _step2.value;

          if (currentSpellsAdded > 10) {
            break;
          }
          if (name !== "" && !spell.name.toLowerCase().includes(name)) {
            continue;
          } else if (casterClass !== "") {
            var classMatch = false;
            for (var prop in spell.levelByClass) {
              if (Object.prototype.hasOwnProperty.call(spell.levelByClass, prop)) {
                if (prop.toLowerCase().includes(casterClass)) {
                  classMatch = true;
                  break;
                }
              }
            }
            if (!classMatch) {
              continue;
            }
          }
          addSpellToPage(spell);
          currentSpellsAdded++;
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
    });
  }

  async function loadSpells(url) {
    //let url = 'https://raw.githubusercontent.com/tvbirch/spell_card_viewer/master/public/resources/spells.json';
    fetch(url).then(function (res) {
      return res.json();
    }).then(function (spells) {
      hoodie.store.withIdPrefix("spell_").findAll().then(function (storedSpeels) {
        var _iteratorNormalCompletion3 = true;
        var _didIteratorError3 = false;
        var _iteratorError3 = undefined;

        try {
          for (var _iterator3 = spells[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
            var currentSpell = _step3.value;

            var found = false;
            var _iteratorNormalCompletion4 = true;
            var _didIteratorError4 = false;
            var _iteratorError4 = undefined;

            try {
              for (var _iterator4 = storedSpeels[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
                var storedSpell = _step4.value;

                if (storedSpell.id === currentSpell.id) {
                  found = true;
                  break;
                }
              }
            } catch (err) {
              _didIteratorError4 = true;
              _iteratorError4 = err;
            } finally {
              try {
                if (!_iteratorNormalCompletion4 && _iterator4.return) {
                  _iterator4.return();
                }
              } finally {
                if (_didIteratorError4) {
                  throw _iteratorError4;
                }
              }
            }

            if (found === false) {
              console.log("adding spell with id " + currentSpell.id);
              hoodie.store.withIdPrefix("spell_").add(currentSpell);
            } else {
              console.log("spell with id " + currentSpell.id + " already exist");
            }
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

        console.log("Spells updated");
      });
    }).catch(function (err) {
      console.log(':(');
    });
  }

  function init() {

    //shared.updateDOMWithLoginStatus();
    document.getElementById("search-spell").addEventListener("click", searchForSpells);

    window.pageEvents = {
      addSpellToBook: addSpellToBook
    };

    hoodie.store.withIdPrefix("spellurl_").findAll().then(function (spellUrl) {
      var jsonUrl = "";
      if (spellUrl.length === 0) {
        jsonUrl = prompt("Please enter spell list URK", "https://raw.githubusercontent.com");
        hoodie.store.withIdPrefix("spellurl_").add({ url: jsonUrl });
      } else {
        jsonUrl = spellUrl[0].url;
      }
      loadSpells(jsonUrl);
    });
  }

  function getIndexTemplate() {
    var template = document.querySelector("#item-row").innerHTML;
    return template;
  }

  function addSpellToPage(spell) {
    if (document.getElementById(spell._id)) return; //skip items already added to the DOM
    var template = getIndexTemplate();
    template = template.replace("{{name}}", spell.name);
    template = template.replace("{{row-id}}", spell._id);
    template = template.replace("{{item-id}}", spell._id);
    document.getElementById("spell-table").tBodies[0].innerHTML += template;
  }

  function resetSpellPage() {
    document.getElementById("spell-table").tBodies[0].innerHTML = "";
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