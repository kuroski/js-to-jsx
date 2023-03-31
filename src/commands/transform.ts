import glob from "glob";
import Runner from "jscodeshift/src/Runner";
import { exit } from "node:process";
import url from "node:url";
import { handleError } from "../handlers/error";
import { isCLIError } from "../utils/checks";
import { parsePath } from "../utils/mutators";

const transform =
  (maybeGlobPattern: string, options: { dry?: boolean }) => async () => {
    try {
      const destPath = parsePath(maybeGlobPattern);
      const files = glob.sync(destPath.toString());
      const transformPath = url.fileURLToPath(
        new URL("../transforms/rename-js-to-jsx.ts", import.meta.url)
      );

      await Runner.run(transformPath, files, {
        extensions: "tsx,ts,jsx,js",
        ignorePattern: [
          "**/node_modules/**",
          "**/public/**",
          "**/dist/**",
          "**/build/**",
        ],
        parser: "tsx",
        verbose: 0,
        dry: options?.dry,
      });
    } catch (error) {
      if (isCLIError(error)) {
        handleError(error);
        exit(1);
      } else {
        throw error;
      }
    }
  };

export default transform;
