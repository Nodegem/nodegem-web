const {
    override,
    fixBabelImports,
    addLessLoader,
    disableEsLint,
    useBabelRc,
} = require('customize-cra');
const darkTheme = require('@ant-design/dark-theme');

module.exports = override(
    disableEsLint(),
    fixBabelImports('import', {
        libraryName: 'antd',
        libraryDirectory: 'es',
        style: true,
    }),
    fixBabelImports('formik-antd', {
        libraryName: 'formik-antd',
        libraryDirectory: 'es',
        style: true,
    }),
    useBabelRc(),
    addLessLoader({
        javascriptEnabled: true,
        modifyVars: darkTheme,
    })
);
