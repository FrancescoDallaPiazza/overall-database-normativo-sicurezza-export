# Database Normativo Sicurezza — esportazione pubblica

Stato delle norme di salute e sicurezza sul lavoro monitorate da Overall Group S.r.l.:
quali sono verificate alla fonte, quando, e se c'è una variazione non ancora recepita.
Si aggiorna ogni lunedì in automatico. **Non contiene il testo delle norme**, solo il loro
stato di verifica.

| File | Contenuto |
|---|---|
| `rmn.json` | Le norme con il campo «Uso a valle»: `utilizzabile`, `con_riserva`, `non_utilizzabile`, `archivio` |
| `controlla.js` | Il controllo che le skill lanciano prima di produrre un documento |

## Uso dalle skill

```bash
git clone --depth 1 https://github.com/FrancescoDallaPiazza/overall-database-normativo-sicurezza-export /home/claude/db-sicurezza
node /home/claude/db-sicurezza/controlla.js S-001 S-002 S-003
```

Exit code: `0` procedere · `2` avvisare e chiedere · `1` fermarsi.

Questo repository è una copia: **non si modifica a mano**. La fonte è un repository privato;
l'esportazione arriva qui con `scripts/pubblica.py` a ogni ciclo di monitoraggio.
