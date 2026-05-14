(function () {
  'use strict';

  /**
   * Secção "Como funciona": sempre lista empilhada (cartões).
   * O mapa horizontal com scroll / mascote foi desativado em todas as resoluções.
   */
  window.RF_initProcessSection = function () {
    var section = document.getElementById('como-funciona');
    if (!section) return;
    section.classList.add('process-phase--stacked');
  };
})();
