var webpack = require('webpack');

module.exports = {
  entry: './public/js/caie.js',
  output: {
    filename: './public/js/caie.min.js'       
  }//,
 //  plugins: [
 //  	new webpack.optimize.UglifyJsPlugin({
	//     compress: {
	//         warnings: false
	//     }
	// })
 //  ]
};