const plugins = [];

if (process.env.NODE_ENV === 'production') {
    plugins.push('transform-remove-console');
}

//Reanimated plugin has to be listed last !!!!
// plugins.push('react-native-reanimated/plugin');

module.exports = {
    presets: ['module:metro-react-native-babel-preset'],
    plugins: plugins
};
