/* ============================================================
   Navegação dos slides da oficina (versão sem manifesto).
   ← →  ou  PageUp/PageDown  ou  espaço   trocam de slide
   Home / End                             primeiro / último
   Clique nas metades da tela             anterior / próximo
   ============================================================ */

(function () {
  "use strict";

  var slides = Array.prototype.slice.call(document.querySelectorAll(".slide"));
  if (!slides.length) return;

  var atual = 0;
  var total = slides.length;
  var etiqueta = document.body.dataset.etiqueta || "";

  /* mantém o slide 1280x720 inteiro na tela */
  function escalar() {
    var margem = 70; /* espaço da barra inferior */
    var f = Math.min(window.innerWidth / 1280, (window.innerHeight - margem) / 720);
    slides.forEach(function (s) { s.style.transform = "scale(" + f + ")"; });
  }

  /* itens .surge do slide: aparecem um por vez antes de trocar de slide */
  function itens(s) { return Array.prototype.slice.call(s.querySelectorAll(".surge")); }

  /* para trás, o slide chega com todos os itens à mostra; para a frente, sem nenhum */
  function mostrar(i, voltando) {
    var anterior = atual;
    atual = Math.max(0, Math.min(total - 1, i));
    if (atual !== anterior || voltando === undefined) {
      itens(slides[atual]).forEach(function (el) { el.classList.toggle("visivel", !!voltando); });
    }
    slides.forEach(function (s, k) { s.classList.toggle("ativo", k === atual); });
    var c = document.getElementById("contador");
    if (c) c.textContent = (atual + 1) + " / " + total;
    if (history.replaceState) history.replaceState(null, "", "#" + (atual + 1));
  }

  function proximo() {
    var escondido = itens(slides[atual]).filter(function (el) { return !el.classList.contains("visivel"); })[0];
    if (escondido) { escondido.classList.add("visivel"); return; }
    mostrar(atual + 1, false);
  }

  function anterior() {
    var visiveis = itens(slides[atual]).filter(function (el) { return el.classList.contains("visivel"); });
    if (visiveis.length) { visiveis[visiveis.length - 1].classList.remove("visivel"); return; }
    mostrar(atual - 1, true);
  }

  document.addEventListener("keydown", function (e) {
    switch (e.key) {
      case "ArrowRight": case "PageDown": case " ": proximo(); e.preventDefault(); break;
      case "ArrowLeft":  case "PageUp":            anterior(); e.preventDefault(); break;
      case "Home": mostrar(0, false); e.preventDefault(); break;
      case "End":  mostrar(total - 1, true); e.preventDefault(); break;
    }
  });

  document.querySelector(".palco").addEventListener("click", function (e) {
    if (e.clientX < window.innerWidth * 0.32) anterior(); else proximo();
  });

  /* rodapé: a capa mantém o do HTML; os outros recebem a paginação e a etiqueta */
  slides.forEach(function (s, k) {
    if (k === 0) return;
    var r = s.querySelector(".rodape");
    if (r) r.innerHTML = "<span>" + (k + 1) + "/" + total + "</span><span>" + etiqueta + "</span>";
  });

  var barra = document.getElementById("barra");
  if (barra) {
    barra.innerHTML =
      '<span class="titulo">' + document.title + "</span>" +
      '<a href="index.html">menu</a>' +
      '<a href="downloads/oficina-steam-slides.pdf" download>baixar PDF</a>' +
      '<span class="contador" id="contador"></span>';
  }

  window.addEventListener("resize", escalar);
  escalar();
  var inicial = parseInt(window.location.hash.replace("#", ""), 10);
  mostrar(isNaN(inicial) ? 0 : inicial - 1);
})();
