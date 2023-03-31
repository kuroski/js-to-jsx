import fs from "node:fs";
import { exit } from "node:process";
import readdirp, { EntryInfo } from "readdirp";
import { handleError } from "../handlers/error";
import { isCLIError } from "../utils/checks";
import { parsePath } from "../utils/mutators";

const onEnd = (files: Array<fs.PathLike>) => {
  console.log("done", { entries: files });
};

export const transform = (maybePath: string) => () => {
  try {
    const files: Array<fs.PathLike> = [];
    const path = parsePath(maybePath);
    readdirp(path.toString(), {
      fileFilter: ["!*.(test|stories|spec).js", "*.js"],
      directoryFilter: ["!node_modules", "!__mocks__", "!.git"],
      // alwaysStat: true,
    })
      .on("data", async (entry: EntryInfo) => {
        try {
          await import(entry.fullPath);
        } catch {
          files.push(entry.fullPath);
        }
      })
      // Optionally call stream.destroy() in `warn()` in order to abort and cause 'close' to be emitted
      .on("warn", (error) => console.error("non-fatal error", error))
      .on("error", (error) => console.error("fatal error", error))
      .on("end", () => onEnd(files));
  } catch (error) {
    if (isCLIError(error)) {
      handleError(error);
      exit(1);
    } else {
      throw error;
    }
  }
};
