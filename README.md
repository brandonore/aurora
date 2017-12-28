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

* Auto-syncs every 3 minutes
* Pulls data from <a href="https://coinmarketcap.com">CoinMarketCap</a>
  - Select any of the 1300+ coins they support from an interactive drop-down list
* Filter/search to help you find your favorite coins  
* Main screen displays coin logo, rank, price (USD), percent change (1h), volume (24h), market cap
  - Click coin price to toggle price between USD and BTC
  - Click volume/market cap to toggle bewtween available and total supply
* Settings include built-in Satoshi to USD converter that updates in real time based on the current price of BTC
* Dark/Light mode
* Opacity slider
* Refresh button (please avoid spamming this, only use if the app appears frozen)
* Cross platform
  - Windows and macOS. Linux coming soon!

## To-do List/Feature Request

* Auto-updates (In-progress)
* Highlight/scroll through coin list with arrow keys, 'enter' to select highlighted option
* Compact mode
  
## Download

You can [download](https://github.com/brandonore/aurora/releases/tag/v1.0.0) the latest compiled version of aurora for Windows and macOS

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
