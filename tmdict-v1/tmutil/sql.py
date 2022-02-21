import sqlite3
from tmutil.util import *

def sql2db(db_path, query, filter=''):
    """
    Execute SQL queries based on user input.

    Args:
        db_path: Path to dict.db
        query: A string identifying which SQL query requested
        filter: Optional filter
    Requires:
        db_path/dict.db
    Returns:
        A dictionary object containing the result of the SQL query as an array of key-value pairs.
    """
    con = sqlite3.connect(db_path)
    # Return a dictionary object intead of tuple
    con.row_factory = sqlite3.Row
    cur = con.cursor()

    if (query == 'entry_lang'):
        # Filter by language if lang input != '', otherwise selects all languages
        lang_filter = 'WHERE language_code = \'' + filter + '\'' if (filter != '') else ''
        data = entry_lang(cur, lang_filter)
    elif (query == 'entry_sidebar'):
        # Filter by language and hiragana
        sidebar_filter = 'WHERE language_code = \'' + filter['lang'] + '\' AND hiragana = \'' + filter['hiragana'] + '\'' if (filter != '') else ''
        data = entry_sidebar(cur, sidebar_filter)
    elif (query == 'dict_js'):
        ja_order = 'ORDER BY hiragana, furigana'
        data = entry_concat(cur, ja_order)
    elif (query == 'cat_js'):
        data = cat_js(cur)
    elif (query == 'src_js'):
        data = src_js(cur)
    elif (query == 'entry_csv'):
        data = entry_csv(cur)
    elif (query == 'src_csv'):
        data = src_csv(cur)
    elif (query == 'index_en'):
        data = index_en(cur)
    elif (query == 'index_ja'):
        data = index_ja(cur)
    elif (query == 'book_js'):
        glossary_order = 'ORDER BY glossary_order'
        glossary_filter = 'WHERE source = \'' + filter + '\''
        data = entry_concat(cur, glossary_order, glossary_filter)
    elif (query == 'book_src'):
        source_filter = '\'' + filter + '\''
        data = book_src(cur, source_filter)

    con.close()
    return data

def entry_concat(cur, orderby='', filter=''):
    """
    Generates a list of entries with all fields from all tables for use in JS, each row contains an
    unique entry in all available languages.

    Args:
        cur: SQL cursor object
        sortby: Parameters used to sort outputs
        filter: Parameters used to filter outputs
    Returns:
        A dictionary object with the following columns per row:
        - id, language_code, entry, entry_name, category_name, source_name, glossary, index info, etc.
    """
    cur.execute(' \
        SELECT id, entry AS entry, group_concat(language_code, "<_!lang/>") AS language_code, \
               group_concat(entry_name, "<_!lang/>") AS entry_name, \
               category, group_concat(category_name, "<_!lang/>") AS category_name, \
               source, group_concat(source_name, "<_!lang/>") AS source_name, \
               group_concat(source_section, "<_!lang/>") AS source_section, \
               glossary, group_concat(glossary_name, "<_!lang/>") AS glossary_name, \
               furigana, ja_code, hiragana, gojuuon, gojuuon_code, en_code, letter, glossary_order, \
               group_concat(content, "<_!lang/>") AS content, \
               group_concat(note, "<_!lang/>") AS note, img \
        FROM ( \
            SELECT group_concat(id) AS id, language_code, name AS entry, title AS entry_name, \
                group_concat(category) AS category, group_concat(category_name) AS category_name, \
                group_concat(source) AS source, group_concat(source_name) AS source_name, \
                group_concat(source_section) AS source_section, \
                group_concat(glossary) AS glossary, group_concat(glossary_name) AS glossary_name, \
                furigana, ja_code, hiragana, gojuuon, gojuuon_code, en_code, letter, glossary_order, \
                IFNULL(REPLACE(content, "<_!n", "<_!" || src_code || "-n"), "") AS content, \
                IFNULL(src_code || "<_!break/>" || note, "") AS note, \
                IFNULL(img, "") AS img \
            FROM ( \
                SELECT *, src.code AS src_code, ja.code AS ja_code, en.code AS en_code \
                FROM entry e \
                INNER JOIN en_index en ON e.en_index = en.code \
                INNER JOIN ja_index ja ON e.ja_index = ja.code \
                INNER JOIN entry_i18n e_i18n ON e.id = e_i18n.entry_id \
                INNER JOIN ( \
                    SELECT entry_id, language_code, group_concat(name, "/") AS category, \
                        group_concat(t_name, "/") AS category_name, type AS c_type, \
                        group_concat(ordering, "/") AS c_ordering \
                    FROM ( \
                        SELECT e_c.entry_id AS entry_id, c_i18n.language_code AS language_code, \
                               c.name AS name, c_i18n.name AS t_name, c.type AS type, e_c.ordering AS ordering \
                        FROM category c \
                        INNER JOIN category_i18n c_i18n ON c.id = c_i18n.category_id \
                        INNER JOIN entry_category e_c ON c.id = e_c.category_id \
                        ORDER BY e_c.ordering ASC \
                    ) \
                    GROUP BY entry_id, language_code \
                    ORDER BY entry_id, language_code \
                ) AS cat ON e.id = cat.entry_id AND e_i18n.language_code = cat.language_code \
                INNER JOIN ( \
                    SELECT s.code, s_i18n.language_code, s.name AS source, s_i18n.name AS source_name, \
                           s_i18n.part AS source_section, s.release_date, s.page, g.name AS glossary, \
                           g_i18n.name AS glossary_name \
                    FROM source s \
                    INNER JOIN source_i18n s_i18n ON s.code = s_i18n.source_code \
                    INNER JOIN glossary g ON s.glossary_id = g.id \
                    INNER JOIN glossary_i18n g_i18n ON g.id = g_i18n.glossary_id AND s_i18n.language_code = g_i18n.language_code \
                    WHERE s.translated = 1 \
                    ORDER BY s.code, s_i18n.language_code \
                ) AS src ON e.source_code = src.code AND e_i18n.language_code = src.language_code \
                GROUP BY e.id, e.name, e_i18n.language_code \
                ORDER BY e.name, e_i18n.language_code, src.release_date ASC \
            ) ' + filter + '\
            GROUP BY entry, language_code \
        ) \
        GROUP BY entry \
        ' + orderby + '\
    ')
    return cur.fetchall()

def entry_lang(cur, lang_filter):
    """
    Generates a list of entries with all fields from all tables for use in HTML, each row contains an
    unique entry in an unique language. If a language filter is present, the object will contain only content
    in that specific language.

    Args:
        cur: SQL cursor object
        lang_filter: A pre-formatted SQL WHERE query containing 'language'
    Returns:
        A dictionary object with the following columns per row:
        - id, language_code, entry, entry_name, category, category_name, c_type (Category type e.g. none, common, unique), c_ordering (order of category as they appear in source material), content (tl note tags (e.g. <_!n1>) are pre-formatted with source code), note, img, source, source_code, source_name, source_section, glossary, release_date, page, furigana, ja_code, hiragana, gojuuon_code, gojuuon, en_code, letter.
    """
    cur.execute(' \
        SELECT group_concat(id) AS id, language_code, name AS entry, title AS entry_name, \
            group_concat(category) AS category, group_concat(category_name) AS category_name, \
            group_concat(c_type) AS c_type, group_concat(c_ordering) AS c_ordering, \
            group_concat(glossary_order) AS glossary_order, \
            IFNULL(group_concat(REPLACE(content, "<_!n", "<_!" || src_code || "-n"), "<_!group/>"), "") AS content, \
            IFNULL(group_concat(src_code || "<_!break/>" || note, "<_!group/>"), "") AS note, \
            IFNULL(group_concat(img), "") AS img, \
            group_concat(source) AS source, group_concat(src_code) AS source_code, \
            group_concat(source_name) AS source_name, \
            IFNULL(group_concat(source_section), "") AS source_section, \
            group_concat(glossary_name) AS glossary_name, IFNULL(group_concat(release_date), "") AS release_date, \
            IFNULL(group_concat(page), "") AS page, \
            furigana, ja_code, hiragana, gojuuon, gojuuon_code, en_code, letter \
        FROM ( \
            SELECT *, src.code AS src_code, ja.code AS ja_code, en.code AS en_code \
            FROM entry e \
            INNER JOIN en_index en ON e.en_index = en.code \
            INNER JOIN ja_index ja ON e.ja_index = ja.code \
            INNER JOIN entry_i18n e_i18n ON e.id = e_i18n.entry_id \
            INNER JOIN ( \
                SELECT entry_id, language_code, group_concat(name, "/") AS category, \
                    group_concat(t_name, "/") AS category_name, type AS c_type, \
                    group_concat(ordering, "/") AS c_ordering \
                FROM ( \
                    SELECT e_c.entry_id AS entry_id, c_i18n.language_code AS language_code, \
                        c.name AS name, c_i18n.name AS t_name, c.type AS type, e_c.ordering AS ordering \
                    FROM category c \
                    INNER JOIN category_i18n c_i18n ON c.id = c_i18n.category_id \
                    INNER JOIN entry_category e_c ON c.id = e_c.category_id \
                    ORDER BY e_c.ordering ASC \
                ) \
                GROUP BY entry_id, language_code \
                ORDER BY entry_id, language_code \
            ) AS cat ON e.id = cat.entry_id AND e_i18n.language_code = cat.language_code \
            INNER JOIN ( \
                SELECT s.code, s_i18n.language_code, s.name AS source, s_i18n.name AS source_name, \
                    s_i18n.part AS source_section, s.release_date, s.page, g_i18n.name AS glossary_name \
                FROM source s \
                INNER JOIN source_i18n s_i18n ON s.code = s_i18n.source_code \
                INNER JOIN glossary g ON s.glossary_id = g.id \
                INNER JOIN glossary_i18n g_i18n ON g.id = g_i18n.glossary_id AND s_i18n.language_code = g_i18n.language_code \
                WHERE s.translated = 1 \
                ORDER BY s.code, s_i18n.language_code \
            ) AS src ON e.source_code = src.code AND e_i18n.language_code = src.language_code \
            GROUP BY e.id, e.name, e_i18n.language_code \
            ORDER BY e.name, e_i18n.language_code, src.release_date ASC \
        ) ' + lang_filter + '\
        GROUP BY entry, language_code \
        ORDER BY hiragana, furigana \
    ')
    return cur.fetchall()

def entry_sidebar(cur, sidebar_filter):
    """
    Generates a list of entries to be used in the sidebar of entry pages, filtered by language and hiragana

    Args:
        cur: SQL cursor object
        sidebar_filter: A pre-formatted SQL WHERE query containing 'language' and 'hiragana'
    Returns:
        A dictionary object with the following columns per row:
        - id, language_code, entry_name, category_name, ja_code, hiragana, furigana
    """
    cur.execute(' \
        SELECT group_concat(id) AS id, language_code, name AS entry, title AS entry_name, \
            group_concat(category_name) AS category_name, ja_code, hiragana, furigana \
        FROM ( \
            SELECT *, ja.code AS ja_code \
            FROM entry e \
            INNER JOIN ja_index ja ON e.ja_index = ja.code \
            INNER JOIN entry_i18n e_i18n ON e.id = e_i18n.entry_id \
            INNER JOIN ( \
                SELECT entry_id, language_code, group_concat(t_name) AS category_name \
                FROM ( \
                    SELECT e_c.entry_id AS entry_id, c_i18n.language_code AS language_code, \
                        c.name AS name, c_i18n.name AS t_name, c.type AS type, e_c.ordering AS ordering \
                    FROM category c \
                    INNER JOIN category_i18n c_i18n ON c.id = c_i18n.category_id \
                    INNER JOIN entry_category e_c ON c.id = e_c.category_id \
                    ORDER BY e_c.ordering ASC \
                ) \
                GROUP BY entry_id, language_code \
                ORDER BY entry_id \
            ) AS cat ON e.id = cat.entry_id AND e_i18n.language_code = cat.language_code \
			INNER JOIN ( \
                SELECT s.code, s.translated \
                FROM source s \
                WHERE s.translated = 1 \
            ) AS src ON e.source_code = src.code \
            GROUP BY e.id, e.name, e_i18n.language_code \
        ) ' + sidebar_filter + '\
        GROUP BY entry, language_code \
        ORDER BY hiragana, furigana \
    ')
    return cur.fetchall()

def cat_js(cur):
    """
    Generates a list of categories of type 1 to be used for sidebar filter.

    Args:
        cur: SQL cursor object
    Returns:
        A dictionary object with the following columns per row:
        - cat_id, language_code, cat_url, cat_name
    """
    cur.execute(' \
        SELECT id AS cat_id, group_concat(language_code, "<_!lang/>") AS language_code, \
        c.name AS cat_url, group_concat(c_i18n.name, "<_!lang/>") AS cat_name \
        FROM category c \
        INNER JOIN category_i18n c_i18n ON c.id = c_i18n.category_id WHERE c.type = 1 \
        GROUP BY cat_id \
        ORDER BY cat_url \
    ')
    return cur.fetchall()

def src_js(cur):
    """
    Generates a list of translated sources to be used for sidebar filter.

    Args:
        cur: SQL cursor object
    Returns:
        A dictionary object with the following columns per row:
        - src_code, language_code, src_url, src_name
    """
    cur.execute(' \
        SELECT code AS src_code, group_concat(language_code, "<_!lang/>") AS language_code, \
        s.name AS src_url, group_concat(s_i18n.name, "<_!lang/>") AS src_name \
        FROM source s \
        INNER JOIN source_i18n s_i18n ON s.code = s_i18n.source_code WHERE translated = 1 \
        GROUP BY src_code \
        ORDER BY src_url \
    ')
    return cur.fetchall()

def entry_csv(cur):
    """
    Generates CSV entry table, where each row contains an unique entry, including its content in all languages.

    Args:
        cur: SQL cursor object
    Returns:
        A dictionary object with the following columns per row:
        - title (en|ja|zh): Title of the entry in (language)
        - category (en|ja|zh): Category of the entry in (language)
        - content (en|ja|zh): Content of the entry in (language)
        - tl note (en|ja|zh): Translator's note in (language)
        - source (en|ja|zh): Source of the entry in (language)
        - glossary (en|ja|zh): Glossary that the entry belongs to in (language)
        - release date: Release date of the entry's source
        - page (en|ja|zh): Page number of the entry found in source
        - furigana (en|ja|zh): Furigana name of the entry
    """
    cur.execute(' \
        SELECT group_concat(e_i18n.title, \'","\'), group_concat(cat.category_name, \'","\'), \
               group_concat(IFNULL(e_i18n.content, ""), \'","\'), group_concat(IFNULL(e_i18n.note, ""), \'","\'), \
               group_concat(src.source_name, \'","\'), group_concat(IFNULL(src.source_section, ""), \'","\'), \
               group_concat(src.glossary_name, \'","\'), IFNULL(src.release_date, ""), IFNULL(src.page, ""), \
               e.furigana \
        FROM entry e \
        INNER JOIN en_index en ON e.en_index = en.code \
        INNER JOIN ja_index ja ON e.ja_index = ja.code \
        INNER JOIN entry_i18n e_i18n ON e.id = e_i18n.entry_id \
        INNER JOIN ( \
            SELECT entry_id, language_code, group_concat(name, "/") AS category, \
                   group_concat(t_name, "/") AS category_name, group_concat(type) AS c_type, \
                   group_concat(ordering) AS c_ordering \
            FROM ( \
                SELECT e_c.entry_id AS entry_id, c_i18n.language_code AS language_code, \
                       c.name AS name, c_i18n.name AS t_name, c.type AS type, e_c.ordering AS ordering \
                FROM category c \
                INNER JOIN category_i18n c_i18n ON c.id = c_i18n.category_id \
                INNER JOIN entry_category e_c ON c.id = e_c.category_id \
                ORDER BY e_c.ordering ASC \
            ) \
            GROUP BY entry_id, language_code \
            ORDER BY entry_id, language_code \
        ) AS cat ON e.id = cat.entry_id AND e_i18n.language_code = cat.language_code \
        INNER JOIN ( \
            SELECT s.code, s_i18n.language_code, s.name AS source, s_i18n.name AS source_name, \
                   s_i18n.part AS source_section, s.release_date, s.page, g_i18n.name AS glossary_name \
            FROM source s \
            INNER JOIN source_i18n s_i18n ON s.code = s_i18n.source_code \
            INNER JOIN glossary g ON s.glossary_id = g.id \
            INNER JOIN glossary_i18n g_i18n ON g.id = g_i18n.glossary_id AND s_i18n.language_code = g_i18n.language_code \
            ORDER BY s.code, s_i18n.language_code \
        ) AS src ON e.source_code = src.code AND e_i18n.language_code = src.language_code \
        GROUP BY e.id, e.name \
        ORDER BY e.furigana \
    ')
    return cur.fetchall()

def src_csv(cur):
    """
    Generates CSV source table.

    Args:
        cur: SQL cursor object
    Returns:
        A dictionary object with the following columns per row:
        - source codename: Machine name of the source material
        - release date: Source release date
        - page: Page number of the relevant glossary
        - name (en|ja|zh): Name of the source in (language)
        - glossary (en|ja|zh): Name of the glossary in (language)
    """
    cur.execute(' \
        SELECT s.name, s.release_date, s.page, \
               group_concat(st.name, \'","\'), \
               group_concat(st.part, \'","\') \
        FROM source s \
        INNER JOIN ( \
            SELECT * FROM source_i18n \
            ORDER BY source_i18n.language_code \
        ) AS st ON s.code = st.source_code \
        GROUP BY s.code \
        ORDER BY s.release_date, s.name \
    ')
    return cur.fetchall()

def index_en(cur):
    """
    Generates a list of all English indices and url.

    Args:
        cur: SQL cursor object
    Returns:
        A dictionary object with the following columns per row:
        - url: URL of index
        - str: Displayed name of index
    """
    cur.execute('SELECT code AS url, letter AS str FROM en_index GROUP BY url ORDER BY str')
    return cur.fetchall()

def index_ja(cur):
    """
    Generates a list of all Japanese indices and url.

    Args:
        cur: SQL cursor object
    Returns:
        A dictionary object with the following columns per row:
        - url: URL of index
        - str: Displayed name of index
    """
    cur.execute('SELECT gojuuon_code AS url, gojuuon AS str FROM ja_index GROUP BY url ORDER BY str')
    return cur.fetchall()

def book_src(cur, source_filter):
    """
    Returns information on a particualr source.

    Args:
        cur: SQL cursor object
    Returns:
        A dictionary object with the following columns per row:
        - language_code: Available languages
        - code: Source code
        - source_url: Machine name of the source
        - release date: Source release date
        - page: Page number of the relevant glossary
        - name (en|ja|zh): Name of the source in (language)
        - part (en|ja|zh): Name of the part in (language)
    """
    cur.execute(' \
        SELECT s.code AS code, s.name AS source_url, release_date, page, \
        group_concat(s_i18n.name, "<_!lang/>") AS source_name, \
        group_concat(s_i18n.part, "<_!lang/>") AS source_part, \
        group_concat(language_code, "<_!lang/>") AS language_code \
        FROM source s \
        INNER JOIN source_i18n s_i18n ON s.code = s_i18n.source_code \
        WHERE s.name = ' + source_filter + ' \
        ORDER BY s.name \
    ')
    return cur.fetchall()

def db2sql(db_path, output_path):
    """
    Dump db to sql file.

    Args:
        db_path: Path to dict.db
        output_path: Output location of resulting sql file
    Requires:
        db_path/dict.db
    Outputs:
        output_path/dict.sql
    """
    con = sqlite3.connect(db_path)
    with open(output_path + 'dict.sql', 'w', encoding='utf-8') as f:
        for line in con.iterdump():
            f.write('%s\n' % line)
    con.close()

def sql2import(sql_path, output_path):
    """
    Import sql file to db.

    Args:
        sql_path: Path to sql file
        output_path: Output location of resulting db file
    Requires:
        sql_path/dict.sql
    Outputs:
        output_path/dict.db
    """
    output_path = output_dir_exists(output_path)
    con = sqlite3.connect(output_path)
    cur = con.cursor()
    f = open(sql_path, 'r', encoding='utf-8')
    sql = f.read()
    cur.executescript(sql)
    con.close()