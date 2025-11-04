# How to contribute to this theme

1. Fork this repository on GitHub
2. Clone the forked repository into your computer
3. Create a new branch and switch to it
4. Make some changes to the theme
5. Compile the theme and test it in your workspace
6. Commit and push to GitHub
7. Open a PullRequest on GitHub

# How to compile on your computer

1. Clone the repository
2. Open the folder in your terminal or editing tools (`cd siyuan-vscodelite-edit`)
3. Use `npm install` to install the dependencies
4. Use `npm build` to build the files
5. Now, you have
   1. theme.\* (EXCLUDE: theme.scss, theme.css.map)
   2. \*.png
   3. README\*.md
   4. resources/\*
   5. sub/\*
6. Copy them to your workspace's VSCode Lite Edit folder (`~/data/conf/appearance/theme/siyuan-vscodelite-edit`) and reload SiYuan interface(OR just restart SiYuan)

# How to generate changelog

1. Use conventional commit format to organize your commit message (https://www.conventionalcommits.org/)
2. Install conventional-changelog-cli via npm (`npm i conventional-changelog-cli -g`)
3. Run `npm run changelog`
