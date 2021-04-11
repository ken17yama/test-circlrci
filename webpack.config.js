const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
	entry: {
		common: './src/js/common.js',
		index: './src/js/index.js'
	},
	output: {
		path: path.resolve(__dirname, 'dist'),
		filename: '[name].js',
	},
	// module: {
	// 	rules: [
	// 		{
	// 			test: /\.html$/i,
	// 			use: [
	// 				{
	// 					loader: 'html-loader',
	// 					options: {
	// 						esModule: false,
	// 					}
	// 				}
	// 			]
	// 		}
	// 	]
	// },
	plugins: [
		new HtmlWebpackPlugin({
			template: path.resolve(__dirname, 'src', 'html', 'index.html'),
			filename: 'html/index.html'
		}),
		new HtmlWebpackPlugin({
			template: path.resolve(__dirname, 'src', 'html', 'sample.html'),
			filename: 'html/sample.html',
			// 指定したchunkのみを含める
			chunks: ['common'],
		}),
	],
}
