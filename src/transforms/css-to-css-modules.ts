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
      if (
        !path.value?.source?.type ||
        !path.value?.source?.value ||
        !path.value.specifiers
      )
        return false;
      const value = String(path.value.source.value);

      return (
        ["Literal", "StringLiteral"].includes(path.value.source.type) &&
        path.value.specifiers.length > 0 &&
        value.includes(".css") &&
        !value.includes(".module.css")
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
        const newPath = path.join(path.dirname(file.path), nextFilePath);
        if (!fs.existsSync(newPath)) {
          fs.renameSync(
            path.join(path.dirname(file.path), String(previousFilePath)),
            newPath
          );
        }
      }
    });

  return hasModifications
    ? root.toSource({ ...options, quote: "single" })
    : undefined;
}

export default removeRedundantImportExtensions;
