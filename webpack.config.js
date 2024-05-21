const path = require( 'path' );
const defaultConfig = require( '@wordpress/scripts/config/webpack.config' );

const RemoveEmptyScriptsPlugin = require( 'webpack-remove-empty-scripts' );

// module.exports = {
//     ...defaultConfig,

//     entry: {
//         'editor/index' : path.resolve( process.cwd(), 'src/editor/index.js' ),
//         'settings/index' : path.resolve( process.cwd(), 'src/settings/index.js' ),
//         // 'editor-styles': path.resolve( process.cwd(), 'src/styles/editor.scss' ),
//         // 'setting-styles' : path.resolve( process.cwd(), 'src/styles/settings.scss' ),
//     },

//     output: {
//         filename: '[name].js',
//         path: path.resolve( process.cwd(), 'build/' ),
//     },

//     module: {
//         ...defaultConfig.module,
//         rules: [
//             ...defaultConfig.module.rules,
//             // Add additional rules as needed.
//         ]
//     },

//     plugins: [
//         ...defaultConfig.plugins,
//         // Add additional plugins as needed.
//         new RemoveEmptyScriptsPlugin(),
//     ],
// };

module.exports = [
    defaultConfig,
    {
        ...(defaultConfig),
        entry: {
            'settings/index' : path.resolve( process.cwd(), 'src', 'settings/index.js' ),
        }
    }
];
