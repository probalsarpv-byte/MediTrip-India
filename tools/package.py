#!/usr/bin/env python3
"""Build a distributable source ZIP; excludes SDKs, build caches and signing material."""
from pathlib import Path
import zipfile, hashlib
root=Path(__file__).resolve().parents[1]
destination=root.parent/'MediTrip-India-Master-2.1.0.zip'
files=[]
for p in sorted(root.rglob('*')):
    if not p.is_file():continue
    rel=p.relative_to(root)
    if any(part in {'.gradle','build','node_modules','__pycache__','.bootstrap','.git'} for part in rel.parts):continue
    if p.name in {'local.properties','.env'} or p.suffix in {'.jks','.keystore'}:continue
    files.append(p)
with zipfile.ZipFile(destination,'w',zipfile.ZIP_DEFLATED,compresslevel=9) as z:
    for p in files:z.write(p,root.name+'/'+p.relative_to(root).as_posix())
with zipfile.ZipFile(destination) as z:
    assert z.testzip() is None
    names=z.namelist()
    for required in ['README.md','প্রথমে-পড়ুন.txt','docs/MASTER-PRODUCTION-BLUEPRINT.md', 'data/offline-db.json','android/gradle/wrapper/gradle-wrapper.jar','android/gradlew','web/index.html','docs/VERIFICATION.md','data/source-ledger.csv','tools/build-production-data.py','data/curated-additions.json','.github/workflows/android-build.yml']:
        assert root.name+'/'+required in names,required
print(f'{destination}\n{len(files)} files · {destination.stat().st_size:,} bytes\nSHA256 {hashlib.sha256(destination.read_bytes()).hexdigest()}')
