<h1 align="center">
  <br>
  <img src="https://raw.githubusercontent.com/brandonore/aurora/master/assets/logo.png" alt="auroralogo" width="800">
  <br>
  aurora
  <br>
</h1>

<h4 align="center">A simple, minimal desktop cryptocurrency tracker built with <a href="http://electron.atom.io" target="_blank">Electron</a>.</h4>

<p align="center">
  <a href="#features">Features</a> •
  <a href="#to-do-listfeature-request">To-do List</a> •
  <a href="#download">Download</a> •
  <a href="#how-to-contribute">How to Contribute</a> •
  <a href="#credits">Credits</a> •
  <a href="#license">License</a>
</p>

<p align="center">
<img src="https://raw.githubusercontent.com/brandonore/aurora/master/assets/aurora.gif">
</p>

## Features

* Auto-syncs every 90 seconds
* Pulls data from <a href="https://coinmarketcap.com">CoinMarketCap</a>
  - Select any of the 1300+ coins they support from an interactive drop-down list
* Filter/search to help you find your favorite coins  
* Click to toggle display between USD/BTC price and volume & mcap/avail & total supply
* Settings include Satoshi -> USD and USD -> BTC converter that updates in real time
* Dark/Light mode, Opacity slider
* Cross platform
  - Windows and macOS
* [NEW!] Auto-updates. App will check for new versions on start and display a download icon in the top right corner. Click this to update and restart to the newest version
* [NEW!] Compact mode (based on binance desktop app)

## To-do List/Feature Request

* ~~Auto-updates (In-progress)~~ &#10003;
* ~~Compact mode~~ &#10003;
* Highlight/scroll through coin list with arrow keys, 'enter' to select highlighted option

## Known Issues

* A small number of coins currently have broken image links. Waiting on Coinmarketcap to fix these
* Graphical glitch on macOS when lowering the opacity. Ghosting of hidden elements showing through. (Could be caused by a gpu rendering error on my test machine)
* Auto-updates are currently disabled for macOS until I sign the app through xcode
  
## Download

You can download the latest compiled version of aurora for Windows and macOS below, or visit the [releases](https://github.com/brandonore/aurora/releases) page!

[![Alt Text](https://github.com/brandonore/aurora/blob/master/assets/windows-small.png)](https://github.com/brandonore/aurora/releases/download/v1.0.1/aurora-Setup-1.0.1.exe) &nbsp; &nbsp;
[![Alt Text](https://github.com/brandonore/aurora/blob/master/assets/apple-small.png)](https://github.com/brandonore/aurora/releases/download/v1.0.1/aurora-1.0.1-mac.zip)

## How to Contribute

To clone and run this application, you'll need [Git](https://git-scm.com) and [Node.js](https://nodejs.org/en/download/) (which comes with [npm](http://npmjs.com)) installed on your computer. From your command line:

```bash
# Clone this repository
$ git clone https://github.com/brandonore/aurora

# Change directory into repository
$ cd aurora

# Install dependencies
$ npm install

# Run the app
$ npm start
```

## Credits

This software was built with the following open source packages:

- [Electron](http://electronjs.org)
- [Node.js](https://nodejs.org/)
- [Request](https://www.npmjs.com/package/request)

All coin information pulled from the <a href="https://coinmarketcap.com/api/">CoinMarketCap</a> API

## License

MIT

---
