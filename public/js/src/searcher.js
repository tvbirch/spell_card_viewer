import * as shared from "shared.js";

function addSpellToBook(id) {
  hoodie.store.withIdPrefix("spell_").find(id).then(function (spell) {
    console.log(spell);
    hoodie.store.withIdPrefix("spellbook_")
    .findAll()
    .then(function(storedSpells) {
      let found = false;
      for (let storedSpell of storedSpells) {
          if (storedSpell.id === spell.id) {
            found = true;
            break;
          }
      }

      if (found === false) {
        console.log("adding spell with id " + spell.id)
        hoodie.store.withIdPrefix("spellbook_").add({ id: spell.id });
      } else {
        console.log("spell with id " + spell.id + " already exist")
      }
      console.log("Spells updated");
    });
  }).catch(function (error) {
      alert(error)
  });
  
}

function searchForSpells() {
  resetSpellPage();
  let name = document.getElementById("search-spell-name").value.toLowerCase();
  let casterClass = document.getElementById("search-spell-class").value.toLowerCase();
  
  hoodie.store
  .withIdPrefix("spell_")
  .findAll()
  .then(function(spells) {
    let currentSpellsAdded = 0;
    for (let spell of spells) {
      if (currentSpellsAdded > 10) {
        break;
      }
      if (name !== "" && !spell.name.toLowerCase().includes(name)) {
        continue;
      } else if (casterClass !== "") {
        let classMatch = false;
        for (var prop in spell.levelByClass) {
          if (Object.prototype.hasOwnProperty.call(spell.levelByClass, prop)) {
            if(prop.toLowerCase().includes(casterClass)) {
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
  });
}

async function loadSpells(url) {
  //let url = 'https://raw.githubusercontent.com/tvbirch/spell_card_viewer/master/public/resources/spells.json';
  fetch(url).then(res => res.json())
  .then((spells) => {
    hoodie.store.withIdPrefix("spell_")
      .findAll()
      .then(function(storedSpeels) {
        for (let currentSpell of spells) {
          let found = false;
          for (let storedSpell of storedSpeels) {
              if (storedSpell.id === currentSpell.id) {
                found = true;
                break;
              }
          }
  
          if (found === false) {
            console.log("adding spell with id " + currentSpell.id)
            hoodie.store.withIdPrefix("spell_").add(currentSpell);
          } else {
            console.log("spell with id " + currentSpell.id + " already exist")
          }
        }      
        console.log("Spells updated");
      });
  })
  .catch(err => { console.log(':('); });
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

  hoodie.store.withIdPrefix("spellurl_").findAll().then(function (spellUrl) {
    var jsonUrl = "";
    if (spellUrl.length === 0) {
      jsonUrl = prompt("Please enter spell list URK", "https://raw.githubusercontent.com");
      hoodie.store.withIdPrefix("spellurl_").add({url: jsonUrl});
    } else {
      jsonUrl = spellUrl[0].url;
    }
    loadSpells(jsonUrl);
  });
}

init();

function getIndexTemplate() {
  let template = document.querySelector("#item-row").innerHTML;
  return template;
}

function addSpellToPage(spell) {
  if (document.getElementById(spell._id)) return;//skip items already added to the DOM
  let template = getIndexTemplate();
  template = template.replace("{{name}}", spell.name);
  template = template.replace("{{row-id}}", spell._id);
  template = template.replace("{{item-id}}", spell._id);
  document.getElementById("spell-table").tBodies[0].innerHTML += template;
}

function resetSpellPage() {
  document.getElementById("spell-table").tBodies[0].innerHTML = "";
}