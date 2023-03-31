import fs from "node:fs";
import { error } from "../types/errors";
import { isErrnoException } from "./../utils/checks";

/**
 * Parses provided error message to maintain hopp-error messages.
 * @param e Custom error data.
 * @returns Parsed error message without extra spaces.
 */
export const parseErrorMessage = (e: unknown) => {
  let msg: string;
  if (isErrnoException(e)) {
    msg = e.message.replace(e.code + ":", "").replace("error:", "");
  } else if (typeof e === "string") {
    msg = e;
  } else {
    msg = JSON.stringify(e);
  }
  return msg.replace(/\n+$|\s{2,}/g, "").trim();
};

export const parsePath = (path: string): fs.PathLike => {
  if (!fs.existsSync(path)) {
    throw error({
      code: "NO_FILE_PATH",
      path,
      data: "Please provide a valid folder path.",
    });
  }

  return path;
};
