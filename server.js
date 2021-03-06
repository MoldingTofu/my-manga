const express = require('express')
const cloudscraper = require('cloudscraper')
const cheerio = require('cheerio')

//const m = '/Manga/Onepunch-Man'
const m = '/Manga/Gintama'
//const m = '/Manga/Oyasumi-Punpun'
const k = 'https://kissmanga.com'
const port = 7883
const app = express()
const router = express.Router()

app.use(express.static('public'))
router.use(function(req, res, next) {
    // do logging
    // console.log("Server in use");
    next() // make sure we go to the next routes and don't stop here
})

function getChapters(html) {
  const $ = cheerio.load(html)
  let chapters = $('.listing')
    .find('a')
    .map(function(i, val) {
      let l = $(this).attr('href')
      return l
    }).get()

  return chapters
}

function getPages(html) {
  let key = html.match(/var _\w* = \[\".*\"\]/g)
  let val = key[0].substring(key[0].indexOf('"')+1, key[0].lastIndexOf('"'))
  let pages = html.match(/\(wrapKA\((.*)\)/g)
  let links = pages.map(p => {
    let hash = p.substring(p.indexOf('"')+1, p.lastIndexOf('"'))
    return hash
  })
  return {'hash': val, 'pages': links}
}

async function handle(i) {
  let chapters = await cloudscraper.get(k+m).then(getChapters, console.error)
  let index = chapters.length - i
  let page = await cloudscraper.get(k+chapters[index]).then(getPages, console.error)
  return page
}

async function search(word) {
  console.log(`searching for ${word}`)
  let options = {
    uri: 'https://kissmanga.com/Search/SearchSuggest',
    form: {type: 'Manga', keyword: word}
  }
  let page = await cloudscraper.post(options)//.then(console.log, console.error)
  return page
}

async function advanceSearch(word) {
  console.log(`advsearching for ${word}`)
  let options = {
    uri: 'https://kissmanga.com/AdvanceSearch',
    form: {mangaName: word}
  }
  let page = await cloudscraper.post(options)//.then(console.log, console.error)
  return page
}

router.route('/api/read').get(async function(req, res) {
  //console.log(req.query.c)
  let c = req.query.c
  let page = await handle(c)
  console.log(`viewing chapter ${c}`)
  res.send(page)
})

router.route('/search').get(async function(req, res) {
  let q = req.query.q
  let page = await search(q)
  res.send(page)
})

router.route('/advsearch').get(async function(req, res) {
  let q = req.query.q
  let page = await advanceSearch(q)
  res.send(page)
})

app.use(router)
app.listen(port, () => console.log(`listening on port ${port}`))
