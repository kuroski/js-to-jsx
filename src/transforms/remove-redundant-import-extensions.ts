import type { API, FileInfo } from "jscodeshift";
import type { TRunnerOptions } from "../types";
import { hasJsTsExtension } from "../utils/checks";

function removeRedundantImportExtensions(
  file: FileInfo,
  api: API,
  options: TRunnerOptions
) {
  const j = api.jscodeshift;
  const root = j(file.source);

  let hasModifications = false;
  root
    .find(j.ExportNamedDeclaration, {
      type: "ExportNamedDeclaration",
    })
    .filter((path) => {
      if (!path.value?.source?.type || !path.value?.source?.value) return false;
      const value = String(path.value.source.value);

      return (
        ["Literal", "StringLiteral"].includes(path.value.source.type) &&
        hasJsTsExtension(value)
      );
    })
    .forEach((path) => {
      const node = path.node;
      if (!node.source || !node.source.value) return;

      if (options.dry) {
        api.stats(file.path);
      } else {
        const previousFilePath = node.source.value;
        const nextFilePath = String(previousFilePath).replace(
          /\.(tsx?|jsx?)/g,
          ""
        );
        node.source.value = nextFilePath;
        hasModifications = true;
      }
    });

  root
    .find(j.ImportDeclaration, {
      type: "ImportDeclaration",
    })
    .filter((path) => {
      if (!path.value?.source?.type || !path.value?.source?.value) return false;
      const value = String(path.value.source.value);

      return (
        ["Literal", "StringLiteral"].includes(path.value.source.type) &&
        hasJsTsExtension(value)
      );
    })
    .forEach((path) => {
      const node = path.node;

      if (!node.source || !node.source.value) return;

      if (options.dry) {
        api.stats(file.path);
      } else {
        const previousFilePath = node.source.value;
        const nextFilePath = String(previousFilePath).replace(
          /\.(tsx?|jsx?)/g,
          ""
        );
        node.source.value = nextFilePath;
        hasModifications = true;
      }
    });

  return hasModifications
    ? root.toSource({ ...options, quote: "single" })
    : undefined;
}

export default removeRedundantImportExtensions;
