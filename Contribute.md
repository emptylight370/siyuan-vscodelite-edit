Before all of these steps, you should know: this package is managed by mise(-en-place) and pnpm, if you don't use mise, you should setup pnpm correctly and do the steps manually.

# How to contribute to this theme

1. Fork this repository on GitHub

2. Clone the forked repository into your computer
3. Create a new branch and checkout it
4. Make some changes to the theme
5. Compile the theme and test it in your workspace
6. Commit and push to GitHub
7. Open a PullRequest on GitHub

# How to contribute your translations

1. Fork this repository on GitHub
2. Clone the forked repository into your computer
3. Create a new branch and checkout it
4. Add your language code to `language` and set it `true`

   (Notice: The language must be officially suppourted by SiYuan, you can see the type `TLang` to check the supported list. If your language is newly added into SiYuan, and the `TLang` in theme doesn't update, you can update it and make a commit)

5. Add your translations to other messages
6. Compile the theme and test it in your workspace
7. Commit and push to GitHub
8. Open a PullRequest on GitHub

# How to compile on your computer

1. Clone the repository
2. Open the folder in your terminal or editing tools (`cd siyuan-vscodelite-edit`)
3. Use `mise install` to setup the environment
4. Use `pnpm install` to install the dependencies
5. Use `pnpm run build` to build the files
6. Now, you have
   1. theme.\* (EXCLUDE: theme.scss, theme.css.map)
   2. \*.png
   3. README\*.md
   4. resources/\*
   5. sub/\*

7. Copy them to your workspace's VSCode Lite Edit folder (`~/data/conf/appearance/theme/siyuan-vscodelite-edit`) and reload SiYuan interface (OR just restart SiYuan)

# How to generate changelog

1. Use conventional commit format to organize your commit message (https://www.conventionalcommits.org/). This is checked by lefthook and will show error message, you can refer to the message to correct your commit message.

2. Run `mise i`, you should have installed conventional-changelog-cli correctly
3. Run `mise run changelog` to generate changelog file
