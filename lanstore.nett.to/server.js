import http from 'http'
import fs from 'fs'
import path from 'path'
import https from 'https'

const WEBKUS_URL = 'https://demo.webkus.com'

function render(data) {
  const __dirname = new URL('.', import.meta.url).pathname
  const TEMPLATE = fs.readFileSync(
    path.join(__dirname, 'template.html'),
    'utf-8'
  )

  let html = TEMPLATE.replaceAll('[$ .Website.Name $]', data.name)
    .replaceAll('[$ .Website.Description $]', data.description)
    .replaceAll('[$ .Website.Logo $]', data.logo)
    .replaceAll('[$ .Template.BootstrapCSS $]', data.bootstrap_css)
    .replaceAll('[$ .Template.ExtendedCSS $]', data.extended_css)
    .replaceAll('[$ .Template.ExtendedHTML $]', data.extended_html)
    .replaceAll('[$ .Template.ExtendedJS $]', data.extended_js)
    .replaceAll('[$ .ContactURLs $]', data.contact_urls)
    .replaceAll('const API_URL = location.origin', 'const API_URL = "' + WEBKUS_URL + '"')
  return html
}

async function getData() {
  return new Promise((resolve, reject) => {
    https.get(WEBKUS_URL + '/api/info', (res) => {
      let data = ''
      res.on('data', chunk => {
        data += chunk
      })

      res.on('end', () => {
        const json = JSON.parse(data)
        resolve(json)
      })
    }).on('error', (err) => {
      console.error('Error fetching data: ', err.message)
      process.exit(1)
    })
  })
}

const server = http.createServer(async (req, res) => {
  const data = await getData()
  const html = render(data)
  res.writeHead(200, { 'Content-Type': 'text/html' })
  res.end(html)
})

server.listen(3000, () => {
  console.log('Server running → http://localhost:3000')
})
