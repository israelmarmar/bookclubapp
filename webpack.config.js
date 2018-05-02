module.exports = {
	mode: 'development',
    entry: ['./app.jsx','./styles.scss'],
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
    },
     {
                    test: /\.scss$/,
                    use: [
                        {
                            loader: 'file-loader',
                            options: {
                                name: '[name].css',
                                outputPath: './'
                            }
                        },
                        {
                            loader: 'extract-loader'
                        },
                        {
                            loader: 'css-loader'
                        },
                        {
                            loader: 'sass-loader'
                        }
                    ]
        }
     ]
	}
}