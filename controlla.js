#!/usr/bin/env node
/**
 * Controllo del Database Normativo Sicurezza, per le skill che producono documenti.
 *
 * Uso:   node controlla.js S-001 S-002 S-003
 * Legge rmn.json nella stessa cartella e dice, per ogni norma, se si può usare.
 *
 * Exit code:
 *   0  tutte utilizzabili                                   -> procedere
 *   2  qualcuna non verificata di recente, o database fermo -> avvisare e chiedere
 *   1  variazione non ancora recepita, abrogata o ID ignoto -> FERMARSI
 */
'use strict';
const fs = require('fs');
const path = require('path');

const GIORNI_MAX = 14; // l'agente gira ogni lunedi': oltre due settimane il monitoraggio e' fermo

const db = JSON.parse(fs.readFileSync(path.join(__dirname, 'rmn.json'), 'utf8'));
const ids = process.argv.slice(2);
if (!ids.length) {
  console.error('Uso: node controlla.js S-001 S-002 ...');
  process.exit(1);
}

let esito = 0;
const peggiora = (e) => { if (e === 1 || (e === 2 && esito === 0)) esito = e; };

const eta = Math.floor((Date.now() - new Date(db.meta.generato_il)) / 86400000);
console.log(`Database aggiornato il ${db.meta.generato_il} (${eta} giorni fa).`);
if (eta > GIORNI_MAX) {
  console.log(`⚠ Il monitoraggio non gira da più di ${GIORNI_MAX} giorni: lo stato qui sotto può essere vecchio.`);
  peggiora(2);
}

for (const id of ids) {
  const n = db.norme.find((x) => x.ID === id);
  if (!n) { console.log(`⛔ ${id}: non esiste nel database.`); peggiora(1); continue; }
  const nome = `${id} ${n['Identificativo norma']}`;
  const verifica = n['Data ultima verifica'] || 'mai';
  switch (n['Uso a valle']) {
    case 'utilizzabile':
      console.log(`✅ ${nome}: verificata il ${verifica}, nessun problema.`);
      break;
    case 'con_riserva':
      console.log(`⛔ ${nome}: VARIAZIONE RILEVATA E NON ANCORA RECEPITA. ${n.Note || ''}`);
      peggiora(1);
      break;
    case 'archivio':
      console.log(`⛔ ${nome}: ABROGATA O SOSTITUITA. ${n['Sostituisce / Sostituita da'] || n.Note || ''}`);
      peggiora(1);
      break;
    default:
      console.log(`⚠ ${nome}: non verificata di recente (ultima verifica: ${verifica}).`);
      peggiora(2);
  }
}
console.log(['ESITO: procedere.', 'ESITO: FERMARSI e mostrare all’utente le righe ⛔.',
  'ESITO: avvisare l’utente e chiedere se procedere.'][esito]);
process.exit(esito);
