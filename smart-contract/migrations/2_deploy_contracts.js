var MultiSignature = artifacts.require("MultiSignature");

module.exports = function(deployer, network, accounts) {
    const owners = accounts.slice(0,3);
    const numConfirmationsRequired = 2
    deployer.deploy(MultiSignature, owners, numConfirmationsRequired);
};
