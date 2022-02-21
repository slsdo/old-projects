#!/usr/bin/env python
import argparse
from tmutil import *

# Paths for required files and directories
DB_PATH = './dict/dict.db'
CONFIG_PATH = './src/config.json'
SRC_DIR = './src/'
TEMPLATE_PATH = SRC_DIR + 'html/'
OUTPUT_DIR = './dist/'

"""
CLI for generating the tmdict website, basic usage is as follows:

    >> python build.py [command] [options]

html [-x]
  - Generates static HTML pages of entries from dict.db. By default all relative
    links points to extension-less HTML links (e.g. tmdict.com/page). If -x flag is enabled,
    the pages generated will contain links with HTML extension (e.g. tmdict.com/page.html).

js [-s]
  - Generates JavaScript objects (in JSON format). By default a content-less (title, categories,
    sources only) objects is generated for the frontpage entry list to be used by React. If -s
    flag is enabled, the output js file will be formated to be used by Tipue Search.

csv
  - Generates two CSV files, one of all the entries in dict.db, the other a table of all
    the sources used. Each table lists the contents by row, with each row containing multioke
    languages

gls
  - Generates glossary-related files

install/develop
  - Uses setuptools to install dependencies
"""
if __name__ == '__main__':
    # Parse command line arguments and output data
    parser = argparse.ArgumentParser(description="Generates the TMdict site.")
    parser.add_argument('input', help="export source data to specified format")
    parser.add_argument('-p', '--page', action="store_true", help="do not export entry pages")
    parser.add_argument('-x', '--extension', action="store_true", help="export html with extension")
    args = parser.parse_args()

    if args.input == 'html': # Generate HTML
        print("Output to html...\n...")
        html.db2html(TEMPLATE_PATH, DB_PATH, CONFIG_PATH, OUTPUT_DIR, args.extension, args.page)
    elif args.input == 'js': # Generate js
        print("Output to js...\n...")
        js.db2js(DB_PATH, SRC_DIR, CONFIG_PATH, OUTPUT_DIR)
    elif args.input == 'yml': # Generate yml
        print("Output to yml...\n...")
        html.db2yaml(TEMPLATE_PATH, DB_PATH, CONFIG_PATH, './yml/', args.extension, args.page)
    elif args.input == 'csv': # Generate CSV
        print("Output to csv...\n...")
        csv.db2csv(DB_PATH, OUTPUT_DIR)
    elif args.input == 'book': # Generate book/glossary
        print("Generating book stuff...\n...")
        js.db2glossaryjs(DB_PATH, CONFIG_PATH, OUTPUT_DIR)
        html.db2book(TEMPLATE_PATH, DB_PATH, OUTPUT_DIR, args.extension)
    elif args.input == 'sqldump': # Generate sql dump
        print("Generating sql dump...\n...")
        sql.db2sql(DB_PATH, '../dict/')
    elif args.input == 'sqlimport': # Import sql dump
        print("Generating sql db...\n...")
        sql.sql2import('../dict/dict.sql', './dist/dict.db')
    print("Done!")