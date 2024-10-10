import autoprefixer from "autoprefixer";
import postcssPresetEnv from "postcss-preset-env";
import cssnano from "cssnano";

export default {
    plugins: [
        autoprefixer({}),
        cssnano({
            preset: "default",
        }),
        postcssPresetEnv({ stage: 1 }) /*,
        stylelint({})*/,
    ],
};
