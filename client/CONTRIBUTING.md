# Contributing to the Multi Signature Wallet : React Client

👍🎉 First off, thanks for taking the time to contribute! 🎉👍

When contributing to this repository, please first discuss the change you wish to make via issue, email, or any other method with the owners of this repository before making a change.
Please note we have a [code of conduct](https://github.com/Mousticke/multi-signature-wallet/blob/main/client/CODE_OF_CONDUCT.md), please follow it in all your interactions with the project.

## Table of Contents

- [Setting Up the project locally](#setting-up-the-project-locally)
- [Submitting a Pull Request](#submitting-a-pull-request)

## Setting Up the project locally

To install the project you need to have `node` and `npm`

1.  [Fork](https://help.github.com/articles/fork-a-repo/) the project, clone
    your fork:

    ```sh
    # Clone your fork
    git clone https://github.com/<your-username>/multi-signature-wallet.git

    # Navigate to the newly cloned directory
    cd multi-signature-wallet/client
    ```
2.  Launch the smart contract locally. (See more detail inside the readme at the `smart-contract` folder)

    - make sure you have the same `solc` and `truffle` version

    - Then, start the truffle blockchain
    ```sh
        cd multi-signature-wallet/smart-contract
        truffle develop
        migrate
        deploy
    ```

    - In a new terminal, copy paste the json file of the contract into the client
    ```sh
        cp -r .build/contracts/ ../client/src
    ```

3.  Your environment needs to be running `node` version >= 15.5.1 and `npm` version >= 7.6.3.

4.  from the root of the project: `npm` or `yarn` to install all dependencies

    - make sure you have latest `npm` version

5.  from the root of the project: `yarn start` to run the cli.

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

Also, make sure to run the tests and lint the code before you commit your
changes.

```sh
yarn test
yarn lint
```
