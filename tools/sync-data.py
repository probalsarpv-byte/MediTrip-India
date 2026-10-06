#!/usr/bin/env python3
"""Copy hand-reviewed, canonical JSON into offline JS modules. No scraping/API calls."""
from pathlib import Path
import json
root=Path(__file__).resolve().parents[1]
for name,variable in [('directory','MEDI_DATA'),('translations','MEDI_I18N'),('content','MEDI_CONTENT')]:
    content=json.loads((root/'data'/f'{name}.json').read_text(encoding='utf-8'))
    (root/'web'/({'directory':'data','translations':'i18n'}.get(name,name)+'.js')).write_text(
        'window.'+variable+' = '+json.dumps(content,ensure_ascii=False,separators=(',',':'))+';\n',encoding='utf-8')
print('Offline modules updated; run node --test tests/*.test.cjs before release.')
