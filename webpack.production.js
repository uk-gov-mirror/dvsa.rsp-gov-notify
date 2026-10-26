const fs = require('fs-extra');
const { merge } = require('webpack-merge');
const common = require('./webpack.config');
const lambdaNames = require('./lambdas.json');

const OUTPUT_FOLDER = './dist';

class BundlePlugin {
	/**
     * @param {{ archives: any; assets?: any; }} params
     */
	constructor(params) {
		this.archives = params.archives;
		this.assets = params.assets || [];
	}

	apply(compiler) {
		compiler.hooks.afterEmit.tap('zip-pack-plugin', async () => {
			this.archives.forEach(async (archive) => {
				await BundlePlugin.createArchive(archive.inputPath, archive.outputPath, archive.outputName, archive.ignore);
			});

			this.assets.forEach((asset) => {
				fs.copySync(asset.inputPath, asset.outputPath);
			});
		});
	}

	static async createArchive(inputPath, outputPath, outputName, ignore) {
		const { ZipArchive } = await import('archiver');
		if (!fs.existsSync(outputPath)) {
			fs.mkdirSync(outputPath);
		}
		const output = fs.createWriteStream(`${outputPath}/${outputName}.zip`);
		const archive = new ZipArchive();

		output.on('close', () => {
			console.log(`${archive.pointer()} total bytes`);
			console.log('archiver has been finalized and the output file descriptor has closed.');
		});
		archive.on('error', (err) => {
			throw err;
		});

		archive.pipe(output);
		archive.glob(
			'**/*',
			{
				cwd: inputPath,
				ignore,
			},
		);
		return archive.finalize();
	}
}

function getArchives() {
	return lambdaNames.lambdas.map((lambdaName) => ({
		inputPath: `.webpack/${lambdaName}`,
		outputPath: `${OUTPUT_FOLDER}`,
		outputName: `${lambdaName}`,
	}));
}

module.exports = () => {
	return merge(common, {
		mode: 'production',
		plugins: [
			// @ts-ignore
			new BundlePlugin({
				archives: getArchives(),
			}),
		],
	});
};
