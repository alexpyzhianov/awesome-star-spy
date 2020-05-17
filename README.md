# Awesome Star Spy

It's a Chrome extension that uses GitHub API to fetch GitHub stars for every link to a repository found on a page in the current tab. It then displays the values right next to the links, so you don't have to visit every page in your favorite awesome list to discover truly awesome things.

![Screenshot](https://i.imgur.com/R5DNU5M.png)

## Why does this require authentication?

GitHub API allows only 60 requests per hour for unauthorized users. It's usually not enough for even a tiny Awesome list. Authorizing the Awesome Star Spy's Github application doesn't give it access to anything you own and gives you 5000 requests/hour.

## Installation

It's still under review in the Chrome Store, but you can clone the repo and install it locally. Do the following:

1. Open the terminal
2. Clone the repo `git clone https://github.com/alexpyzhianov/awesome-star-spy.git`
3. Enter the extension directory `cd awesome-star-spy/packages/extension`
4. Build it `yarn && yarn build`
5. Open Chrome and go to `chrome://extensions/`
6. Click "Load unpacked" and select the `dist` folder inside `awesome-star-spy/packages/extension`
