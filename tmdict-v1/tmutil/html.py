import sys
import time
from jinja2 import Environment, FileSystemLoader
from tmutil.sql import *
from tmutil.util import *

def db2html(template_path, db_path, config_path, output_path, ext=False, pgonly=False):
    """
    Outputs all of tmdict's static HTML files. There are two kinds of HTML pages:
        1. Static pages: General pages that contain information about the website itself
        2. Entry pages: Glossary entries taken from dict.db

    All pages are generated using the Jinja2 templating engine, which defines the basic
    site layout as well as contents for the static pages. The main loop iterates through a
    list of availabe languages to generate both the static and entry pages.

    Args:
        template_path: Path to the Jinja2 template directory
        db_path: Path to dict.db
        config_path: Path to config.json
        output_path: Output location of resulting HTML files
        ext: Optional flag that determines whether the links in the HTML files contain the ".html" extension
        pgonly: Optional flag that determines whether to generate entry pages
    Requires:
        template_path/*.html - Jinja2 templates for static and entry pages
    Outputs:
        output_path/[lang]/*.html - Entry/static pages separated into their respective language directories
    """
    ## Initialization and Setup
    output_path = output_dir_exists(output_path)
    env = Environment(loader=FileSystemLoader(template_path), trim_blocks=True, lstrip_blocks=True)
    pages = ['index', 'about', 'site', 'misc', 'search']
    with open(config_path, encoding='utf-8') as json_file:
        site_const = json.load(json_file)
    languages = site_const['language']
    index_ext = 'index.html' if (ext) else ''
    ## HTML Generation
    for lang in languages:
        ## Static Pages
        for page in pages:
            # Select page template <path/lang_page.html> and output path <path/lang/page.html>
            input_template = lang + '_' + page + '.html'
            output_file = output_dir_exists(output_path + lang + '/' + page + '.html')
            template = env.get_template(input_template)
            # Write to HTML, sidebar title should always be in EN
            return_url = './' + index_ext
            html = template.render({**site_const[lang]}, ext=ext, lang=lang, version=site_const['version'],
                                    side=site_const['side'][lang], sidechar=site_const['en'][page][:1], sidetitle=site_const['en'][page][1:], backurl=return_url)
            with open(output_file, 'w', encoding='utf-8') as html_file:
                html_file.write(html)
            print(output_file)
        ## Entry Pages
        if not pgonly:
            template = env.get_template('_entry.html')
            data = sql2db(db_path, 'entry_lang', lang)
            total_rows = len(data)
            start = time.process_time()
            # One entry per row, same entries from multiple sources are pre-concatenated by SQL query
            for i, row in enumerate(data):
                # Generate sidebar entry list and pass it along with entry row data to generate HTML page content
                sidebar = sql2db(db_path, 'entry_sidebar', {'lang': lang, 'hiragana': row['hiragana']})
                entry_page = generate_entry(row, sidebar, ext)
                return_url = './' + index_ext + '#ja.' + row['gojuuon_code']
                # Set output path <path/lang/entry_name.html> and render HTML page using entry object
                output_file = output_dir_exists(output_path + lang + '/' + entry_page['url'] + '.html')
                html = template.render({**entry_page, **site_const[lang]}, ext=ext, lang=lang, version=site_const['version'], backurl=return_url)
                with open(output_file, 'w', encoding='utf-8') as html_file:
                    html_file.write(html)
            print("Generated entry (" + lang + ") pages in " + str(time.process_time() - start) + "s")

def generate_entry(entry, sidebar, ext):
    """
    Generates the HTML contents for each glossary entry.

    Args:
        entry: A list of key-value pairs containing all data for one glossary entry
        sidebar: A list of all entries with the same hiragana of current entry
        ext: Flag for whether or not to use .html extension
    Returns:
        An object of key-value pairs that contains all data needed to construct the HTML page for one
        particular entry, in formatted HTML
    """
    ## Generate URL
    extension = '.html' if (ext) else ''
    entry_url = entry['ja_code'] + '.' + entry['entry']
    ## Process Category
    # Split category url/name from different sources by ',' then split categories from same
    # source by '/':
    #     cat1/cat2,cat3 -> [['cat1', 'cat2'], [cat3]]
    category_url = [cat.split('/') for cat in entry['category'].split(',')]
    categories = [cat.split('/') for cat in entry['category_name'].split(',')]
    category_type = entry['c_type'].split(',')
    for i, category in enumerate(categories):
        for j, cat in enumerate(category):
            if (int(category_type[i]) == 1):
                categories[i][j] = '<a href="./#ja+cat.' + category_url[i][j] + '">' + cat + '</a>'
    ## Process Main Content and TL Notes
    # Split entries/src_code/notes into groups, each entry should already be sorted by date via SQL.
    # Notes returned from a SQL query are prefixed by their source code, so once split into arrrays,
    # if notes exists, split notes by sources into a dictionary with their source as the key, then iterate
    # over each source and format their respective notes. Also since notes from different sources are
    # concatenated, instead of having each note id start at 1, a counter is used to keep track of note id
    entry_content = entry['content'].split('<_!group/>')
    for i, content in enumerate(entry_content):
        missing_link = '<div id="contact" class="contact"><a href="site' + extension + '#site-contact">!missing</a></div>'
        entry_content[i] = entry_content[i].replace("<_!missing/>", missing_link)
    entry_notes = []
    if entry['note']:
        source_codes = entry['source_code'].split(',')
        tlnotes = [note.split('<_!break/>') for note in entry['note'].split('<_!group/>')]
        tlnotes_dict = {notes[0]: notes[1:] for notes in tlnotes}
        tlnote_count = 1
        # Replace translator's notes token by their actual link
        for i, src in enumerate(source_codes):
            # Check if current source contains notes
            if (src in tlnotes_dict):
                entry_notes.append([])
                for j, note in enumerate(tlnotes_dict[src]):
                    # Content link (long) to the note as well as note link to the content (short)
                    id = str(j + 1)
                    n_short = src + '-n' + str(tlnote_count)
                    n_long = src + '-note' + str(tlnote_count)
                    # String in entry content to be replaced
                    content_old = '<_!' + src + '-n' + id + '/>'
                    # Replacement string formatted as superscript
                    c_pre = '<sup id="' + n_short + '" class="note">'
                    c_link = '<a title="' + n_short + '" href="#' + n_long + '">' + str(tlnote_count) + '</a>'
                    c_post = '</sup>'
                    content_new = c_pre + c_link + c_post
                    # Update entry content with links to note
                    entry_content[i] = entry_content[i].replace(content_old, content_new)
                    # Update note with links to content
                    n_pre = '<li id="' + n_long + '"><a title="' + n_long + '" href="#' + n_short + '">^</a> '
                    n_post = '</li>'
                    entry_notes[len(entry_notes) - 1].append(n_pre + note + n_post)
                    tlnote_count += 1
    ## Process Img
    images = ''
    # If image exists, go through each image and append html tag with title/alt attributes
    if entry['img']:
        images = entry['img'].split(',')
        for i, img in enumerate(images):
            images[i] = '<img title="' + entry['entry_name'] + '" src="../src/img/dict/' + img + '" alt="' + entry['entry'] + '" />'
    ## Process Sidebar
    side_content = []
    # Generate HTML list of entries in sidebar
    for side_entry in sidebar:
        active_entry = ' class="active"' if (entry['entry'] == side_entry['entry']) else ''
        side_url = side_entry['ja_code'] + '.' + side_entry['entry'] + extension
        side_pre = '<li' + active_entry + '><a title="' + side_entry['entry_name'] + '" href="' + side_url + '"><div class="entry group">'
        side_title = '<div class="entry-title">' + side_entry['entry_name'] + '</div>'
        side_cat = '<div class="entry-category">'
        # Get rid of duplicate entries and append '/' after each category if there are multiple
        side_cat_lists = unique(side_entry['category_name'].split(','))
        for i, cat in enumerate(side_cat_lists):
            if i > 0:
                side_cat += '/'
            side_cat += cat
        side_cat += '</div>'
        side_post = '</div></a></li>'
        side_content.append(side_pre + side_title + side_cat + side_post)
    ## Create Entry Object
    return {
        'title': entry['entry_name'],
        'url': entry_url,
        'active_ja': '.' + entry['gojuuon_code'],
        'content': entry_content,
        'category_name': categories,
        'category_type': category_type,
        'source': entry['source'].split(','),
        'source_name': entry['source_name'].split(','),
        'source_section': entry['source_section'].split(','),
        'img': images,
        'tlnotes': entry_notes,
        'sidechar': entry['hiragana'],
        'side': side_content
    }

def db2book(template_path, db_path, output_path, ext=False):
    """
    Outputs glossary HTML files.

    Args:
        template_path: Path to the Jinja2 template directory
        db_path: Path to dict.db
        output_path: Output location of resulting HTML files
        ext: Optional flag that determines whether the links in the HTML files contain the ".html" extension
    Requires:
        template_path/*.html - Jinja2 template for book pages
    Outputs:
        output_path/book/*.html
    """
    ## Initialization and Setup
    output_path = output_dir_exists(output_path + 'book/')
    env = Environment(loader=FileSystemLoader(template_path), trim_blocks=True, lstrip_blocks=True)
    srcdata = sql2db(db_path, 'src_js')
    for i, row in enumerate(srcdata):
        output_file = output_dir_exists(output_path + row['src_url'] + '.html')
        template = env.get_template('_book.html')
        src_name = row['src_name'].split("<_!lang/>")
        html = template.render(ext=ext, book_name=src_name[0], book_url=row['src_url'], book_code=row['src_code'])
        with open(output_file, 'w', encoding='utf-8') as html_file:
            html_file.write(html)
        print(output_path + row['src_url'] + ".html")

def db2yaml(template_path, db_path, config_path, output_path, ext=False, pgonly=False):
    ## Initialization and Setup
    output_path = output_dir_exists(output_path)
    env = Environment(loader=FileSystemLoader(template_path), trim_blocks=True, lstrip_blocks=True)
    pages = ['index', 'about', 'site', 'misc', 'search']
    with open(config_path, encoding='utf-8') as json_file:
        site_const = json.load(json_file)
    languages = site_const['language']
    template = env.get_template('_yaml.yml')
    datae = sql2db(db_path, 'entry_lang', 'en')
    dataj = sql2db(db_path, 'entry_lang', 'ja')
    dataz = sql2db(db_path, 'entry_lang', 'zh')
    total_rows = len(datae)
    start = time.process_time()
    # One entry per row, same entries from multiple sources are pre-concatenated by SQL query
    for i, (en, ja, zh) in enumerate(zip(datae, dataj, dataz)):
        entry_pagee = generate_yml(en)
        entry_pagej = generate_yml(ja)
        entry_pagez = generate_yml(zh)
        entry = {
            'key': en['entry'],
            'ja_key': en['ja_code'],
            'en_key': en['en_code'],
            'furi': en['furigana'],
            'cat': entry_pagee['category_name'],
            'img': entry_pagee['img'],
            'category_type': entry_pagee['category_type'],
            'entitle': en['entry_name'],
            'jatitle': ja['entry_name'],
            'zhtitle': zh['entry_name'],
            'encontent': entry_pagee['content'],
            'jacontent': entry_pagej['content'],
            'zhcontent': entry_pagez['content'],
            'ennote': entry_pagee['tlnotes'],
            'janote': entry_pagej['tlnotes'],
            'zhnote': entry_pagez['tlnotes'],
            'source': entry_pagee['source'],
            'glossary_order': entry_pagee['glossary_order'],
            'source_section': entry_pagee['source_section']
        }
        # Set output path <path/lang/entry_name.html> and render HTML page using entry object
        output_file = output_dir_exists(output_path + en['entry'] + '.yml')
        html = template.render({**entry})
        with open(output_file, 'w', encoding='utf-8') as html_file:
            html_file.write(html)
    print("Generated entry () pages in " + str(time.process_time() - start) + "s")

def generate_yml(entry):
    """
    Generates the HTML contents for each glossary entry.

    Args:
        entry: A list of key-value pairs containing all data for one glossary entry
        sidebar: A list of all entries with the same hiragana of current entry
        ext: Flag for whether or not to use .html extension
    Returns:
        An object of key-value pairs that contains all data needed to construct the HTML page for one
        particular entry, in formatted HTML
    """
    ## Generate URL
    entry_url = entry['ja_code'] + '.' + entry['entry']
    ## Process Category
    # Split category url/name from different sources by ',' then split categories from same
    # source by '/':
    #     cat1/cat2,cat3 -> [['cat1', 'cat2'], [cat3]]
    category_url = [cat.split('/') for cat in entry['category'].split(',')]
    categories = [cat.split('/') for cat in entry['category'].split(',')]
    category_type = entry['c_type'].split(',')
    for i, category in enumerate(categories):
        for j, cat in enumerate(category):
            if (int(category_type[i]) == 1):
                categories[i][j] = category_url[i][j]
    ## Process Main Content and TL Notes
    # Split entries/src_code/notes into groups, each entry should already be sorted by date via SQL.
    # Notes returned from a SQL query are prefixed by their source code, so once split into arrrays,
    # if notes exists, split notes by sources into a dictionary with their source as the key, then iterate
    # over each source and format their respective notes. Also since notes from different sources are
    # concatenated, instead of having each note id start at 1, a counter is used to keep track of note id
    entry_content = entry['content'].split('<_!group/>')
    for i, content in enumerate(entry_content):
        missing_link = '<div id="contact" class="contact"><a href="site' + 'extension' + '#site-contact">!missing</a></div>'
        entry_content[i] = entry_content[i].replace("<_!missing/>", missing_link)
    entry_notes = []
    if entry['note']:
        source_codes = entry['source_code'].split(',')
        tlnotes = [note.split('<_!break/>') for note in entry['note'].split('<_!group/>')]
        tlnotes_dict = {notes[0]: notes[1:] for notes in tlnotes}
        tlnote_count = 1
        # Replace translator's notes token by their actual link
        for i, src in enumerate(source_codes):
            # Check if current source contains notes
            if (src in tlnotes_dict):
                entry_notes.append([])
                for j, note in enumerate(tlnotes_dict[src]):
                    # Content link (long) to the note as well as note link to the content (short)
                    id = str(j + 1)
                    n_short = 'n' + str(tlnote_count)
                    n_long = src + '-note' + str(tlnote_count)
                    # String in entry content to be replaced
                    content_old = '<_!' + src + '-n' + id + '/>'
                    # Replacement string formatted as superscript
                    # <sup id="{{n1}}" class="note"><a title="{{n1}}s" href="#{{n1}}">1</a></sup>
                    c_pre = '<sup id="{' + '{' + n_short + '}' + '}s" class="note">'
                    c_link = '<a title="{' + '{' + n_short + '}' + '}s" href="#{' + '{' + n_short + '}' + '}">' + str(tlnote_count) + '</a>'
                    c_post = '</sup>'
                    content_new = c_pre + c_link + c_post
                    # Update entry content with links to note
                    entry_content[i] = entry_content[i].replace(content_old, content_new)
                    # Update note with links to content
                    n_pre = 'n' + str(tlnote_count) + ': "'
                    n_post = '"'
                    entry_notes[len(entry_notes) - 1].append(n_pre + note + n_post)
                    tlnote_count += 1
    ## Process Img
    images = ''
    # If image exists, go through each image and append html tag with title/alt attributes
    if entry['img']:
        images = entry['img'].split(',')
        for i, img in enumerate(images):
            images[i] = img
    ## Process Sidebar
    side_content = []
    ## Create Entry Object
    return {
        'title': entry['entry_name'],
        'url': entry_url,
        'active_ja': '.' + entry['gojuuon_code'],
        'content': entry_content,
        'category_name': categories,
        'category_type': category_type,
        'source': entry['source'].split(','),
        'source_name': entry['source_name'].split(','),
        'glossary_order': entry['glossary_order'].split(','),
        'source_section': entry['source_section'].split(','),
        'img': images,
        'tlnotes': entry_notes
    }
