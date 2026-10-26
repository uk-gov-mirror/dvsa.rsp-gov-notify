const path = require('path');
const lambdaNames = require('./lambdas.json');

module.exports = {
	// One bundle per lambda, listed in lambdas.json
	entry: Object.fromEntries(
		lambdaNames.lambdas.map((name) => [name, `./src/functions/${name}.js`]),
	),

	// Write each lambda to .webpack/<name>/app.js
	output: {
		filename: '[name]/app.js',
		libraryTarget: 'commonjs2',
		path: path.resolve('.webpack'),
		// AWS SDK v3 uses dynamic imports; keep each lambda as a single file
		asyncChunks: false,
	},

	// Resolve .ts and .js extensions
	resolve: {
		extensions: ['.ts', '.js'],
	},

	// Target node
	target: 'node',

	mode: 'development',

	externals: {
		fsevents: 'require(\'fsevents\')',
	},

	module: {
		rules: [
			{
				test: /\.m?js$/,
				exclude: /node_modules/,
				use: {
					loader: 'babel-loader',
					options: {
						presets: [
							['@babel/preset-env'],
						],
					},
				},
			},
		],
	},

};
