import * as S from "fp-ts/string";
import { hasProperty, isSafeCommanderError } from "../utils/checks";
import { parseErrorMessage } from "../utils/mutators";
import { exceptionColors } from "../utils/getters";
import { ErrorCode, Err } from "../types/errors";
const { BG_FAIL } = exceptionColors;

/**
 * Parses unknown error data and narrows it to get information related to
 * error in string format.
 * @param e Error data to parse.
 * @returns Information in string format appropriately parsed, based on error type.
 */
const parseErrorData = (e: unknown) => {
  let parsedMsg: string;

  if (!!e && typeof e === "object") {
    if (hasProperty(e, "message") && S.isString(e.message)) {
      parsedMsg = e.message;
    } else if (hasProperty(e, "data") && S.isString(e.data)) {
      parsedMsg = e.data;
    } else {
      parsedMsg = JSON.stringify(e);
    }
  } else if (S.isString(e)) {
    parsedMsg = e;
  } else {
    parsedMsg = JSON.stringify(e);
  }

  return parsedMsg;
};

/**
 * Handles Error to generate error messages based on data related
 * to error code and exits program with exit code 1.
 * @param error Error object with code of type ErrorCode.
 */
export const handleError = <T extends ErrorCode>(error: Err<T>) => {
  const ERROR_CODE = BG_FAIL(error.code);
  let ERROR_MSG;

  switch (error.code) {
    case "FILE_NOT_FOUND":
      ERROR_MSG = `File doesn't exists: ${error.path}`;
      break;
    case "UNKNOWN_COMMAND":
      ERROR_MSG = `Unavailable command: ${error.command}`;
      break;
    case "MALFORMED_ENV_FILE":
    case "MALFORMED_COLLECTION":
      ERROR_MSG = `${error.path}\n${parseErrorData(error.data)}`;
      break;
    case "NO_FILE_PATH":
      ERROR_MSG = `Please provide a hoppscotch-collection file path.`;
      break;
    case "PARSING_ERROR":
      ERROR_MSG = `Unable to parse -\n${error.data}`;
      break;
    case "INVALID_FILE_TYPE":
      ERROR_MSG = `Please provide file of extension type: ${error.data}`;
      break;
    case "REQUEST_ERROR":
    case "TEST_SCRIPT_ERROR":
    case "PRE_REQUEST_SCRIPT_ERROR":
      ERROR_MSG = parseErrorData(error.data);
      break;
    case "INVALID_ARGUMENT":
    case "UNKNOWN_ERROR":
    case "SYNTAX_ERROR":
      ERROR_MSG = isSafeCommanderError(error.data)
        ? S.empty
        : parseErrorMessage(error.data);
      break;
    case "TESTS_FAILING":
      ERROR_MSG = error.data;
      break;
  }

  if (!S.isEmpty(ERROR_MSG)) {
    console.error(ERROR_CODE, ERROR_MSG);
  }
};
