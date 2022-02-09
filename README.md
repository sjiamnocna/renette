# React - Nette framework API

- Set for effectively using JSON AJAX requests with Nette Framework and React/Webpack/Node development. With simple (Request Authentication)

- Proxy pass for local development (query starts with api/ to distinguish local project files)

- REST-like service with as least components and config as possible

- Tracy debugger tool is working and showing TracyBar and even error if it occurs

- /server is submodule of [git@github.com:sjiamnocna/nette-minimal.git](https://github.com/sjiamnocna/nette-minimal)

- Made for development on Linux as it's the most helpful for developers

- On Windows, try use WSL2 or Docker (or different) container

Clone and get it running by running `yarn` and `cd server/; composer install`

## Usage

- Run `yarn` or `npm install`
- If you want to setup `editor://` links, visit [Tracy instructions](https://tracy.nette.org/en/open-files-in-ide)
- Create directory `server/`
- Clone [git@github.com:sjiamnocna/nette-minimal.git](https://github.com/sjiamnocna/nette-minimal) into `server/` and follow instructuctions in the `nette-minimal` repository
- Use `src/helper/api` to authenticate and authorize and POST

## Clone and enjoy