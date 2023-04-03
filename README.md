## js-to-jsx

This CLI helps migrate legacy codebases to modern conventions.

Used to help adapting a legacy system conventions to enable a project to run `vite`

Just run `npm start` to see a list of available commands.

You can execute commands by running `npm start -- <command>` (I didn't extracted into a proper CLI for you to just execute them, so you must go through `npm start`)

## ⚙️ Commands & Options

### `transform`

Transform all `JSX` files given a folder from `.js` to `.jsx`.

```bash
pnpm start transform <folder_path> [options]

## examples
pnpm start transform ~/dev/my-project/components

# Dry mode, it won't apply any of the changes
pnpm start transform ~/dev/my-project/components --dry
```

| Option      | Description                        | Type   | Default | Required? |
| ----------- | ---------------------------------- | ------ | ------- | --------- |
| `-h --help` | Show command documentation         | `-`    | `-`     | No        |
| `--dry`     | Dry run (changes won't be applied) | `bool` | `false` | No        |

### `remove-redundant-import-extensions`

Remove any redundant import extensions.

For cases where you are within an application where extensions were added to the imports, .e.g:

```javascript
// Before
import MyComponent from "./components/MyComponent.js";

// After
import MyComponent from "./components/MyComponent";
```

> Take close attention for places where the removal of the extension is undesired
> If you are using CSS-in-JS solutions, this might strip away undesired imports
> `import styles from './my-css.module.css.js'` will become `import styles from './my-css.module.css'`
> which will cause errors.

```bash
pnpm start remove-redundant-import-extensions <folder_path> [options]

## examples
pnpm start remove-redundant-import-extensions ~/dev/my-project/components

# Dry mode, it won't apply any of the changes
pnpm start remove-redundant-import-extensions ~/dev/my-project/components --dry
```

| Option      | Description                        | Type   | Default | Required? |
| ----------- | ---------------------------------- | ------ | ------- | --------- |
| `-h --help` | Show command documentation         | `-`    | `-`     | No        |
| `--dry`     | Dry run (changes won't be applied) | `bool` | `false` | No        |

### `css-to-css-modules`

Converts every `.css` file to `.module.css` and fix its imports, .e.g:

```javascript
// Before
// ./styles.css
import styles from "./styles.css";

// After
// ./styles.module.css
import styles from "./styles.module.css";
```

```bash
pnpm start css-to-css-modules <folder_path> [options]

## examples
pnpm start css-to-css-modules ~/dev/my-project/components

# Dry mode, it won't apply any of the changes
pnpm start css-to-css-modules ~/dev/my-project/components --dry
```

| Option      | Description                        | Type   | Default | Required? |
| ----------- | ---------------------------------- | ------ | ------- | --------- |
| `-h --help` | Show command documentation         | `-`    | `-`     | No        |
| `--dry`     | Dry run (changes won't be applied) | `bool` | `false` | No        |

## Notes

This CLI makes use of [jscodeshift](https://github.com/facebook/jscodeshift), which is a codemod toolkit.

Please refer to https://astexplorer.net/ to have a better understanding of the AST in case you need to change anything.
