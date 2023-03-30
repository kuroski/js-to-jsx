import { exit } from "node:process";
import { handleError } from "../handlers/error";
import { TransformCmdOptions } from "../types/commands";
import { isCLIError } from "../utils/checks";

export const transform = (path: string, options: TransformCmdOptions) => () => {
  try {
    console.log("HEEEY", { path, options });
  } catch (error) {
    if (isCLIError(error)) {
      handleError(error);
      exit(1);
    } else {
      throw error;
    }
  }
};
