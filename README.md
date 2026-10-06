# MediTrip India — Production V2.1.2 Full Doctor Expansion

## Database included
- **127 hospitals**
- **1093 doctor records**
- **100 National ART Registry-tracked fertility/ART centres**
- **201 fertility specialist directory records**
- **24 fertility treatment/service categories**
- **500 multilingual medical-travel phrases**
- Medical cities: 5
- Nearby stay records: 0

## Doctor sources
This build combines:
1. Existing official hospital / doctor source-linked records.
2. A large structured Practo-derived doctor dataset for Bangalore, Delhi, Chennai and Mumbai.
3. Current Practo directory results for Kolkata doctors.

UI distinguishes:
- Official Doctor Listing / Official Hospital Source
- Practo Directory / directory-derived record

A directory record is not labelled as an individual official hospital profile unless an individual official profile URL is actually present.

## Photos
The UI is now photo-aware for both doctors and hospitals.
- If an exact source-linked image URL is present, it is displayed.
- If the image is missing or fails to load, the medical icon automatically appears.
- Existing verified identity metadata for Dr Naresh Trehan remains included.
- Directory records without an exact image URL are not assigned a guessed face.

## Fertility
- ART centres: 100
- Fertility specialists: 201
- Search + city filters
- Infertility Smart Match
- ART Registry source links

## Performance
Doctor directory renders a filtered first 120 results at a time rather than mounting more than one thousand cards simultaneously.

Upload the package contents to the GitHub repository root.
