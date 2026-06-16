#!/usr/bin/env python3
"""Add mobile CSS links to all remaining book HTML files."""
import os

os.chdir(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

files = [
    'books/PMPExamPrep/rita_chap02.html',
    'books/PMPExamPrep/rita_chap03.html',
    'books/PMPExamPrep/rita_chap04.html',
    'books/PMPExamPrep/rita_chap05.html',
    'books/PMPExamPrep/rita_chap06.html',
    'books/PMPExamPrep/rita_chap07.html',
    'books/PMPExamPrep/rita_chap08.html',
    'books/PMPExamPrep/rita_chap10.html',
    'books/PMPExamPrep/rita_chap11.html',
    'books/PMPExamPrep/rita_chap12.html',
    'books/PMPExamPrep/rita_chap13.html',
    'books/PMPExamPrep/rita_chap14.html',
    'books/PMPExamPrep/rita_chap15.html',
    'books/PMPExamPrep/rita_chap16.html',
    'books/PMPExamPrep/rita_chap17.html',
    'books/PMPExamPrep/rita_chap18.html',
    'books/pmbok6/02_environment.html',
    'books/pmbok6/03_pm_role.html',
    'books/pmbok6/04_integration_management.html',
    'books/pmbok6/05_scope_management.html',
    'books/pmbok6/06_schedule_management.html',
    'books/pmbok6/07_cost_management.html',
    'books/pmbok6/08_quality_management.html',
    'books/pmbok6/09_resource_management.html',
    'books/pmbok6/10_communications_management.html',
    'books/pmbok6/11_risk_management.html',
    'books/pmbok6/12_procurement_management.html',
    'books/pmbok6/13_stakeholder_management.html',
    'books/pmbok6/14_standard_for_pm.html',
    'books/pmbok6/15_appendices_glossary.html',
    'books/pmbok6/16_agile_practice_guide.html',
]

old_viewport = 'content="width=device-width, initial-scale=1.0"'
new_viewport = 'content="width=device-width, initial-scale=1.0, viewport-fit=cover"'

fonts_line = 'family=Source+Code+Pro:wght@400;600&display=swap" rel="stylesheet">'
css_insert = '<link rel="stylesheet" href="../../css/mobile-base.css">\n<link rel="stylesheet" href="../../css/book-reader-mobile.css">'

success = []
failed = []

for f in files:
    try:
        with open(f, 'r') as fh:
            content = fh.read()

        if 'viewport-fit=cover' in content and 'mobile-base.css' in content:
            success.append(f + ' (already done)')
            continue

        content = content.replace(old_viewport, new_viewport, 1)

        idx = content.find(fonts_line)
        if idx == -1:
            failed.append(f + ' (fonts line not found)')
            continue

        insert_pos = idx + len(fonts_line)
        content = content[:insert_pos] + '\n' + css_insert + '\n' + content[insert_pos:]

        with open(f, 'w') as fh:
            fh.write(content)

        success.append(f)
    except Exception as e:
        failed.append(f + ' (' + str(e) + ')')

print(f'SUCCESS ({len(success)}):')
for s in success:
    print(f'  + {s}')
print()
if failed:
    print(f'FAILED ({len(failed)}):')
    for f in failed:
        print(f'  x {f}')
else:
    print('FAILED: None')
