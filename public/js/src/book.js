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

function deleteSpell(spellId) {
  let row = document.getElementById(spellId);
  row.parentNode.removeChild(row);
  
  hoodie.store.withIdPrefix("spellbook_").remove(spellId);
}

function init() {
  //shared.updateDOMWithLoginStatus();
  //hoodie.store.withIdPrefix("item").on("add", addItemToPage);
  //hoodie.store.withIdPrefix("item").on("remove", deleteRow);

  //document.getElementById("search-spell").addEventListener("click", searchForSpells);

  //retrieve items on the current list and display on the page
  hoodie.store
    .withIdPrefix("spellbook_")
    .findAll()
    .then(function(spells) {
      for (let spellId of spells) {
        hoodie.store.withIdPrefix("spell_")
        .findAll()
        .then(function(storedSpells) {
          let found = false;
          let storedSpellFound = null;
          for (let storedSpell of storedSpells) {
              if (storedSpell.id === spellId.id) {
                found = true;
                storedSpellFound = storedSpell;
                break;
              }
          }

          if (found === false) {
            console.log("spell does not exist!");
          } else {
            console.log("spell with id " + spellId.id + " found");
            addSpellToPage(storedSpellFound, spellId._id)
          }
        });
      }
    });

    window.pageEvents = {
  //    addSpell: addSpell,
      deleteSpell: deleteSpell
    };
}


init();

function getIndexTemplateHeader() {
  let template = document.querySelector("#spell-col-header").innerHTML;
  return template;
}

function getIndexTemplateNormal() {
  let template = document.querySelector("#spell-col-normal").innerHTML;
  return template;
}

function getIndexTemplateBody() {
  let template = document.querySelector("#spell-col-body").innerHTML;
  return template;
}

function getIndexTemplateBodyWithTitle() {
  let template = document.querySelector("#spell-col-body-with-title").innerHTML;
  return template;
}


function appendTemplateHeader(html, text) {
  let template = getIndexTemplateHeader();
  template = template.replace("{{text}}", text);

  html += template;
  return html;
}

function appendTemplateNormal(html, title, text) {
  let template = getIndexTemplateNormal();
  template = template.replace("{{text}}", text);
  template = template.replace("{{title}}", title);

  html += template;
  return html;
}

function appendTemplateBody(html, text) {
  let template = getIndexTemplateBody();
  template = template.replace("{{text}}", text);

  html += template;
  return html;
}

function appendTemplateBodyWithTitle(html, title, text) {
  let template = getIndexTemplateBodyWithTitle();
  template = template.replace("{{text}}", text);
  template = template.replace("{{title}}", title);

  html += template;
  return html;
}

function hasValue(prop) {
  if(prop !== null && prop !== "") {
    return true;
  }
  return false;
}

function addSpellToPage(storedSpell, storedId) {
  if (document.getElementById(storedId)) return;//skip items already added to the DOM
  let fullHtml = "<div id=\""+storedId+"\" class=\"mdl-card-collapsable mdl-card mdl-shadow--2dp\">";
  fullHtml += "<div class=\"mdl-card__title\"><h2 class=\"mdl-card__title-text\">"+storedSpell.name+"</h2></div><div class=\"mdl-card__supporting-text\">" 
    
  if(hasValue(storedSpell.type)) {
    fullHtml = appendTemplateHeader(fullHtml, storedSpell.type);
  }
  if(hasValue(storedSpell.level)) {
    fullHtml = appendTemplateNormal(fullHtml, "Level", storedSpell.level);
  }
  if(hasValue(storedSpell.components)) {
    fullHtml = appendTemplateNormal(fullHtml, "Components", storedSpell.components);
  }
  if(hasValue(storedSpell.castingTime)) {
    fullHtml = appendTemplateNormal(fullHtml, "Casting Time", storedSpell.castingTime);
  }
  if(hasValue(storedSpell.range)) {
    fullHtml = appendTemplateNormal(fullHtml, "Range", storedSpell.range);
  }
  if(hasValue(storedSpell.targetType)) {
    fullHtml = appendTemplateNormal(fullHtml, storedSpell.targetType, storedSpell.targetDescription);
  }
  if(hasValue(storedSpell.duration)) {
    fullHtml = appendTemplateNormal(fullHtml, "Duration", storedSpell.duration);
  }
  if(hasValue(storedSpell.savingThrow)) {
    fullHtml = appendTemplateNormal(fullHtml, "Saving Throw", storedSpell.savingThrow);
  }
  if(hasValue(storedSpell.spellResistance)) {
    fullHtml = appendTemplateNormal(fullHtml, "Spell resistance", storedSpell.spellResistance);
  }
  if(hasValue(storedSpell.description)) {
    for(let desc of storedSpell.description.split("\n")) {
      fullHtml = appendTemplateBody(fullHtml, desc);
    }
  }
  if(hasValue(storedSpell.materialComponent)) {
    for (var prop in storedSpell.materialComponent) {
      if (Object.prototype.hasOwnProperty.call(storedSpell.materialComponent, prop)) {
        fullHtml = appendTemplateBodyWithTitle(fullHtml, prop, storedSpell.materialComponent[prop]);
      }
    }
  }
  if(hasValue(storedSpell.focus)) {
    for (var prop in storedSpell.focus) {
      if (Object.prototype.hasOwnProperty.call(storedSpell.focus, prop)) {
        fullHtml = appendTemplateBodyWithTitle(fullHtml, prop, storedSpell.focus[prop]);
      }
    }
  }
  if(hasValue(storedSpell.xpCost)) {
    fullHtml = appendTemplateBodyWithTitle(fullHtml, "XP Cost", storedSpell.xpCost);

  }

  fullHtml += "</div>";

  let deleteTemplate = document.querySelector("#spell-card-delete").innerHTML;
  deleteTemplate = deleteTemplate.replace("{{spell-id}}", storedId);

  fullHtml += deleteTemplate; 
  //fullHtml += document.querySelector("#spell-card-use").innerHTML
  fullHtml += "</div>";
  document.getElementById("spells").innerHTML += fullHtml;
}
