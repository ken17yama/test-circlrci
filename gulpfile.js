const gulp = require("gulp");
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

/**
 * html
 */
function html() {
	return (
		gulp
			.src(['src/html/**/*.*', '!src/html/common/**/*.*'])
			/* Includeをたどってソースを合成 */
			.pipe(
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
			.pipe(gulp.dest(`dist`))
	);
}

// task
exports.html = html;
