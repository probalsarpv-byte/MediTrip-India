# Maintain the free directory

1. Open the official branch page and official doctor/contact pages. Record branch identity, address and departments. Do not infer that every hospital in a chain offers the same departments.
2. Verify hotel official address/contact and an explicit hospital-proximity statement. If no statement exists, use relation `area` and say route unverified. Never invent kilometres or journey times. Map buttons simply open directions in the user's browser.
3. Add/update canonical `data/directory.json`. Keep stable IDs, hospital↔hotel references, complete `en/bn/hi` names, branch/address/notes, `source`, `sources`, `sourceMode` and reviewed date. Doctor `photo` stays null unless licensed.
4. Add every new label to all three objects in `data/translations.json`. Add complete original translations to `data/content.json`. Have a human Bengali/Hindi editor review wording before public launch.
5. Update source-ledger.csv with what you actually inspected. Set evidence `page` only when you read the relevant official page. Use `search` for official search-result evidence; never present it as independently verified.
6. Run `python tools/sync-data.py` and `node --test tests/*.test.cjs`. Review all three languages on a real phone.
7. Increment Android versionCode and versionName, config version and service-worker CACHE name. Publish an app update. No remote sync is implemented.

## Adding real photos later

Get written permission or a compatible licence from the provider/photographer. Keep permission and attribution in this project. Use locally stored optimised WebP/JPEG images, descriptive translated alt text and fallback illustration. Add the exact asset path to service-worker precache. Do not hotlink, use portraits from search without permission, or generate fake hospital/doctor photos. The delivered app deliberately uses original city illustrations and silhouettes.

## Free operation and scaling

No server, account, analytics, tracking, database fee, paid map embed, SMS, AI API or live booking integration. External Maps links may involve the map provider's service and privacy terms. For more users the static app itself has no per-user compute charge, but free host/build/distribution limits can change. Eventually consider an authenticated editorial tool, approved image storage and consent-based appointment integration; evaluate actual expenses before adding them.
