# Contributing to the Multi Signature Wallet : Smart Contract

👍🎉 First off, thanks for taking the time to contribute! 🎉👍

When contributing to this repository, please first discuss the change you wish to make via issue, email, or any other method with the owners of this repository before making a change.
Please note we have a [code of conduct](https://github.com/Mousticke/multi-signature-wallet/blob/main/smart-contract/CODE_OF_CONDUCT.md), please follow it in all your interactions with the project.

## Table of Contents

- [Setting Up the project locally](#setting-up-the-project-locally)
- [Submitting a Pull Request](#submitting-a-pull-request)

## Setting Up the project locally

To install the project you need to have `node`, `npm`, `Truffle` and `solc`

1.  [Fork](https://help.github.com/articles/fork-a-repo/) the project, clone
    your fork:

    ```sh
    # Clone your fork
    git clone https://github.com/<your-username>/multi-signature-wallet.git

    # Navigate to the newly cloned directory
    cd multi-signature-wallet/smart-contract
    ```

3.  Your environment needs to be running `Truffle` version >= 5.2.5 and `solc` 0.8.3<= version <= 0.9.0

4.  From the root of the project: `npm` or `yarn` to install all dependencies (for chai especially)

    - make sure you have latest `npm` or `yarn` version

5.  Setup the local environment

    ```sh
    #install truffle :https://www.trufflesuite.com/docs/truffle/getting-started/installation
    npm install -g truffle

    #install solc : https://docs.soliditylang.org/en/v0.8.0/installing-solidity.html
    npm install -g solc
    ```

    Before you can interact with this smart contract in a browser, make sure they're compiled, deployed, and that you're interacting with them via web3 in client-side JavaScript. Truffle recommends using the @truffle/contract library, as it makes interacting with contracts easier and more robust.

    MetaMask is the easiest way to interact with dapps in a browser. It is an extension for Chrome or Firefox that connects to an Ethereum network without running a full node on the browser's machine. It can connect to the main Ethereum network, any of the testnets (Ropsten, Kovan, and Rinkeby), or a local blockchain such as the one created by Ganache or Truffle Develop.

    - Install on [Chrome](https://chrome.google.com/webstore/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn)
    - Install on [Firefox](https://addons.mozilla.org/en-US/firefox/addon/ether-metamask/)

6.  Launch the smart contract locally.

    - make sure you have the `solc` and `truffle` mentioned before

    - Then, start the truffle blockchain

    ```sh
        cd multi-signature-wallet/smart-contract
        truffle develop
        migrate
        deploy
    ```

> Tip: Keep your `main` branch pointing at the original repository and make
> pull requests from branches on your fork. To do this, run:
>
> ```sh
> git remote add upstream https://github.com/Mousticke/multi-signature-wallet.git
> git fetch upstream
> git branch --set-upstream-to=upstream/master master
> ```
>
> This will add the original repository as a "remote" called "upstream," then
> fetch the git information from that remote, then set your local `main`
> branch to use the upstream master branch whenever you run `git pull`. Then you
> can make all of your pull request branches based on this `main` branch.
> Whenever you want to update your version of `main`, do a regular `git pull`.

## Submitting a Pull Request

Please go through existing issues and pull requests to check if somebody else is already working on it.

Also, make sure to run the tests the code before you commit your
changes.

```sh
# launch truffle
truffle develop
# compile inside truffle 
compile
# running migration inside truffle
migrate 
# test inside truffle
test
#if every tests passed, you can exit truffle and commit your changes
```

## Before publishing

  > From Truffle documentation

When using a network like the default develop network that's configured to match any Ethereum client (like Ganache or Truffle Develop), you're bound to have network artifacts lying around that you don't want published. Before publishing your package, consider running the following command to remove any extraneous network artifacts:

```sh
truffle networks --clean
```
