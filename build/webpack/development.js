import webpackConfig from './_base';
import config        from '../../config';

const paths = config.get('utils_paths');

webpackConfig.eslint.emitWarning = true;

webpackConfig.resolve.fallback = paths.project('node_modules');
webpackConfig.resolveLoader = {fallback:paths.project('node_modules')};

export default webpackConfig;
