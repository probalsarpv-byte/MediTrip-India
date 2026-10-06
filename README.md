# MediTrip India — Production V2.1.3

## Core database
- Hospitals: 127
- Public doctors: 1040
- Fertility / ART centres: 100
- Fertility specialists: 201
- Medical regions: 6
- Medical-travel phrases: 500

## V2.1.3 changes
### UI / search
- Home quick actions use a balanced responsive grid.
- Desktop hero typography reduced and search bar centered/widened.
- Desktop nav collapses earlier to avoid crowding.
- Removed conflicting mobile hero rules.
- Search now returns up to 5 results **per category** instead of globally truncating at 20.
- Added basic typo-tolerant matching.
- Doctor directory uses medical-region filters and Load More.
- Delhi/NCR, Bengaluru/Bangalore, Kolkata/Howrah and Mumbai/Navi Mumbai are grouped into canonical medical regions.
- Mumbai added to Medical Cities.
- Hospital profile is photo-aware when a source image exists.

### My Medical Trip
- Readiness score
- Trip snapshot: destination, travel date, appointment, selected hospital, attendant
- 12-item medical travel checklist
- Local notes
- Saved hospitals
- Quick links to cost, visa, language and emergency
- Printable travel pack
- Data remains local to the browser

### Medical Visa
- Bangladesh → India medical visa workflow
- M1/M2/M3/M4 category cards
- Interactive patient document checklist
- Current IVAC urgent-medical-slot advisory, checked 2026-10-06
- Official Bangladesh visa application and IVAC appointment links
- IVAC fee / scam warning
- Hospital-change / FRRO warning

### Emergency
- One-tap India emergency number 112
- Nearest emergency-hospital map search
- Local emergency medical card
- Full-screen “Show to staff” view
- Medical red-flag guide
- Secondary 108 / 102 information
- Bangladesh High Commission New Delhi + Kolkata mission contacts
- Saved hospital call/map shortcuts

## Important
Visa and emergency information can change. V2.1.3 exposes the official source links and `lastVerified` dates so users can re-check current rules.
