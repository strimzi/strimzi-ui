# Build

This documentation will cover both the [building of the UI client and server code](#ui-client-and-server-build), and also how the output of these builds is [built and integrated with Strimzi](#ui-build-into-strimzi).

## UI client and server build

This UI codebase (client and server) is built using two tools, [TypeScript](https://www.typescriptlang.org/) and [Webpack](https://webpack.js.org/). Webpack acts as our main build and bundling tool, while TypeScript acts as a transpiler - meaning the UI codebase can make use of the latest and greatest ECMAscript syntax, and TypeScript will polyfill where appropriate to provide cross browser support. The below will detail choices we have made regarding how the build works, configuration and considerations to be aware of, and the end output. The aim of this stack is to have a fast and efficient build for day to day development, but also the smallest possible built bundles so users do not need to wait a long time for all required assets to be retrieved by their browser.

### Treeshaking

To maintain a small built bundle size, we take advantage of [Webpack's treeshaking capabilities](https://webpack.js.org/guides/tree-shaking/) to only include what is used in the built output. This will require developers of the UI to be aware of the following two points:

1. Where possible, use ECMAscript 6/ES2015 versions of 3rd party dependencies. For example, rather than using `lodash`, use `lodash-es`. This is so the Webpack can detect the various `import` and `export` of modules, and thus remove any which are never used.
2. Modules exported in this codebase are expected to be pure - ie no side effects while `import`ing or `export`ing the content of a module. As a result, `sideEffects: false` is set in the `package.json`, meaning Webpack when building in production mode can prune functions and whole modules if required (and thus side effects, if any, may not occur if that module is not required). If a module/file does have side effects, these can be included still, by adding them to `sideEffects` as an array, i.e. `sideEffects: ['path/to/module/with/sideEffect.js']`. This should however only be a last resort.

### Webpack setup

Webpack (and it's plugins) are highly customisable. This section will detail the choices we have made around how and what is built, where it is built to, and the roles and responsibilities of the various plugins which enable this.

#### Webpack configuration and plugins

The webpack configuration will be as follows:

| Option                          | Value                                                                                                                                                                   |                                                                                                                                                                                                                                                        Purpose |
| ------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------: |
| entry                           | `client/Bootstrap/index.js`                                                                                                                                             | Build entry point. _Note:_ the `scss/css` is expected to be imported by individual view layer code, which is imported (directly or indirectly) from this file. Details to follow in Code Style approach documentation regarding this styling approach and why. |
| mode                            | `production` or `development` (provided via config file used)                                                                                                           |                                                                                                                                       Build mode. If production, code will be minified and have developer helpers (warnings etc) removed from the built output |
| target                          | `web` or `node` (provided via config file used)                                                                                                                         |                                                                                The build target. The client side code will be built for `web`, and server `node`, reflecting where the code runs (and thus what Webpack will/will not include in it's output). |
| output.path                     | `dist/client` or `dist/server` (via constant)                                                                                                                           |                                                                                                           All output to be placed in the `dist` directory, with client code going into the `client` directory, and all server code into `server` respectively. |
| output.publicPath               | `` (empty string)                                                                                                                                                       |                                                                                                                                                                          The public path of static/public content included by Webpack. Is relative to the URL. |
| output.filename                 | `[name].bundle.js`                                                                                                                                                      |                                                                                                                                                                 Name of the built entry bundle. Will be `main.bundle.js` once built as we have one entry point |
| module.rules                    | Array of rules - [see here for details](#module-rules)                                                                                                                  |                                                                                                                                         Rules/tests to run on modules being built. Depending on the file being parsed, different transformations should be run |
| plugins                         | Array of plugins - [see here for details](#webpack-plugins)                                                                                                             |                                                                                                                                                                                         Additional tools to customise the build to produce the required output |
| optimization.minimize           | `true` if production build, else false                                                                                                                                  |                                                                                                                                                                                               Use Webpack minimization only when performing a production build |
| optimization.minimizer          | [[`TerserPlugin`](https://webpack.js.org/plugins/terser-webpack-plugin/) with [this configuration](#terser-plugin-configuration), `optimize-css-assets-webpack-plugin`] |                                                                                                                                                   When a production build, minimise the built output using TerserPlugin and optimize-css-assets-webpack-plugin |
| optimization.splitChunks.chunks | `all`                                                                                                                                                                   |                                                                                                                                                                  When building, check and chunk up code as much as possible, regardless of what/how it is used |
| optimization.splitChunks.name   | `false`                                                                                                                                                                 |                                                                                                                                                                                                             Recommended setting - keeps chunk names consistent |
| resolve.alias                   | Array of aliases                                                                                                                                                        |                                                                                                                                                                                                                          [See section above](#webpack-aliases) |
| devServer                       | Object                                                                                                                                                                  |                                                                                                                                                                                                                       [See section below](#webpack-dev-server) |

To keep the configuration as minimal and readable as possible, configuration will be defined in separate files per build mode - ie one for `development` and one for `production`. These configurations will extend a common configuration file. [See this section for more details](#ui-build-implementation).

##### Module rules

Webpack allows file specific loaders or utilities to be invoked as a part of the build process. In the case of this build, these are as follows:

| Rule                        | Plugin/loader(s)                                                                                        |                                                                                                                                                                                                   Purpose |
| --------------------------- | ------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------: |
| `/(\.css\|.scss)$/`         | `style-loader` (dev only), `miniCssExtractPlugin.loader` (production only), `css-loader`, `sass-loader` | Handle scss/css loading/references. If dev mode, use `style-loader` for speed, else use `miniCssExtractPlugin.loader` (in combination with the `miniCssExtractPlugin` plugin) to produce/emit css file(s) |
| `/(\.(t                     | j)sx?)\$/`                                                                                              |                                                                                                                                                                                               `ts-loader` | Perform ts compile on all JS/TS files. This will be configured with presets for recent browsers, and enable caching to improve build performance |
| `/\.(woff(2)?\|ttf\|eot)$/` | `file-loader`                                                                                           |                 For any font file, use file-loader to package the font to the `output.path` and replace/update any imports of those fonts to this location. These will be directed to a 'fonts' directory |
| `/\.(jpg\|gif\|png\|svg)$/` | `file-loader`                                                                                           |             For any image file, use file-loader to package the image to the `output.path` and replace/update any imports of those images to this location. These will be directed to a 'images' directory |

The module loading rules will be provided via helper functions from a common configuration file, but allow for modification. [See this section for more details](#ui-build-implementation).

##### Webpack plugins

We also make use of the following plugins:

| Plugin                             |                                                                                                                                                                                                                                                                                                      Responsibility |
| ---------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------: |
| TerserPlugin                       |                                                                                                                                                                                                                                                              When a production build, minimises the built JS output |
| optimize-css-assets-webpack-plugin |                                                                                                                                                                                                                                                                                  Minimises/dedupes built css output |
| html-webpack-plugin                |                                                                                                                                                                                                                                                  Handles templating of built output into a provided index.html file |
| mini-css-extract-plugin            |                                                                                                                                                                                                                                                Compresses and emits a css file(s) containing all styling for the UI |
| compression-webpack-plugin         |                                                                                  Compresses built output further using `gzip` algorithm, and emits these compressed files. Depending on headers provided by the browser, these gziped versions will be served to the browser, rather than the uncompressed versions |
| webpack-bundle-analyzer            | At build time, produce a report regarding the JS bundle size (useful for understanding bloat and duplication). At dev build time this is an html file (which is then hosted by `webpack-dev-server`), and a json file at production build time. Each report is written to the `generated/bundle-analyser` directory |
| BannerPlugin                       |                                                                                                                                                                                                            Used to add a copyright header to built css code. Other types handled by other plugins (eg TerserPlugin) |
| webpack-node-externals             |                                                                        Excludes any code from `node_modules`. Useful when building node.js bundles, due to OS/dynamic requirements of those modules. Expectation is these will be installed/provided at build time via an `npm install` alongside the built output. |
| tsconfig-paths-webpack-plugin      |                                                                                                                                                                                                              Reads a specified `tsconfig.json` file, and generates Webpack aliases for any specified `path` values. |
| NormalModuleReplacementPlugin      |                                                                                                                                                                                             Used to provide a swappable view layer - intercepts "import" statements and replaces with different location for module |

Where appropriate, plugins will be provided via helper functions from a common configuration file, but allow for modification to their configuration. [See this section for more details](#ui-build-implementation).

##### Terser plugin configuration

These options will all be provided to the TerserPlugin via it's constructor.

| Option                        | Value                                   |                                        Purpose |
| ----------------------------- | --------------------------------------- | ---------------------------------------------: |
| terserOptions.output.comments | `false`                                 |              Remove all comments in the output |
| terserOptions.output.preamble | [Strimzi header](../utils/constants.js) | Adds the Strimzi header to the built JS output |
| terserOptions.keep_classnames | `true`                                  |                      Keep original class names |
| terserOptions.keep_fnames     | `true`                                  |                   Keep original function names |
| terserOptions.mangle.safari10 | `true`                                  |               Works around known Safari issues |

##### Swappable view layers

`NormalModuleReplacementPlugin` is used to support swapping between [multiple view layer implementations](./Architecture.md#swap-able-view-layers) at build time:

```ts
  ...
  Component.carbon.ts
  Component.patternfly.ts
  Component.ts
  ...
```

- And the component exports the carbon implementation:

```ts
export * from 'Component.carbon.ts';
```

By supplying the env var `VL=PATTERNFLY` before running a build - webpack will replace `carbon` with `patternfly` in the export statement.

#### Webpack output

Given the above configuration, built output will be created in a `dist` directory. This will contain:

```
dist/
    client/
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
        main.css
        <hash1>.bundle.css
        <hash2>.bundle.css
        ...
        images/
            image1.svg
            ...
        fonts/
            font1.ttf
            ...
        ...
    server/
        main.js
        ...
```

#### Webpack dev server

To enable efficient development, this UI makes use of [webpack-dev-server](https://webpack.js.org/configuration/dev-server/). This re-uses the above Webpack configuration, but adds helpful developer features, such as file watching and hot reloading of changes. When run, all content is built and served from memory, with static assets such as images being served from the configured public path. Configuration of the dev server is in the `devServer` section of the `webpack.config.js` file, and a brief summary of each option can be found below:

| Option           | Value                                                             |                                                                                                                                                                                                                                                                                                                                                                                                   Reason |
| ---------------- | ----------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------: |
| contentBase      | [`dist` (via constant), `generated/bundle-analyser/bundles.html`] |                                                                        Source for static files. This is the built output directory, where static files will land as a part of the first build during dev start up. In addition, include the output of `webpack-bundle-analyzer`, so a developer can access a `/bundles.html` file through `webpack-dev-server`, showing current bundle size/distribution |
| watchContentBase | `true`                                                            |                                                                                                                                                                                                                                                                                                                                                                          Reload if a static file changes |
| compress         | `true`                                                            |                                                                                                                                                                                                                                                                                                                          Serve all content via .gz files - makes rebuilds/hot changes faster to retrieve |
| inline           | `true`                                                            |                                                                                                                                                                                                                                                                                                                                   Enforce default setting, recommended when using `hot` reloading option |
| hot              | `true`                                                            |                                                                                                                                                                                                                                                                                                                                                       Enables hot reloading of content when files change |
| https            | `false`                                                           |                                                                                                                                                                                                                                                            Runs `webpack-dev-server` via an HTTPS server. Will be enabled automatically in certificates generated by `npm run addDevCerts` are detected. |
| proxy            | ~ \* => http(s);//localhost:3000                                  | Used to proxy requests for backend data when developing the UI. Any request not handled by the dev server will be proxied. This first goes to localhost 3000, which is a development instance of the UI server. This in turn proxies data to the mock admin server, as per the production topology. This will automatically TLS secured if certificates generated by `npm run addDevCerts` are detected. |
| overlay.warnings | `false`                                                           |                                                                                                                                                                                                                                                                                                                                                            In case of an warning, do not show an overlay |
| overlay.errors   | `true`                                                            |                                                                                                                                                                                                                                                                                                                                              In case of an error, show an overlay over the UI showing it |
| host             | `localhost`                                                       |                                                                                                                                                                                                                                                                                                     The hostname to use for the server. Can be overridden using the `WDS_HOSTNAME` environment variable. |
| port             | `8080`                                                            |                                                                                                                                                                                                                                                                                                             The port to use for the server. Can be overridden using the `WDS_PORT` environment variable. |

By default, `webpack-dev-server` will host the UI at `https://localhost:8080/`. Both the hostname and port can be overridden/changed via the `WDS_HOSTNAME` and `WDS_PORT` environment variables respectively.

### Module resolution

The UI makes extensive use of Typescript's [module resolution](https://www.typescriptlang.org/docs/handbook/module-resolution.html) features. This makes importing code far cleaner and easier. For example, a traditional import of a module in another directory:

````
- Modules
  - MyModule
    - index.ts
- App
  - Page
    - index.ts

```ts
import { myFunction } from '../../Modules/MyModule';
````

with the following typescript configuration:

```json
{
  "baseUrl": "."
}
```

can be referenced as:

```ts
import { myFunction } from 'Modules/MyModule';
```

Typescript will resolve the relative path against the base url.

Additionally, custom paths can be configured to act like top level modules:

````
- utils
  - test
    - index.ts
- App
  - Page
    - index.ts

```ts
import { myFunction } from '../../Modules/MyModule';
````

with the following typescript configuration:

```json
{
    "baseUrl": ".",
    "paths: {
        "test-utils": ["utils/test/index.ts"] //Relative to "baseUrl"
    }
}
```

can be referenced as:

```ts
import { testFunction } from 'test-utils';
```

### UI Build implementation

The above UI build is implemented in the [`build directory`](../utils/build). It is broken down into common configuration (and a function that will return it, helper functions and build constants), and individual use cases, such as dev and prod builds.

## UI build into Strimzi

The UI build is used in a `dockerfile` to produce an image that can then be deployed as a part of Strimzi. This `dockerfile` performs the following steps:

- Install all dependencies
- Run `npm run build`, which in turn runs a production build of the client and server
- Clear installed dependencies, and install just production (shipped) dependencies
- Move the built UI directory `dist` and `node_modules` to the required location
- Sets the entrypoint to a script/command which runs the UI Server: `node dist/server/main.js`

Further details to be added once https://github.com/strimzi/proposals/pull/6 has been finalized.
