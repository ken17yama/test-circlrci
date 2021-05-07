const fs = require('fs')

const re_title = /(?<=<title>).*?(?=<\/title>)/i

try {
	const contents = fs.readFileSync('src/html/index.html', 'utf8')
	console.log(contents.match(re_title))
} catch (err) {
	console.log(err)
}
