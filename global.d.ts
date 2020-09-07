declare module 'html-webpack-partials-plugin' {
  import webpack from 'webpack';

  interface PluginOptions {
    path: string;
    inject?: boolean;
    location?: 'head' | 'body';
    priority?: 'high' | 'low';
    template_filename?: string | string[];
    options?: unknown;
  }

  class Plugin extends webpack.Plugin {
    constructor(options: PluginOptions);
  }

  export = Plugin;
}
