import fs from "node:fs";
import path from "node:path";
import type { API, FileInfo } from "jscodeshift";
import type { TRunnerOptions } from "../types";

function removeRedundantImportExtensions(
  file: FileInfo,
  api: API,
  options: TRunnerOptions
) {
  const j = api.jscodeshift;
  const root = j(file.source);

  let hasModifications = false;

  root
    .find(j.ImportDeclaration, {
      type: "ImportDeclaration",
    })
    .filter((path) => {
      if (!path.value || !path.value.source?.type || path.value.source?.value)
        return false;

      console.log(path);

      return (
        ["Literal", "StringLiteral"].includes(path.value.source.type) &&
        [".css"].includes(String(path.value.source.value)) &&
        ![".module.css"].includes(String(path.value.source.value))
      );
    })
    .forEach((astPath) => {
      const node = astPath.node;

      if (!node.source || !node.source.value) return;

      if (options.dry) {
        api.stats(file.path);
      } else {
        const previousFilePath = node.source.value;
        const nextFilePath = String(previousFilePath).replace(
          /\.(css)/g,
          ".module.css"
        );
        node.source.value = nextFilePath;
        hasModifications = true;

        // Side effect for renaming the actual CSS module file.
        fs.renameSync(
          path.join(path.dirname(file.path), String(previousFilePath)),
          path.join(path.dirname(file.path), nextFilePath)
        );
      }
    });

  return hasModifications
    ? root.toSource({ ...options, quote: "single" })
    : undefined;
}

export default removeRedundantImportExtensions;
