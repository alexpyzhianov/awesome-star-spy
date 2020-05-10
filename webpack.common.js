const path = require("path");

module.exports = {
    entry: {
        background: path.join(__dirname, "src/background.ts"),
        content: path.join(__dirname, "src/content.ts"),
    },
    output: {
        path: path.join(__dirname, "dist/js"),
        filename: "[name].js",
    },
    module: {
        rules: [
            {
                exclude: /node_modules/,
                test: /\.tsx?$/,
                use: "ts-loader",
            },
        ],
    },
    resolve: {
        extensions: [".ts", ".js"],
    },
};
