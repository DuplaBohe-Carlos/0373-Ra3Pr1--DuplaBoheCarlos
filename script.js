// =============================================================
// Calculadora de notes d'alumnes
// Fórmula: Nota final = Examen*0.6 + Pràctiques*0.3 + Actitud*0.1
// Aprovat >= 5, Suspès < 5
// =============================================================
 
// --- Array global d'alumnes ---
const alumnes = [];
 
// --- Referències al DOM ---
const formulari      = document.getElementById('formulariAlumne');
const inputNom       = document.getElementById('nom');
const inputExamen    = document.getElementById('examen');
const inputPractiques = document.getElementById('practiques');
const inputActitud   = document.getElementById('actitud');
const missatgeDiv    = document.getElementById('missatge');
const cosTaula       = document.getElementById('cosTaula');
const botoOrdenarAsc  = document.getElementById('ordenarAsc');
const botoOrdenarDesc = document.getElementById('ordenarDesc');
 
// =============================================================
// VALIDACIÓ
// Comprova cada camp i retorna un missatge d'error o null
// =============================================================
 
/**
 * Valida tots els camps del formulari.
 * @param {string} nom
 * @param {string} examen
 * @param {string} practiques
 * @param {string} actitud
 * @returns {string|null} Missatge d'error o null si tot és correcte
 */
function validarCamps(nom, examen, practiques, actitud) {
  if (nom.trim() === '') {
    return 'El nom de l\'alumne no pot estar buit.';
  }
 
  if (examen === '') {
    return 'La nota de l\'examen no pot estar buida.';
  }
  if (practiques === '') {
    return 'La nota de les pràctiques no pot estar buida.';
  }
  if (actitud === '') {
    return 'La nota d\'actitud no pot estar buida.';
  }
 
  const notaExamen     = parseFloat(examen);
  const notaPractiques = parseFloat(practiques);
  const notaActitud    = parseFloat(actitud);
 
  if (isNaN(notaExamen) || notaExamen < 0 || notaExamen > 10) {
    return 'La nota de l\'examen ha de ser un número entre 0 i 10.';
  }
  if (isNaN(notaPractiques) || notaPractiques < 0 || notaPractiques > 10) {
    return 'La nota de les pràctiques ha de ser un número entre 0 i 10.';
  }
  if (isNaN(notaActitud) || notaActitud < 0 || notaActitud > 10) {
    return 'La nota d\'actitud ha de ser un número entre 0 i 10.';
  }
 
  return null; // Cap error
}
 
// =============================================================
// CÀLCUL
// =============================================================
 
/**
 * Calcula la nota final amb la fórmula 60/30/10.
 * @param {number} examen
 * @param {number} practiques
 * @param {number} actitud
 * @returns {number} Nota final arrodonida a 2 decimals
 */
function calcularNotaFinal(examen, practiques, actitud) {
  const notaFinal = examen * 0.6 + practiques * 0.3 + actitud * 0.1;
  return Math.round(notaFinal * 100) / 100;
}
 
/**
 * Determina si l'alumne ha aprovat o suspès.
 * @param {number} notaFinal
 * @returns {string} 'Aprovat' o 'Suspès'
 */
function determinarEstat(notaFinal) {
  return notaFinal >= 5 ? 'Aprovat' : 'Suspès';
}
 
// =============================================================
// CREACIÓ D'OBJECTE ALUMNE
// =============================================================
 
/**
 * Crea un objecte alumne amb totes les seves propietats.
 * @param {string} nom
 * @param {number} examen
 * @param {number} practiques
 * @param {number} actitud
 * @returns {Object} Objecte alumne
 */
function crearAlumne(nom, examen, practiques, actitud) {
  const notaFinal = calcularNotaFinal(examen, practiques, actitud);
  return {
    nom:        nom.trim(),
    examen:     examen,
    practiques: practiques,
    actitud:    actitud,
    notaFinal:  notaFinal,
    estat:      determinarEstat(notaFinal)
  };
}
 
// =============================================================
// MOSTRAR MISSATGES
// =============================================================
 
/**
 * Mostra un missatge d'error o d'èxit a l'àrea de missatges.
 * @param {string} text
 * @param {'error'|'correcte'} tipus
 */
function mostrarMissatge(text, tipus) {
  missatgeDiv.textContent = text;
  missatgeDiv.className   = tipus;
}
 
/** Esborra el missatge actual */
function esborrarMissatge() {
  missatgeDiv.textContent = '';
  missatgeDiv.className   = '';
}
 
// =============================================================
// RENDERITZAR TAULA
// =============================================================
 
/**
 * Renderitza la llista d'alumnes a la taula del DOM.
 * @param {Array} llistaAlumnes - Array d'objectes alumne a mostrar
 */
function renderitzarTaula(llistaAlumnes) {
  cosTaula.innerHTML = ''; // Buidar contingut anterior
 
  llistaAlumnes.forEach(function (alumne) {
    const fila = document.createElement('tr');
 
    const classeEstat = alumne.estat === 'Aprovat' ? 'aprovat' : 'suspes';
 
    fila.innerHTML = `
      <td>${alumne.nom}</td>
      <td>${alumne.examen.toFixed(2)}</td>
      <td>${alumne.practiques.toFixed(2)}</td>
      <td>${alumne.actitud.toFixed(2)}</td>
      <td>${alumne.notaFinal.toFixed(2)}</td>
      <td class="${classeEstat}">${alumne.estat}</td>
    `;
 
    cosTaula.appendChild(fila);
  });
}
 
// =============================================================
// ORDENACIÓ
// =============================================================
 
/**
 * Ordena l'array d'alumnes per nota final i re-renderitza la taula.
 * @param {'asc'|'desc'} ordre
 */
function ordenarAlumnes(ordre) {
  const copiaOrdenada = [...alumnes].sort(function (a, b) {
    return ordre === 'asc'
      ? a.notaFinal - b.notaFinal
      : b.notaFinal - a.notaFinal;
  });
 
  renderitzarTaula(copiaOrdenada);
}
 
// =============================================================
// AFEGIR ALUMNE (gestió del formulari)
// =============================================================
 
/**
 * Gestiona l'enviament del formulari: valida, crea l'alumne,
 * l'afegeix a l'array i actualitza la taula.
 * @param {Event} event
 */
function afegirAlumne(event) {
  event.preventDefault();
  esborrarMissatge();
 
  const nom        = inputNom.value;
  const examen     = inputExamen.value;
  const practiques = inputPractiques.value;
  const actitud    = inputActitud.value;
 
  // Validació
  const error = validarCamps(nom, examen, practiques, actitud);
  if (error) {
    mostrarMissatge(error, 'error');
    return;
  }
 
  // Creació de l'alumne i inserció a l'array
  const alumne = crearAlumne(
    nom,
    parseFloat(examen),
    parseFloat(practiques),
    parseFloat(actitud)
  );
  alumnes.push(alumne);
 
  // Actualitzar la taula i mostrar confirmació
  renderitzarTaula(alumnes);
  mostrarMissatge(`Alumne "${alumne.nom}" afegit amb nota final ${alumne.notaFinal.toFixed(2)}.`, 'correcte');
 
  // Netejar el formulari
  formulari.reset();
}
 
// =============================================================
// ESDEVENIMENTS
// =============================================================
 
formulari.addEventListener('submit', afegirAlumne);
 
botoOrdenarAsc.addEventListener('click', function () {
  ordenarAlumnes('asc');
});
 
botoOrdenarDesc.addEventListener('click', function () {
  ordenarAlumnes('desc');
});