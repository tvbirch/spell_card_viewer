"use strict";

System.register(["shared.js"], function (_export, _context) {
  "use strict";

  var shared, selectedSpellRow, selectedSpellLevel;


  function searchForSpells() {
    resetSpellPage();
    var name = document.getElementById("search-spell-name").value.toLowerCase();
    var casterClass = document.getElementById("search-spell-class").value.toLowerCase();
    var casterLevel = document.getElementById("search-spell-level").value.toLowerCase();

    hoodie.store.withIdPrefix("spell_").findAll().then(function (spells) {
      var currentSpellsAdded = 0;
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = spells[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var spell = _step.value;

          if (currentSpellsAdded > 10) {
            break;
          }
          if (name !== "" && !spell.name.toLowerCase().includes(name)) {
            continue;
          } else if (casterClass !== "") {
            var classMatch = false;
            var levelMatch = false;
            for (var prop in spell.levelByClass) {
              if (Object.prototype.hasOwnProperty.call(spell.levelByClass, prop)) {
                if (prop.toLowerCase().includes(casterClass)) {
                  classMatch = true;
                  if (spell.levelByClass[prop] === casterLevel) {
                    levelMatch = true;
                  }
                  break;
                }
              }
            }
            if (!classMatch) {
              continue;
            }
            if (casterLevel !== "" && !levelMatch) {
              continue;
            }
          }
          addSpellToTable(spell);
          currentSpellsAdded++;
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

  function addSpellToTable(spell) {
    if (document.getElementById(spell._id)) return; //skip items already added to the DOM
    var template = document.querySelector("#spell-search-row").innerHTML;
    template = template.replace("{{name}}", spell.name);
    template = template.replace("{{row-id}}", spell._id);
    template = template.replace("{{item-id}}", spell._id);
    template = template.replace("{{show-spell-id}}", spell._id);
    template = template.replace("{{level}}", selectedSpellLevel);
    template = template.replace("{{row}}", selectedSpellRow);
    document.getElementById("spell-table").tBodies[0].innerHTML += template;
  }

  function resetSpellPage() {
    document.getElementById("spell-table").tBodies[0].innerHTML = "";
  }

  async function getSpellSlots() {
    return hoodie.store.withIdPrefix("spellslots_").findAll().then(function (spellSlots) {
      if (spellSlots.length == 0) {
        var spellSlotsToAdd = {
          level0: [],
          level1: [],
          level2: [],
          level3: [],
          level4: [],
          level5: [],
          level6: [],
          level7: [],
          level8: [],
          level9: []
        };
        hoodie.store.withIdPrefix("spellslots_").add(spellSlotsToAdd);
        return spellSlotsToAdd;
      } else {
        return spellSlots[0];
      }
    });
  }

  async function showSpell(spellId, backTarget) {
    var spell = await hoodie.store.withIdPrefix("spell_").find(spellId);
    addSpellToPage(spell, backTarget);
    show("spell-content");
  }

  async function addSpellSlot(level) {
    var slots = await getSpellSlots();
    slots["level" + level].push({
      spellId: null,
      used: false
    });
    hoodie.store.update(slots);
    appendSpellToSlotTemplate(level, slots["level" + level].length - 1, null, false);
  }

  async function setSpellInSlot(level, row, spellId) {
    var slots = await getSpellSlots();
    slots["level" + level][row].spellId = spellId;
    hoodie.store.update(slots);

    await appendSpellToSlotTemplate(level, row, spellId, slots["level" + level][row].used);

    show("spelltabs");
  }

  async function removeSpellSlot(level) {
    var slots = await getSpellSlots();
    if (slots["level" + level].length == 0) {
      return;
    }
    slots["level" + level].pop();
    hoodie.store.update(slots);
    var element = document.getElementById("spell-slots-table-row-" + level + "-" + slots["level" + level].length);
    element.parentNode.removeChild(element);
  }

  async function useSpellSlot(slot) {
    var doc = document.getElementById(slot);
    if (doc.classList.length > 0 && doc.classList.contains("spellDeactivated")) {
      doc.classList.remove("spellDeactivated");
    } else {
      doc.classList.add("spellDeactivated");
    }
    var slots = await getSpellSlots();
    var parts = slot.split("-");
    var row = parts[parts.length - 1];
    var level = parts[parts.length - 2];

    slots["level" + level][row].used = !slots["level" + level][row].used;
    hoodie.store.update(slots);
  }

  async function resetSpellSlot() {
    var slots = await getSpellSlots();
    for (var level = 0; level < 10; level++) {
      for (var row = 0; row < slots["level" + level].length; row++) {
        slots["level" + level][row].used = false;
        var doc = document.getElementById("spell-slots-table-row-" + level + "-" + row);
        if (doc.classList.length > 0 && doc.classList.contains("spellDeactivated")) {
          doc.classList.remove("spellDeactivated");
        }
      }
    }
    hoodie.store.update(slots);
  }

  function changeSpellSlot(slot) {
    var parts = slot.split("-");
    var row = parts[parts.length - 1];
    var level = parts[parts.length - 2];

    selectedSpellRow = row;
    selectedSpellLevel = level;
    show("spellsearcher");
  }

  function searchForSpellsCancel() {
    show("spelltabs");
  }

  function show(target) {
    var tabDoc = document.getElementById("spelltabs");
    var searcherDoc = document.getElementById("spellsearcher");
    var spellDoc = document.getElementById("spell-content");
    tabDoc.style.display = "none";
    searcherDoc.style.display = "none";
    spellDoc.style.display = "none";
    document.getElementById(target).style.display = "block";
  }

  function init() {
    populateSpellSlots();

    document.getElementById("search-spell").addEventListener("click", searchForSpells);
    document.getElementById("search-spell-cancel").addEventListener("click", searchForSpellsCancel);

    window.pageEvents = {
      addSpellSlot: addSpellSlot,
      removeSpellSlot: removeSpellSlot,
      useSpellSlot: useSpellSlot,
      changeSpellSlot: changeSpellSlot,
      showSpell: showSpell,
      setSpellInSlot: setSpellInSlot,
      show: show,
      resetSpellSlot: resetSpellSlot
    };
  }

  async function populateSpellSlots() {
    var slots = await getSpellSlots();

    for (var i = 0; i < 10; i++) {
      appendSpellSlotsTemplate(i);
      var spellsAtLevel = getSpellsAtLevel(slots, i);
      for (var j = 0; j < spellsAtLevel.length; j++) {
        await appendSpellToSlotTemplate(i, j, spellsAtLevel[j].spellId, spellsAtLevel[j].used);
      }
    }
  }

  function getSpellsAtLevel(slots, level) {
    if (level === 0) {
      return slots.level0;
    } else if (level === 1) {
      return slots.level1;
    } else if (level === 2) {
      return slots.level2;
    } else if (level === 3) {
      return slots.level3;
    } else if (level === 4) {
      return slots.level4;
    } else if (level === 5) {
      return slots.level6;
    } else if (level === 7) {
      return slots.level7;
    } else if (level === 8) {
      return slots.level8;
    } else {
      return slots.level9;
    }
  }

  function appendSpellSlotsTemplate(level) {
    var template = document.querySelector("#spell-slots-by-level").innerHTML;
    template = template.replace("{{level}}", level);
    template = template.replace("{{add-spell-slot-id}}", level);
    template = template.replace("{{remove-spell-slot-id}}", level);
    template = template.replace("{{table-id}}", "spell-slots-table-" + level);

    document.getElementById("scroll-tab-" + level).innerHTML += template;
  }

  async function appendSpellToSlotTemplate(slotLevel, rowId, spellId, isUsed) {
    var template = document.querySelector("#spell-slots-by-level-row").innerHTML;
    if (spellId === null) {
      template = template.replace("{{name}}", "Empty slot");
    } else {
      var spell = await hoodie.store.withIdPrefix("spell_").find(spellId);
      template = template.replace("{{name}}", spell.name);
    }
    template = template.replace("{{table-row-id}}", "spell-slots-table-row-" + slotLevel + "-" + rowId);
    template = template.replace("{{table-row-use-id}}", "spell-slots-table-row-" + slotLevel + "-" + rowId);
    template = template.replace("{{table-row-change-id}}", "spell-slots-table-row-" + slotLevel + "-" + rowId);
    template = template.replace("{{table-row-show-spell-id}}", spellId);
    if (isUsed === true) {
      template = template.replace("{{table-row-is-used-class}}", "spellDeactivated");
    } else {
      template = template.replace("{{table-row-is-used-class}}", "");
    }

    var doc = document.getElementById("spell-slots-table-" + slotLevel);
    if (doc.children[rowId] === undefined) {
      doc.innerHTML += template;
    } else {
      doc.children[rowId].innerHTML = template;
    }
  }

  function appendTemplateHeader(html, text) {
    var template = document.querySelector("#spell-col-header").innerHTML;
    template = template.replace("{{text}}", text);

    html += template;
    return html;
  }

  function appendTemplateNormal(html, title, text) {
    var template = document.querySelector("#spell-col-normal").innerHTML;
    template = template.replace("{{text}}", text);
    template = template.replace("{{title}}", title);

    html += template;
    return html;
  }

  function appendTemplateBody(html, text) {
    var template = document.querySelector("#spell-col-body").innerHTML;
    template = template.replace("{{text}}", text);

    html += template;
    return html;
  }

  function appendTemplateBodyWithTitle(html, title, text) {
    var template = document.querySelector("#spell-col-body-with-title").innerHTML;
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

  function addSpellToPage(storedSpell, goBackTarget) {
    var fullHtml = "<div class=\"mdl-card-collapsable mdl-card mdl-shadow--2dp\">";
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
      var _iteratorNormalCompletion2 = true;
      var _didIteratorError2 = false;
      var _iteratorError2 = undefined;

      try {
        for (var _iterator2 = storedSpell.description.split("\n")[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
          var desc = _step2.value;

          fullHtml = appendTemplateBody(fullHtml, desc);
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

    var backTemplate = document.querySelector("#spell-card-back").innerHTML;
    backTemplate = backTemplate.replace("{{target}}", goBackTarget);

    fullHtml += backTemplate;

    fullHtml += "</div>";
    document.getElementById("spell-content").innerHTML = fullHtml;
  }
  return {
    setters: [function (_sharedJs) {
      shared = _sharedJs;
    }],
    execute: function () {
      selectedSpellRow = 0;
      selectedSpellLevel = 0;
      init();
    }
  };
});