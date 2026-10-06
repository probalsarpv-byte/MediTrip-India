# Source policy and directory

Review date: **2026-10-06**. Coverage: **43 hospital records across 15 cities**, 69 doctor records, 11 stay listings, 15 treatment paths, 24 phrases and 99 source records. Counts remain below the full launch targets for stays, treatments and phrases; doctor count is progressing toward the 120–150 target. Imported entries marked `needs_review` require human review before any verified-status claim. Imported hospital and doctor records retain official source URLs; new Apollo and Fortis branch records link directly to official branch pages. The source snapshot is not an independent audit of each field. The official Apollo facilities directory is https://www.apollohospitals.com/facilities/hospitals; Medanta directory is https://www.medanta.org/contact-us; Fortis locations https://www.fortishealthcare.com/hospitals; Aster locations https://www.asterhospitals.in/hospitals. An empty specialty list means unconfirmed, not unavailable. Some imported specialty mappings and doctor source-page identity still require review. The “nearby hotels” action opens a Google Maps search with no paid API; hotel results, routes, distances, prices and availability are supplied by Maps and must be checked directly.

 Machine-readable records: `data/sources.json`, `data/source-ledger.csv`, and each provider record’s `sources[]`. These are manually curated snapshots, not a live database or commercial partner feed. This is a manual curated dataset, not a live database or commercial partner feed.

## Hospitals

| Branch | Official source |
|---|---|
| Apollo Multispeciality, EM Bypass, Kolkata | https://www.apollohospitals.com/hospitals/apollo-hospitals-embypass-kolkata |
| Fortis Hospital, Anandapur, Kolkata | https://www.fortishealthcare.com/location/fortis-hospital-anandapur-kolkata |
| Apollo Hospitals, Greams Road, Chennai | https://www.apollohospitals.com/hospitals/apollo-hospitals-greams-road-chennai |
| MIOT International, Chennai | https://www.miotinternational.com/contact-us/get-in-touch/ |
| Manipal Hospitals, Old Airport Road, Bengaluru | https://www.manipalhospitals.com/oldairportroad/contact-us/ |
| Max Super Speciality Hospital, Saket, Delhi | https://www.maxhealthcare.in/hospital-network/max-super-speciality-hospital-saket |

## Added official hospital locations

The expanded records cover Apollo locations in Delhi, Navi Mumbai, Lucknow, Visakhapatnam, Guwahati, Bhubaneswar, Pune, Gurugram, Noida, Indore, Chennai (Firstmed) and Bengaluru (Jayanagar), plus Medanta in Gurugram, Lucknow, Patna and Indore. Every exact branch source URL and retrieval date is in `data/source-ledger.csv` and each app record carries the source URL. City labels are localized; official street addresses retain their proper names in Latin script to keep Maps navigation usable.

## Accommodation and proximity

| Hotel | Relationship asserted | Official source |
|---|---|---|
| Lemon Tree Hotel Shimona, Chennai | Opposite MIOT, hotel site statement | https://www.lemontreehotels.com/chennai-hotels |
| Hotel Royal Orchid, Bengaluru | Near Manipal, hotel site statement | https://www.royalorchidhotels.com/hotel-royal-orchid-bangalore/overview |
| Hilton Garden Inn, New Delhi Saket | Short walk from Max, hotel site statement; app says nearby | https://www.hilton.com/en-gb/hotels/delskgi-hilton-garden-inn-new-delhi-saket/ |
| Hyatt Regency Kolkata | City-area option; hospital route unverified | https://www.hyatt.com/hyatt-regency/en-US/kolka-hyatt-regency-kolkata |
| Vivanta Kolkata EM Bypass | City-area option; hospital route unverified | https://www.vivantahotels.com/en-in/hotels/vivanta-kolkata |
| Hyatt Regency Chennai | City-area option; hospital route unverified | https://www.hyatt.com/hyatt-regency/en-US/chenn-hyatt-regency-chennai |
| Tulip Inn Gurugram | Hotel page describes five minutes from Medanta; journey varies | https://www.sarovarhotels.com/tulip-inn-gurugram-near-medanta/special-offers.html |
| ITC Kohenur, Hyderabad | City-area option; hospital route unverified | https://www.itchotels.com/in/en/itckohenur-hyderabad |
| Taj Club House, Chennai | City-area option; hospital route unverified | https://www.tajhotels.com/en-in/hotels/taj-club-house-chennai |
| Hyatt Centric Hebbal, Bengaluru | City-area option; hospital route unverified | https://www.hyatt.com/hyatt-centric/en-US/blrch-hyatt-centric-hebbal-bengaluru/hotel-info |
| The Westin Gurgaon | City-area option; hospital route unverified | https://www.marriott.com/en-us/hotels/delwi-the-westin-gurgaon-new-delhi/overview/ |

Vivanta address/contact corroboration: Hotel Association of India property directory https://www.hotelassociationofindia.com/pdf/Kolkata/Vivanta%20Kolkata%20EM%20Bypass.pdf . This is not a hotel ownership or booking partnership claim.

Doctor listings use hospital-specific official doctor profiles/directory. Phone numbers are included only when found in official contact evidence; absent numbers lead to the official page rather than a guessed contact. A central hospital phone is not a WhatsApp number. The app uses no WhatsApp booking links.

## Evidence limits

Full-page evidence was obtained for Fortis, Apollo Chennai, MIOT, Royal Orchid, Hilton, Vivanta and the Lemon Tree Chennai property list. Official search results supplied some Apollo Kolkata branch/contact, Manipal, Max and individual doctor fields when full-page retrieval failed. The app discloses that mode; a source-backed card is not the same as an independent physical inspection. Search summaries are preliminary evidence and should be rechecked directly before publication. Full-page retrieval of a related regional page does not automatically verify every branch attribute.

The app contains no clinical outcomes, accreditation claims, review scores, waiting times, estimated surgery prices or ranked “best” lists. No fabricated rooms/doctor slots. Guides are original general travel-preparation text. Visa guide points to https://www.indianvisaonline.gov.in/ and directs users to confirm nationality-specific rules; it does not assert Bangladesh e-visa eligibility. A medical professional must review any future clinical advice before it is added.
