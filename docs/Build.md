# Build

This documentation will cover both the [building of the UI code](#ui-build), and also how it is [built and integrated with Strimzi](#ui-build-into-strimzi).

## UI build

This UI is built using two tools, [Babel](https://babeljs.io/) and [Webpack](https://webpack.js.org/). Webpack acts as our main build and bundling tool, while Babel acts as a transpiler - meaning the UI codebase can make use of the latest and greatest ECMAscript syntax, and Babel will polyfill where appropriate to provide cross browser support. The below will detail choices we have made regarding how the build works, configuration and considerations to be aware of, and the end output. The aim of this stack is to have a fast and efficient built for day to day development, but also the smallest possible built bundles so users do not need to wait a long time for all required assets to be retrieved by their browser.

### Treeshaking

To maintain a small built bundle size, we take advantage of [Webpack's treeshaking capabilities](https://webpack.js.org/guides/tree-shaking/) to only include what is used in the built output. This will require developers of the UI to be aware of the following two points:

1. Where possible, use ECMAscript 6/ES2015 versions of 3rd party dependencies. For example, rather than using `lodash`, use `lodash-es`. This is so the Webpack can detect the various `import` and `export` of modules, and thus remove any which are never used.
2. Modules exported in this codebase are expected to be pure - ie no side effects while `import`ing or `export`ing the content of a module. As a result, `sideEffects: false` is set in the `package.json`, meaning Webpack when building in production mode can prune functions and whole modules if required (and thus side effects, if any, may not occur if that module is not required). If a module/file does have side effects, these can be included still, by adding them to `sideEffects` as an array, i.e. `sideEffects: ['path/to/module/with/sideEffect.js']`. This should however only be a last resort.

### Webpack setup

Webpack (and it's plugins) are highly customisable. This section will detail the choices we have made around how and what is built, where it is built to, and the roles and responsibilities of the various plugins which enable this.

#### Webpack aliases

The UI makes extensive use of Webpack's [alias](https://webpack.js.org/configuration/resolve/#resolvealias) features. This is done for two reasons:

1. It allows for abstraction at build time. By importing view layers via an alias the resolution of that alias can be changed at build time, enabling the ability to swap view layer implementations without needing to make changes in the production code.
2. It makes importing code far cleaner and easier. For example, a traditional import of a module in another directory:

```
import { myFunction } from '../../Modules/MyModule';
```

with the following Webpack configuration:

```
...
alias: {
    MyModule: path.resolve(__dirname, 'Modules/MyModule')
}
...
```

becomes

```
import { myFunction } from 'MyModule'
```

For convenience, all top level module directories from `client` will be automatically aliased via a helper in the webpack configuration, as well defining a view alias.

#### Webpack configuration and plugins

In addition to aliasing, the webpack configuration will be as follows:

| Option        | Value           | Purpose  |
| ------------- | ------------- | -----:|
| entry      | `client/Bootstrap/index.js` | Build entry point. *Note:* the `scss/css` is expected to be imported by individual view layer code, which is imported (directly or indirectly) from this file. Details to follow in Code Style approach documentation regarding this styling approach and why.  |
| mode      | `production` or `development` (provided via config file used) | Build mode. If production, code will be minified and have developer helpers (warning etc) removed from the built output |
| output.path      | `dist` (via constant) | All output to be placed in the `dist` directory |
| output.publicPath      | `` (empty string) | The public path of static/public content included by Webpack. Is relative to the URL. |
| output.filename       | `[name].bundle.js` | Name of the built entry bundle. Will be `main.bundle.js` once built as we have one entry point |
| module.rules      | Array of rules - [see here for details](#module-rules) | Rules/tests to run on modules being built. Depending on the file being parsed, different transformations should be run |
| plugins      | Array of plugins - [see here for details](#webpack-plugins) | Additional tools to customise the build to produce the required output |
| optimization.minimize      | `true` if production build, else false | Use Webpack minimization only when performing a production build |
| optimization.minimizer      | [[`TerserPlugin`](https://webpack.js.org/plugins/terser-webpack-plugin/) with [this configuration](#terser-plugin-configuration), `optimize-css-assets-webpack-plugin`] | When a production build, minimise the built output using TerserPlugin and optimize-css-assets-webpack-plugin |
| optimization.splitChunks.chunks      | `all` | When building, check and chunk up code as much as possible, regardless of what/how it is used |
| optimization.splitChunks.name      | `false` | Recommended setting - keeps chunk names consistent |
| resolve.alias      | Array of aliases | [See section above](#webpack-aliases) |
| devServer      | Object | [See section below](#webpack-dev-server) |

##### Module rules

Webpack allows file specific loaders or utilities to be invoked as a part of the build process. In the case of this build, these are as follows:

| Rule        | Plugin/loader(s)           | Purpose  |
| ------------- | ------------- | -----:|
| `/(\.css\|.scss)$/`      | `style-loader` (dev only), `miniCssExtractPlugin.loader` (production only), `css-loader`, `sass-loader` | Handle scss/css loading/references. If dev mode, use `style-loader` for speed, else use `miniCssExtractPlugin.loader` (in combination with the `miniCssExtractPlugin` plugin) to produce/emi css file(s) |
| `/(\.js)$/`      | `babel-loader` | Perform babel transpile on all JS files. This will be configured with presets for recent browsers, and enable caching to improve build performance |
| `/\.(woff(2)?\|ttf\|eot)$/`      | `file-loader` | For any font file, use file-loader to package the font to the `output.path` and replace/update any imports of those fonts to this location. These will be directed to a 'fonts' directory |
| `/\.(jpg\|gif\|png\|svg)$/`      | `file-loader` | For any image file, use file-loader to package the image to the `output.path` and replace/update any imports of those images to this location. These will be directed to a 'images' directory |

##### Webpack plugins

We also make use of the following plugins:

| Plugin        |  Responsibility  |
| ------------- |  -----:|
| TerserPlugin      |  When a production build, minimises the built JS output |
| optimize-css-assets-webpack-plugin      | Minimises/dedupes built css output |
| html-webpack-plugin      | Handles templating of built output into a provided index.html file |
| mini-css-extract-plugin      | Compresses and emits a css file(s) containing all styling for the UI |
| compression-webpack-plugin      | Compresses built output further using `gzip` algorithm, and emits these compressed files. Depending on headers provided by the browser, these gziped versions will be served to the browser, rather than the uncompressed versions |

##### Terser plugin configuration

These options will all be provided to the TerserPlugin via it's constructor.

| Option        | Value           | Purpose  |
| ------------- | ------------- | -----:|
| terserOptions.output.comments      | `false` | Remove all comments in the output |
| terserOptions.output.preamble      | Strimzi copyright header | Adds the Strimzi header to the built JS output |
| terserOptions.keep_classnames      | `true` | Keep original class names |
| terserOptions.keep_fnames      | `true` | Keep original function names |
| terserOptions.mangle.safari10      | `true` | Works around known Safari issues |

#### Webpack output

Given the above configuration, built output will be created in a `dist` directory. This will contain:
```
dist/
    index.html
    favicon.ico
    main.bundle.js
    <hash1>.bundle.js
    <hash2>.bundle.js
    ....
    main.bundle.js.gz
    <hash1>.bundle.js.gz
    <hash2>.bundle.js.gz
    ....
    styling.css
    images/
        image1.svg
        ...
    fonts/
        font1.ttf
        ...
```

#### Webpack dev server

To enable efficient development, this UI makes use of [webpack-dev-server](https://webpack.js.org/configuration/dev-server/). This re-uses the above Webpack configuration, but adds helpful developer features, such as file watching and hot reloading of changes. When run, all content is built and served from memory, with static assets such as images being served from the configured public path. Configuration of the dev server is in the `devServer` section of the `webpack.config.js` file, and a brief summary of each option can be found below:

| Option        | Value           | Reason  |
| ------------- | ------------- | -----:|
| contentBase      | `dist` (via constant) | Source for static files. This is the built output directory, where static files will land as a part of the first build during dev start up |
| watchContentBase      | `true` | Reload if a static file changes |
| compress      | `true` | Serve all content via .gz files - makes rebuilds/hot changes faster to retrieve |
| inline      | `true` | Enforce default setting, recommended when using `hot` reloading option |
| hot      | `true` | Enables hot reloading of content when files change |
| proxy      | TBD | Used to proxy requests for backend data when developing the UI |
| overlay.warnings      | `false` | In case of an warning, do not show an overlay |
| overlay.errors      | `true` | In case of an error, show an overlay over the UI showing it |

## UI build into Strimzi

This section to be completed once build/packaging integration with Strimzi has been agreed upon.

