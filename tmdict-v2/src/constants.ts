/**
 * Project directories
 */
export const PATHS = {
  out: './dist',
  outAppData: './src/components/data',
  outSrc: './dist/src',
  srcStaticAssets: './src/static',
}

/**
 * HTML elements for static site generation
 */
export const HTML_CONTENT = {
  doctype: '<!DOCTYPE html>\n',
  metaCharset: 'utf-8',
}

/**
 * Data sources
 */
export const DATA_SRC = {
  category: './data/category',
  entry: './data/entry',
  glossary: './data/glossary',
  img: './data/img',
  page: './data/page',
  site: './data/site',
  source: './data/source',
}

/**
 * Page type
 */
export const PAGE_TYPE = {
  app: 'app',
  entry: 'entry',
  page: 'page',
}

/**
 * App const
 */
export const APP = {
  cat: 'category',
  en: 'en',
  ja: 'ja',
  src: 'source',
}

/**
 * Static data
 */
export const DATA: any = {
  common: {
    about: { en: 'About', ja: 'に関して', zh: '关于' },
    book: { en: 'Book', ja: '書', zh: '书本' },
    contribute: { en: 'contribute', ja: '支援', zh: '应援' },
    index: { en: 'Home', ja: 'ホーム', zh: '首页' },
    language: ['en', 'zh', 'ja'],
    link: { en: 'Link', ja: 'リンク', zh: '链接' },
    misc: { en: 'Misc', ja: 'その他', zh: '其他' },
    missing: { en: 'help translate', ja: '支援', zh: '帮忙翻译' },
    notes: { en: "Translator's Notes", ja: '翻訳者注', zh: '译者注' },
    report: { en: 'report error', ja: 'エラー報告', zh: '报告错误' },
    return: { en: 'Return', ja: 'リターン', zh: '返回' },
    search: { en: 'Search', ja: '検索', zh: '搜索' },
    side: {
      en:
        '<p>TMdict is a growing collection of glossaries from works by Type-Moon.</p><p>It presents the content in a light-weight, simple format that can be sorted and searched.</p><p>There are currently <span class="highlight">935</span> terms, under <span class="highlight">98</span> categories, from <span class="highlight">18</span> sources, and available in <span class="highlight">3</span> languages: <span class="highlight">English</span>, <span class="highlight">Chinese</span>, and <span class="highlight">Japanese</span>.</p><h3>Contribute</h3><p>Have a question? Find an error? Want to contribute? <a href="../contact/">Contact us</a>!</p>',
      ja:
        '<p>TMdict は、ゲーム、書籍、アニメなどTYPE-MOON の作品のボキャブラリーを収録していくプロジェクトです。</p><p>コンテンツは軽量かつシンプルなフォーマットで、用語の検索や並べ替えが可能です。</p><p>現時点で<span class="highlight">935</span>の用語を<span class="highlight">18</span>件のソースから収録。<span class="highlight">98</span>のカテゴリーに分類し、<span class="highlight">英語</span>、<span class="highlight">中国語</span>、<span class="highlight">日本語</span>の3ヵ国語で掲載しています。</p><h3>お問合わせ</h3><p>ご質問やエラーのご連絡、またご協力については<a href="../contact/">お問い合わせください</a>。</p>',
      zh:
        '<p>型月辞典是一个在不断扩展的，以Type-Moon游戏，书，动漫等作品的词条为基础的网站。</p><p>本网站注重构造简单，方便快捷的模式，并提供一些简单的分类和搜索功能。</p><p>目前网站整理了<span class="highlight">935</span>个用语，为<span class="highlight">98</span>个类别，来自<span class="highlight">18</span>个来源，提供<span class="highlight">3</span>种语言：<span class="highlight">英文</span>，<span class="highlight">中文</span>和<span class="highlight">日文</span>。</p><h3>应援</h3><p>有问题？碰到错误或不顺的地方了？想帮忙翻译或整理资源？请<a href="../contact/">联系我们</a>！</p>',
    },
    site: { en: 'Site', ja: 'サイト', zh: '网站' },
    version: '2.5.3',
  },
  en: {
    _: { id: '_', name: '#' },
    a: { id: 'a', name: 'a' },
    b: { id: 'b', name: 'b' },
    c: { id: 'c', name: 'c' },
    d: { id: 'd', name: 'd' },
    e: { id: 'e', name: 'e' },
    f: { id: 'f', name: 'f' },
    g: { id: 'g', name: 'g' },
    h: { id: 'h', name: 'h' },
    i: { id: 'i', name: 'i' },
    j: { id: 'j', name: 'j' },
    k: { id: 'k', name: 'k' },
    l: { id: 'l', name: 'l' },
    m: { id: 'm', name: 'm' },
    n: { id: 'n', name: 'n' },
    o: { id: 'o', name: 'o' },
    p: { id: 'p', name: 'p' },
    q: { id: 'q', name: 'q' },
    r: { id: 'r', name: 'r' },
    s: { id: 's', name: 's' },
    t: { id: 't', name: 't' },
    u: { id: 'u', name: 'u' },
    v: { id: 'v', name: 'v' },
    w: { id: 'w', name: 'w' },
    x: { id: 'x', name: 'x' },
    y: { id: 'y', name: 'y' },
    z: { id: 'z', name: 'z' },
  },
  ja: {
    a: { id: 'a', name: 'あ', gyo: '_' },
    i: { id: 'i', name: 'い', gyo: '_' },
    u: { id: 'u', name: 'う', gyo: '_' },
    e: { id: 'e', name: 'え', gyo: '_' },
    o: { id: 'o', name: 'お', gyo: '_' },
    ka: { id: 'ka', name: 'か', gyo: 'k' },
    ki: { id: 'ki', name: 'き', gyo: 'k' },
    ku: { id: 'ku', name: 'く', gyo: 'k' },
    ke: { id: 'ke', name: 'け', gyo: 'k' },
    ko: { id: 'ko', name: 'こ', gyo: 'k' },
    sa: { id: 'sa', name: 'さ', gyo: 's' },
    shi: { id: 'shi', name: 'し', gyo: 's' },
    su: { id: 'su', name: 'す', gyo: 's' },
    se: { id: 'se', name: 'せ', gyo: 's' },
    so: { id: 'so', name: 'そ', gyo: 's' },
    ta: { id: 'ta', name: 'た', gyo: 't' },
    chi: { id: 'chi', name: 'ち', gyo: 't' },
    tsu: { id: 'tsu', name: 'つ', gyo: 't' },
    te: { id: 'te', name: 'て', gyo: 't' },
    to: { id: 'to', name: 'と', gyo: 't' },
    na: { id: 'na', name: 'な', gyo: 'n' },
    ni: { id: 'ni', name: 'に', gyo: 'n' },
    nu: { id: 'nu', name: 'ぬ', gyo: 'n' },
    ne: { id: 'ne', name: 'ね', gyo: 'n' },
    no: { id: 'no', name: 'の', gyo: 'n' },
    ha: { id: 'ha', name: 'は', gyo: 'h' },
    hi: { id: 'hi', name: 'ひ', gyo: 'h' },
    fu: { id: 'fu', name: 'ふ', gyo: 'h' },
    he: { id: 'he', name: 'へ', gyo: 'h' },
    ho: { id: 'ho', name: 'ほ', gyo: 'h' },
    ma: { id: 'ma', name: 'ま', gyo: 'm' },
    mi: { id: 'mi', name: 'み', gyo: 'm' },
    mu: { id: 'mu', name: 'む', gyo: 'm' },
    me: { id: 'me', name: 'め', gyo: 'm' },
    mo: { id: 'mo', name: 'も', gyo: 'm' },
    ya: { id: 'ya', name: 'や', gyo: 'y' },
    yu: { id: 'yu', name: 'ゆ', gyo: 'y' },
    yo: { id: 'yo', name: 'よ', gyo: 'y' },
    ra: { id: 'ra', name: 'ら', gyo: 'r' },
    ri: { id: 'ri', name: 'り', gyo: 'r' },
    ru: { id: 'ru', name: 'る', gyo: 'r' },
    re: { id: 're', name: 'れ', gyo: 'r' },
    ro: { id: 'ro', name: 'ろ', gyo: 'r' },
    wa: { id: 'wa', name: 'わ', gyo: 'w' },
    wi: { id: 'wi', name: 'ゐ', gyo: 'w' },
    we: { id: 'we', name: 'ゑ', gyo: 'w' },
    wo: { id: 'wo', name: 'を', gyo: 'w' },
  },
  gyo: {
    _: { id: '_', name: 'あ' },
    k: { id: 'k', name: 'か' },
    s: { id: 's', name: 'さ' },
    t: { id: 't', name: 'た' },
    n: { id: 'n', name: 'な' },
    h: { id: 'h', name: 'は' },
    m: { id: 'm', name: 'ま' },
    y: { id: 'y', name: 'や' },
    r: { id: 'r', name: 'ら' },
    w: { id: 'w', name: 'わ' },
  },
}
