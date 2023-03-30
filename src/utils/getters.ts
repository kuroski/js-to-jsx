import chalk from "chalk";

/**
 * Generates template string (status + statusText) with specific color unicodes
 * based on type of status.
 * @param status Status code of a HTTP response.
 * @param statusText Status text of a HTTP response.
 * @returns Template string with related color unicodes.
 */
export const getColorStatusCode = (
  status: number | string,
  statusText: string
): string => {
  const statusCode = `${status == 0 ? "Error" : status} : ${statusText}`;

  if (status.toString().startsWith("2")) {
    return chalk.greenBright(statusCode);
  } else if (status.toString().startsWith("3")) {
    return chalk.yellowBright(statusCode);
  }

  return chalk.redBright(statusCode);
};

/**
 * Object providing aliases for chalk color properties based on exceptions.
 */
export const exceptionColors = {
  WARN: chalk.yellow,
  INFO: chalk.blue,
  FAIL: chalk.red,
  SUCCESS: chalk.green,
  INFO_BRIGHT: chalk.blueBright,
  BG_WARN: chalk.bgYellow,
  BG_FAIL: chalk.bgRed,
  BG_INFO: chalk.bgBlue,
  BG_SUCCESS: chalk.bgGreen,
};
