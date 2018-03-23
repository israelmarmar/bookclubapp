module.exports = {
	mode: 'development',
    entry: './app.jsx',
    output: {
    	
        filename: 'app.js'
    },

    module: {
    rules: [{
        test: /\.js$|\.jsx$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        query: {
            presets: ['es2015','react', 'stage-1']
        }
    }]
	}
}