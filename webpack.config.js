const path = require('path');
const globule = require('globule');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const targetTypes = { ejs: 'html', js: 'js' };

const getEntriesList = (targetTypes) => {
	const entriesList = {};
	for (const [srcType, targetType] of Object.entries(targetTypes)) {
		const filesMatched = globule.find([`**/*.${srcType}`, `!**/_*.${srcType}`], { cwd: `${__dirname}/src` });

		for (const srcName of filesMatched) {
			const targetName = srcName.replace(new RegExp(`.${srcType}$`, 'i'), `.${targetType}`);
			entriesList[targetName] = `${__dirname}/src/${srcName}`;
		}
	}
	return entriesList;
}

const app = {
	entry: getEntriesList(targetTypes),
	output: {
		filename: '[name]',
		path: `${__dirname}/dist`
	},
	plugins: [],
}

for (const [targetName, srcName] of Object.entries(getEntriesList({ html: 'html' }))) {
	app.plugins.push(new HtmlWebpackPlugin({
		filename: targetName,
		template: srcName,
		inject: false,
	}));
}

module.exports = app;
