import { Configuration } from 'webpack';
import HTMLPlugin from 'html-webpack-plugin';
import CSSPlugin from 'mini-css-extract-plugin';
import { loader as TypedCSSLoader } from '@nice-labs/typed-css-modules';
import HTMLPartialPlugin from 'html-webpack-partials-plugin';

const configuration: Configuration = {
  context: __dirname,
  devtool: 'source-map',
  optimization: { splitChunks: { chunks: 'all' } },
  resolve: { extensions: ['.ts', '.tsx', '.js', '.json'] },
  module: {
    rules: [
      {
        test: /.tsx?$/,
        loader: require.resolve('ts-loader'),
      },
      {
        test: /\.css$/,
        use: [
          CSSPlugin.loader,
          {
            loader: require.resolve('css-loader'),
            options: { sourceMap: true },
          },
        ],
      },
      {
        test: /\.scss$/,
        use: [
          CSSPlugin.loader,
          {
            loader: require.resolve('css-loader'),
            options: {
              sourceMap: true,
              importLoaders: 2,
              modules: true,
              esModule: true,
            },
          },
          {
            loader: TypedCSSLoader,
            options: { mode: 'local' },
          },
          require.resolve('sassjs-loader'),
        ],
      },
    ],
  },
  devServer: { hot: false, inline: false, https: true },
  plugins: [
    new HTMLPlugin({
      title: 'MOPS·VIDA PM Watchdog',
    }),
    new CSSPlugin({ filename: '[name].css' }),
    new HTMLPartialPlugin({
      path: require.resolve('./scripts/partials/analytics.html'),
      location: 'head',
      options: { id: 'UA-168944052-3' },
    }),
  ],
};

export default configuration;
