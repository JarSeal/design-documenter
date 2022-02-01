const path = require('path');

module.exports = {
    // Source files
    src: path.resolve(__dirname, '../src'), // eslint-disable-line

    // Production build files
    build: path.resolve(__dirname, '../dist'), // eslint-disable-line

    // Static files that get copied to build folder
    public: path.resolve(__dirname, '../public'), // eslint-disable-line
};
