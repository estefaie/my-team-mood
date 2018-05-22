export const entry = './src/index.js';
export const output = {
  path: __dirname + '/public',
  filename: 'bundle.js'
};
export const module = {
  loaders: [
    {
      test: /\.js$/,
      loader: 'babel-loader'
    }
  ]
};