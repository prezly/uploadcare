import path from 'path';

const isDev = process.env.NODE_ENV === 'development';

export default {
    mode: isDev ? 'development' : 'production',
    entry: './src/index.ts',
    output: {
        path: path.resolve('./umd'),
        library: {
            name: 'PrezlyUploadcare',
            type: 'umd',
        },
    },
    devtool: 'source-map',
    resolve: {
        extensions: ['.ts', '.js'],
    },
    module: {
        rules: [
            {
                test: /\.ts$/,
                use: 'ts-loader',
                exclude: /node_modules/,
            },
        ],
    },
};
