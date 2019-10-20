const {
    override,
    fixBabelImports,
    addLessLoader,
    disableEsLint,
    useBabelRc,
} = require('customize-cra');
const theme = require('./theme');

module.exports = override(
    disableEsLint(),
    fixBabelImports('import', {
        libraryName: 'antd',
        libraryDirectory: 'es',
        style: true,
    }),
    useBabelRc(),
    addLessLoader({
        javascriptEnabled: true,
        modifyVars: theme,
    })
);
