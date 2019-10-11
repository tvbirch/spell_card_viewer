"use strict";

System.register(["shared.js"], function (_export, _context) {
  "use strict";

  var shared;


  function addSpellToBook(id) {
    console.log("addSpellToBook" + id);
  }

  function searchForSpells() {
    var name = document.getElementById("search-spell-name").value;
    var casterClass = document.getElementById("search-spell-class").value;
    var level = document.getElementById("search-spell-level").value;

    hoodie.store.withIdPrefix("spell").findAll().then(function (spells) {
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = spells[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var spell = _step.value;


          addSpellToPage(spell);
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
  }

  async function loadSpells() {
    var url = 'https://raw.githubusercontent.com/tvbirch/spell_card_viewer/master/public/resources/spells.json';
    fetch(url).then(function (res) {
      return res.json();
    }).then(function (spells) {
      hoodie.store.withIdPrefix("spell").findAll().then(function (storedSpeels) {
        var _iteratorNormalCompletion2 = true;
        var _didIteratorError2 = false;
        var _iteratorError2 = undefined;

        try {
          for (var _iterator2 = spells[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
            var currentSpell = _step2.value;

            var found = false;
            var _iteratorNormalCompletion3 = true;
            var _didIteratorError3 = false;
            var _iteratorError3 = undefined;

            try {
              for (var _iterator3 = storedSpeels[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
                var storedSpell = _step3.value;

                if (storedSpell.id === currentSpell.id) {
                  found = true;
                  break;
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

            if (found === false) {
              console.log("adding spell with id " + currentSpell.id);
              hoodie.store.withIdPrefix("spell").add(currentSpell);
            } else {
              console.log("spell with id " + currentSpell.id + " already exist");
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

        console.log("Spells updated");
      });
    }).catch(function (err) {
      console.log(':(');
    });
  }

  function init() {
    shared.updateDOMWithLoginStatus();
    document.getElementById("search-spell").addEventListener("click", searchForSpells);

    window.pageEvents = {
      addSpellToBook: addSpellToBook,
      closeLogin: shared.closeLoginDialog,
      showLogin: shared.showLoginDialog,
      closeRegister: shared.closeRegisterDialog,
      showRegister: shared.showRegisterDialog,
      login: shared.login,
      register: shared.register,
      signout: shared.signOut
    };

    loadSpells();
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
  return {
    setters: [function (_sharedJs) {
      shared = _sharedJs;
    }],
    execute: function () {
      init();
    }
  };
});