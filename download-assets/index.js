'use strict'

const fs = require('fs')
const util = require('util')
const http = require('http')

const readFile = util.promisify(fs.readFile)
const httpGet = util.promisify(http.get)

async function download(url, outFile) {
  return new Promise(res => {
    const out = fs.createWriteStream(outFile)
    out.on('finish', res)

    httpGet(url, response => {
      response.pipe(out)
    })
  })
}

async function main() {
  const file = process.argv[2]

  const libraryText = await (async () => {
    try {
      return await readFile(file)
    } catch(error) {
      console.error('Failed to read file:', file)
      process.exit(1)
    }
  })()

  const library = JSON.parse(libraryText)
  const len = library.length

  for (let i = 0; i < len; i++) {
    const item = library[i]
    const { name, md5, rawURL } = item

    console.log(`${i+1}/${len} \x1b[1m${name}\x1b[0m (${md5})`)

    // TODO: Actually bother with rawURL assets, which are apparently a thing
    // but not something I noticed?
    const url = `http://cdn.assets.scratch.mit.edu/internalapi/asset/${md5}/get/`
    const out = `out/${md5}`
    await download(url, out)
  }

  console.log('Done')
}

main()
