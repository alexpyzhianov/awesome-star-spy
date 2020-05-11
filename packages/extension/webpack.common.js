const path = require("path");

module.exports = {
    entry: {
        background: path.join(__dirname, "src/background.ts"),
        content: path.join(__dirname, "src/content.ts"),
        popup: path.join(__dirname, "src/popup/index.tsx"),
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
            {
                test: /\.css$/,
                use: [{ loader: "style-loader" }, { loader: "css-loader" }],
            },
        ],
    },
    resolve: {
        extensions: [".ts", ".tsx", ".js"],
    },
};
