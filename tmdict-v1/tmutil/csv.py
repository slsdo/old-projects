from tmutil.sql import *
from tmutil.util import *

def db2csv(db_path, output_path):
    """
    Prints out entry/source tables to CSV files in the DIST directory.

    Args:
        db_path: Path to dict.db
        output_path: Output location of resulting CSV files
    Outputs:
        output_path/dict.csv
        output_path/source.csv
    """
    ## Entry Table
    output_path = output_dir_exists(output_path)
    data = sql2db(db_path, 'entry_csv')
    with open(output_path + 'dict.csv', 'w', encoding='utf-8') as csv_file:
        csv_file.write('\ufeff') # UTF-8 With BOM
        # Process header names in first row, then iterates through each row of entry
        header = ('"title_en","title_ja","title_zh","category_en","category_ja","category_zh",'
                '"content_en","content_ja","content_zh","note_en","note_ja","note_zh",'
                '"source_en","source_ja","source_zh","source_section_en","source_section_ja","source_section_zh",'
                '"glossary_en","glossary_ja","glossary_zh","release_date","page","furigana"')
        csv_file.write(header + '\n')
        for row in data:
            for item in row:
                csv_file.write('"' + str(item) + '",')
            csv_file.write('\n')
    print(output_path + "dict.csv'")

    ## Source Table
    data = sql2db(db_path, 'src_csv')
    with open(output_path + 'source.csv', 'w', encoding='utf-8') as csv_file:
        csv_file.write('\ufeff') # UTF-8 With BOM
        # Process header names in first row, then iterates through each row of source
        csv_file.write('"key","date","page","title_en","title_zh","title_ja","section_en","section_zh","section_ja"\n')
        for row in data:
            for item in row:
                csv_file.write('"' + str(item) + '",')
            csv_file.write('\n')
    print(output_path + "source.csv'")