const util = require('util')
const fs = require('fs')

const readFile = util.promisify(fs.readFile)
const writeFile = util.promisify(fs.writeFile)

async function main() {
  const library = JSON.parse(await readFile(process.argv[2]))
  const filteredLibrary = []

  for (const item of library) {
    if (item.md5.endsWith('.svg')) {
      const svgText = (await readFile('in/' + item.md5)).toString()
      if (/<image/.test(svgText)) {
        console.log('Contains embedded image:', item.name)
        filteredLibrary.push(item)
      } else {
        console.log('Good:', item.name)
        filteredLibrary.push(item)
      }
    } else {
      console.log('Not an SVG:', item.name)
    }
  }

  await writeFile(process.argv[3], JSON.stringify(filteredLibrary, null, 4))
}

main()
