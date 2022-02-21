from tmutil.sql import *
from tmutil.util import *

def db2js(db_path, src_path, config_path, output_path):
    """
    Generates js file for use by the site.

    Args:
        db_path: Path to dict.db
        config_path: Path to config.json
        src_path: Source file location
        output_path: Output location of resulting js file
    """
    db2entryjs(db_path, config_path, src_path + 'js/constants/')
    db2sitejs(db_path, config_path, src_path)
    db2search(db_path, config_path, output_path)

def db2entryjs(db_path, config_path, output_path):
    """
    Generates dictionary js for use by site in the following format:
        const dict = {
          "version":"VERSION",
          "data":[
            {
              "entry":"ENTRY_CODE",
              "index":{
                "en":{"url":"EN_CODE","text":"EN_LETTER"},
                "ja":{"url":"GOJUUON_CODE","text":"GOJUUON","hiragana":"HIRAGANA","hiragana_url":"JA_CODE"}
              },
              "category":[[cat1-1,cat1-2],[cat2],...],
              "source":[{"src:"source1", "gls":glossary1},{...}],
              "en":{
                "title":"ENTRY_TITLE",
                "category":[[cat1-1,cat1-2],[cat2],...],
                "source":[{"src_name":"","gls_name":""},{...}]
                "content":"Optional contents"
              },
              "ja":{ ... },
              "zh":{ ... }
            },
            { ... }
          ]
        };

    Args:
        db_path: Path to dict.db
        config_path: Path to config.json
        output_path: Output location of resulting js file
    Outputs:
        output_path/dict.js
    """
    ## Initialization and Setup
    output_path = output_dir_exists(output_path)
    data = sql2db(db_path, 'dict_js')
    with open(config_path, encoding='utf-8') as json_file:
        site_const = json.load(json_file)
    ## Process Glossaries and Generate JSON Object
    dict = {'version': site_const['version'], 'data': []}
    for row in data:
        # Prepare Data
        language = row['language_code'].split("<_!lang/>")
        title = row['entry_name'].split("<_!lang/>")
        category_url = [cat.split("/") for cat in row['category'].split(",")]
        source_url = row['source'].split(",")
        glossary_url = row['glossary'].split(",")
        category_name = [[cat.split("/") for cat in cats.split(",")] for cats in row['category_name'].split("<_!lang/>")]
        source_name = [src.split(",") for src in row['source_name'].split("<_!lang/>")]
        glossary_name = [gls.split(",") for gls in row['glossary_name'].split("<_!lang/>")]
        entry_content = row['content'].split("<_!lang/>")
        entry = {}
        # Entry / Index / Img
        entry['entry'] = row['entry']
        entry['index'] = {
            'en' : {
                'url': row['en_code'],
                'text': row['letter']
            },
            'ja': {
                'url': row['gojuuon_code'],
                'text': row['gojuuon'],
                'hiragana': row['hiragana'],
                'hiragana_url': row['ja_code'],
                'furigana': row['furigana']
            }
        }
        # Category
        entry['category'] = []
        for cats in category_url:
            category = []
            for cat in cats:
                category.append(cat)
            entry['category'].append(category)
        # Source
        entry['source'] = []
        for (src, gls) in zip(source_url, glossary_url):
            entry['source'].append({'src': src, 'gls': gls})
        # Language
        for i, (lang, cat_name, src_name, gls_name) in enumerate(zip(language, category_name, source_name, glossary_name)):
            entry[lang] = {}
            entry[lang]['title'] = title[i].replace("'", "<_!sq>")
            # Language / Category
            entry[lang]['category'] = []
            for cats in cat_name:
                category = []
                for cat in cats:
                    category.append(cat.replace("'", "<_!sq>"))
                entry[lang]['category'].append(category)
            # Language / Source
            entry[lang]['source'] = []
            for (src, gls) in zip(src_name, gls_name):
                entry[lang]['source'].append({'src_name': src, 'gls_name': gls})
        # Language / End
        dict['data'].append(entry)
    ## Write to File
    with open(output_path + 'dict.js', 'w', encoding='utf-8') as js_file:
        js_file.write("const dict = ")
        dictjs = json.dumps(dict, ensure_ascii=False, indent=2, sort_keys=True)
        dictjs = dictjs.replace('"', "'").replace('<_!sq>', "\\\'")
        js_file.write(dictjs)
        js_file.write(";\n\nexport default dict;")
    print(output_path + "dict.js")

def db2sitejs(db_path, config_path, src_path):
    """
    Generates site.js const objects.

    Args:
        db_path: Path to dict.db
        config_path: Path to config.json
        src_path: Output location of resulting js file
    Outputs:
        output_path/site.js
    """
    ## Initialization and Setup
    output_path = output_dir_exists(src_path + 'js/constants/')
    en_index = sql2db(db_path, 'index_en')
    ja_index = sql2db(db_path, 'index_ja')
    catlist = sql2db(db_path, 'cat_js')
    srclist = sql2db(db_path, 'src_js')
    with open(src_path + 'updates.json', encoding='utf-8') as json_updates:
        site_updates = json.load(json_updates)
    with open(config_path, encoding='utf-8') as json_config:
        site_const = json.load(json_config)
    ## Updates
    site_const['updates'] = site_updates
    ## Nav
    site_const['nav'] = {'ja': [], 'en': []}
    for row in ja_index:
        ja_char = {'str': str(row['str']), 'url': str(row['url'])}
        site_const['nav']['ja'].append(ja_char)
    site_const['nav']['ja'].append({'str': '全', 'url': ''})
    en = { 'en':[{'str': 'all', 'url': ''}]}
    for row in en_index:
        en_char = {'str': str(row['str']), 'url': str(row['url'])}
        site_const['nav']['en'].append(en_char)
    site_const['nav']['en'].append({ 'str': 'all', 'url': ''})
    ## Side Filters
    site_const['side']['filters'] = {'cat': [], 'src': []}
    for row in catlist:
        cat_name = row['cat_name'].split("<_!lang/>")
        category = {'url': row['cat_url'], 'en': cat_name[0], 'ja': cat_name[1], 'zh': cat_name[2]}
        site_const['side']['filters']['cat'].append(category)
    for row in srclist:
        src_name = row['src_name'].split("<_!lang/>")
        source = {'url': row['src_url'], 'en': src_name[0], 'ja': src_name[1], 'zh': src_name[2]}
        site_const['side']['filters']['src'].append(source)
    ## Write to File
    with open(output_path + 'site.js', 'w', encoding='utf-8') as js_file:
        js_file.write('const site = ')
        sitejs = json.dumps(site_const, ensure_ascii=False, indent=2, sort_keys=True)
        sitejs = sitejs.replace('"', "'").replace("\\'", '\\"').replace('<_!sq/>', "\\\'")
        sitejs = sitejs.replace("Translator's Notes", "Translator\\'s Notes")
        js_file.write(sitejs)
        js_file.write(';\n\nexport default site;')
    print(output_path + "site.js")

def db2search(db_path, config_path, output_path):
    """
    Generates dictionary js search index for Tipue Search in the following format:
        var tipuesearch = {"pages": [
          {"title": "TITLE", "text": "CONTENT", "url": "URL"},
          {"title": "TITLE", "text": "CONTENT", "url": "URL"},
          {"title": "TITLE", "text": "CONTENT", "url": "URL"}
        ]};

    Args:
        db_path: Path to dict.db
        config_path: Path to config.json
        output_path: Output location of resulting js file
    Outputs:
        output_path/search.js
    """
    ## Initialization and Setup
    output_path = output_dir_exists(output_path + 'src/js/')
    with open(config_path, encoding='utf-8') as json_file:
        site_const = json.load(json_file)
    languages = site_const['language']
    ## Generate Tipue Search JSON Object
    search_data = {}
    search_data['pages'] = []
    for lang in languages:
        data = sql2db(db_path, 'entry_lang', lang)
        for row in data:
            title = row['entry_name']
            text = row['content'].replace('"', '\\"').replace('<_!group/>', ' ').replace('<br />', ' ')
            url = 'http://tmdict.com/' + lang + '/' + row['ja_code'] + '.' + row['entry']
            search_data['pages'].append({'title': title, 'text': text, 'tags': '', 'url': url})
    ## Write to File
    with open(output_path + 'search.js', 'w', encoding='utf-8') as js_file:
        js_file.write('var tipuesearch = ')
        json.dump(search_data, js_file, ensure_ascii=False)
    print(output_path + "search.js")

def db2glossaryjs(db_path, config_path, output_path):
    """
    Generates js file for use by the books.

    Args:
        db_path: Path to dict.db
        config_path: Path to config.json
        output_path: Output location of resulting js file
    Outputs:
        output_path/[book].js
    """
    ## Initialization and Setup
    output_path = output_dir_exists(output_path + 'src/js/book/')
    srclist = sql2db(db_path, 'src_js')
    ## Process Glossaries and Generate JSON Object
    for source in srclist:
        data = sql2db(db_path, 'book_js', source['src_url'])
        srcdata = sql2db(db_path, 'book_src', source['src_url'])[0]
        filename = source['src_code'] + '.js'
        language = srcdata['language_code'].split("<_!lang/>")
        src_name = srcdata['source_name'].split("<_!lang/>")
        src_part = srcdata['source_part'].split("<_!lang/>")
        glossary = {}
        # Source
        glossary['source'] = {
            'code': srcdata['code'],
            'url': srcdata['source_url'],
            'release_date': srcdata['release_date'],
            'page': srcdata['page']
        }
        for (lang, name, part) in zip(language, src_name, src_part):
            glossary['source'][lang] = {'name': name, 'part': part}
        # Data
        glossary['data'] = []
        for row in data:
            # Prepare Data
            title = row['entry_name'].split("<_!lang/>")
            category_name = [cats.split("/") for cats in row['category_name'].split("<_!lang/>")]
            entry_content = row['content'].split("<_!lang/>")
            entry_notes = row['note'].split("<_!lang/>")
            entry = {}
            # Entry / Index / Img
            entry['entry'] = row['entry']
            entry['index'] = {
                'url': row['gojuuon_code'],
                'text': row['gojuuon'],
                'hiragana': row['hiragana'],
                'hiragana_url': row['ja_code']
            }
            entry['order'] = row['glossary_order']
            entry['img'] = row['img']
            # Language
            for i, (lang, cat_name, content, notes) in enumerate(zip(language, category_name, entry_content, entry_notes)):
                entry[lang] = {}
                entry[lang]['title'] = title[i].replace("'", "<_!sq>")
                # Language / Category
                entry[lang]['category'] = []
                for cat in cat_name:
                    entry[lang]['category'].append(cat.replace("'", "<_!sq>"))
                # Entry content and notes for glossaries
                entry[lang]['notes'] = []
                if (notes != ''):
                    tlnotes = notes.split('<_!break/>')
                    tlnotes_src = tlnotes[0]
                    tlnotes_dict = tlnotes[1:]
                    for j, note in enumerate(tlnotes_dict):
                        # Content link (long) to the note as well as note link to the content (short)
                        id = str(j + 1)
                        n_short = tlnotes_src + '-n' + str(j + 1)
                        n_long = tlnotes_src + '-note' + str(j + 1)
                        # String in entry content to be replaced
                        content_old = '<_!' + tlnotes_src + '-n' + id + '/>'
                        # Replacement string formatted as superscript
                        c_pre = '<sup id="' + n_short + '" class="note">'
                        c_link = '<a title="' + n_short + '" href="#' + n_long + '">' + str(j + 1) + '</a>'
                        c_post = '</sup>'
                        content_new = c_pre + c_link + c_post
                        # Update entry content with links to note
                        content = content.replace(content_old, content_new)
                        # Update note with links to content
                        n_pre = '<li id="' + n_long + '"><a title="' + n_long + '" href="#' + n_short + '">^</a> '
                        n_post = '</li>'
                        entry[lang]['notes'].append(n_pre + note.replace("'", "<_!sq>") + n_post)
                entry[lang]['content'] = content.replace("'", "<_!sq>")
            # Language / End
            glossary['data'].append(entry)
        ## Write to File
        with open(output_path + filename, 'w', encoding='utf-8') as js_file:
            js_file.write("const glossary = ")
            glossaryjs = json.dumps(glossary, ensure_ascii=False, sort_keys=True)
            glossaryjs = glossaryjs.replace('"', "'").replace('<_!sq>', "\\\'")
            js_file.write(glossaryjs)
            js_file.write(";module.exports = glossary;")
        print(output_path + filename)