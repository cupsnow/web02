const merge = require('webpack-merge');
const config = require('./webpack.config');

module.exports = merge(config, {
	devtool: 'inline-source-map',
	devServer: {
		contentBase: config.output.path,
		watchContentBase: true,
		host: '0.0.0.0',
	}
});
