# MediTrip India — Production V2.1.2 Corrected

## Corrected production database
- Hospitals: **127**
- Public doctor records: **1040**
- Quarantined doctor records: **53**
- Fertility / ART centres: **100**
- Fertility specialist records: **201**
- Multilingual medical-travel phrases: **500**

## Corrections in this build
- Filled city for **46** hospital-linked doctor records from the linked hospital.
- Relabelled **1047** Practo-derived/current records as **Practo Directory Listing**.
- Directory/category links are no longer described as individual verified doctor profiles.
- Applied **13** specialty corrections where qualification clearly supported another specialty.
- Moved **53** conflicting imported doctor records out of the public database into `data/doctors.quarantine.json`.
- Hid **5** suspicious ₹0/₹99 doctor fee values pending review.
- Regenerated `offline-db.json` from the corrected production data.

## Source labels
The app distinguishes:
- Verified Official Profile — only when an individual official profile is explicitly confirmed.
- Official Doctor Listing — official hospital doctor-directory page.
- Official Hospital Source — source-linked hospital page.
- Practo Directory Listing — directory/category source; **individual doctor profile not verified in this record**.

## Data quality files
- `data/data-quality-report.json`
- `data/doctors.quarantine.json`
- `data/verification-log.json`

## Photos
The existing photo-aware UI remains:
- exact source-linked photo URL -> display photo
- missing/broken photo -> doctor/hospital SVG icon fallback
- no guessed face is inserted.

Upload the contents of this ZIP to the GitHub repository root.
