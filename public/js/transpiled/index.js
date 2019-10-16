"use strict";

System.register(["shared.js"], function (_export, _context) {
  "use strict";

  var shared;


  function addSpellSlot(level) {
    console.log("add to: " + level);
  }

  function removeSpellSlot(level) {
    console.log("remove from: " + level);
  }

  function useSpellSlot(slot) {
    console.log("using spell slot: " + slot);
    var doc = document.getElementById(slot);
    if (doc.classList.length > 0 && doc.classList.contains("spellDeactivated")) {
      doc.classList.remove("spellDeactivated");
    } else {
      doc.classList.add("spellDeactivated");
    }
  }

  function init() {
    populateSpellSlots();

    window.pageEvents = {
      addSpellSlot: addSpellSlot,
      removeSpellSlot: removeSpellSlot,
      useSpellSlot: useSpellSlot
    };
  }

  function populateSpellSlots() {
    for (var i = 0; i < 10; i++) {
      appendSpellSlotsTemplate(i);
      for (var j = 0; j < 5; j++) {
        appendSpellToSlotTemplate(i, j);
      }
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

  function appendSpellToSlotTemplate(slotLevel, spellId) {
    var template = document.querySelector("#spell-slots-by-level-row").innerHTML;
    template = template.replace("{{name}}", "Test name");
    template = template.replace("{{table-row-id}}", "spell-slots-table-row-" + spellId);
    template = template.replace("{{table-row-use-id}}", "spell-slots-table-row-" + spellId);

    document.getElementById("spell-slots-table-" + slotLevel).innerHTML += template;
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