# California Independent Expenditures Search

This project is a search tool to discover independent expenditures in California.  For more
information, visit [here](http://maplight.org/california/guide/data/independent-expenditures).


### Installation

```sh
$ git clone https://<username>@bitbucket.org/maplighttech/california-ie-search.git
$ cd ie
$ npm install
$ webpack --watch
```

Then, in a browser, go to http://localhost:3000/

### Build and Deployment

We are using [Webpack](http://webpack.github.io/docs/) for our build process.  For a good primer of Webpack, visit [here](https://github.com/petehunt/webpack-howto).

To build this project, you can use the following webpack commands (or a combination of them):

webpack -d  
includes source maps for debugging

webpack --watch  
sets up a watch on all files in the webpack.config.js and rebuilds when any of them change

webpack -p  
production build, minifies and uglifies files