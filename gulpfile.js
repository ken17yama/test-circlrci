const gulp = require("gulp");
const tap = require('gulp-tap');
const fs = require("fs");
const txtreplace = require("gulp-replace");

/**
 * get template code
 */
function getSource(pathName) {
	let valid = false;
	try {
		fs.statSync(`${pathName}`);
		valid = true;
	} catch (err) {
		valid = false;
	}
	return valid
		? fs
			.readFileSync(`${pathName}`, "utf-8") // テンプレートのソース取得
			// .replace(/<!DOCTYPE html>(.*)(\n|\r|\r\n)/g, "") // テンプレート内のDOCTYPE宣言を削除
			.replace(/(\n|\r|\r\n)$/g, "") // 末尾の空行を削除
		: ``; // 見つからなかった場合のメッセージ
}

function replaceDynamicVariables(file) {
	const cutStr = 'src\\html\\'
	// console.log(file.path)
	var fileToPath = file.path.slice(file.path.indexOf(cutStr) + cutStr.length);
	console.log(fileToPath)
	const paths = fileToPath.split('\\');
	console.log(paths);

	let navItems = ''
	const re_title = /(?<=<title>).*?(?=<\/title>)/i

	for (const path of paths) {
		console.log(path);

		// URLを組み立てる必要あり（どうする！！）
		try {
			const contents = fs.readFileSync('src/html/index.html', 'utf8')
			console.log(contents.match(re_title))
		} catch (err) {
			console.log(err)
		}

		navItems += `<li><a href="${pageURL}">${pageTitle}</a></li>`
	}

	file.contents = new Buffer(String(file.contents)
		.replace('<!-- #include const="breadcrumb" -->', navItems)
	);
}

/**
 * html
 */
function html() {
	return (
		gulp
			.src(['src/html/**/*.*', '!src/html/common/**/*.*'])
			/* Includeをたどってソースを合成 */
			.pipe(
				// virtualの値が「p1」に入る
				txtreplace(/<!--\s?#include virtual="(.+)"\s?-->/g, (match, p1) => {
					const result = getSource(`src/html/common/${p1}.html`);
					// 再帰的にIncludeを合成
					function getInclude(string, complete) {
						const str = string.replace(
							/<!--\s?#include virtual="(.+)"\s?-->/g,
							(mc, p) => {
								return getSource(`src/html/common/${p}.html`);
							}
						);
						return complete
							? string
							: getInclude(
								str,
								!str.match(/<!--\s?#include virtual="(.+)"\s?-->/g)
							);
					}
					return getInclude(
						result,
						!result.match(/<!--\s?#include virtual="(.+)"\s?-->/g)
					);
				})
			)
			.pipe(tap(replaceDynamicVariables))
			// .pipe(txtreplace('<!-- #include const="breadcrumb" -->', (match, p1, offset, string) => {
			// 	console.log('-------------------------')
			// 	return '<ul><li>aaa</li></ul>'
			// })
			// )
			// .pipe(txtreplace('<!-- #include const="breadcrumb" -->', '<ul><li></li></ul>'))
			.pipe(gulp.dest(`dist`))
	);
}

// task
exports.html = html;
