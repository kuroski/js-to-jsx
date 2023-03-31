import chalk from "chalk";
import { program } from "commander";
import * as E from "fp-ts/Either";
import { version } from "../package.json";
import { handleError } from "./handlers/error";
import transform from "./commands/transform";
import removeRedundantImportExtensions from "./commands/removeRedundantImportExtensions";
import cssToCssModules from "./commands/cssToCssModules";

const accent = chalk.greenBright;

/**
 * * Program Default Configuration
 */
const CLI_BEFORE_ALL_TXT = `${accent("JS to JSX")} CLI - Version ${version} \n`;

program
  .name("js-to-jsx")
  .version(version, "-v, --ver", "see the current version of js-to-jsx-cli")
  .usage("[options or commands] arguments")
  .addHelpText("beforeAll", CLI_BEFORE_ALL_TXT)
  .configureHelp({
    optionTerm: (option) => accent(option.flags),
    subcommandTerm: (cmd) => accent(cmd.name(), cmd.usage()),
    argumentTerm: (arg) => accent(arg.name()),
  })
  .addHelpCommand(false)
  .showHelpAfterError(true);

program.exitOverride().configureOutput({
  writeErr: () => program.help(),
  outputError: (str) =>
    handleError({ code: "INVALID_ARGUMENT", data: E.toError(str) }),
});

/**
 * * CLI Commands
 */
program
  .command("transform")
  .argument(
    "<file_path>",
    "path to a folder where you want to detect JSX files with JS extension for conversion"
  )
  .option("--dry", "enable dry run")
  .allowExcessArguments(false)
  .allowUnknownOption(false)
  .description("running js to jsx command")
  .action(async (path, options) => await transform(path, options)());

program
  .command("remove-redundant-import-extensions")
  .argument(
    "<file_path>",
    "path to a folder where you want to detect JSX files with JS extension for conversion"
  )
  .option("--dry", "enable dry run")
  .allowExcessArguments(false)
  .allowUnknownOption(false)
  .description("remove any .js|.jsx|.ts|.tsx extension from file imports")
  .action(
    async (path, options) =>
      await removeRedundantImportExtensions(path, options)()
  );

program
  .command("css-to-css-modules")
  .argument(
    "<file_path>",
    "path to a folder where you want to detect JSX files with JS extension for conversion"
  )
  .option("--dry", "enable dry run")
  .allowExcessArguments(false)
  .allowUnknownOption(false)
  .description("converts all .css imports to module.css")
  .action(async (path, options) => await cssToCssModules(path, options)());

export const cli = async (args: string[]) => {
  try {
    await program.parseAsync(args);
  } catch (e) {}
};
