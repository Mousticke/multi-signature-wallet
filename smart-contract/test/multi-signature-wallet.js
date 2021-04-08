const { assert } = require('chai');
const chai = require('chai')
chai.use(require('chai-as-promised')).should()

const expect = chai.expect;  
const MultiSignature = artifacts.require("MultiSignature");

contract("MultiSignature", accounts =>{
    const owners = [accounts[0], accounts[1], accounts[2]];
    const forbiddenOwner = accounts[3]
    const NUM_CONFIRMATIONS_REQUIRED = 2;


    let wallet
    beforeEach(async () => {
        wallet = await MultiSignature.new(owners, NUM_CONFIRMATIONS_REQUIRED);
    });

    describe("Submit Transaction", () => {
        it("should submit the transaction", async () => {
            const res = await wallet.submitTransaction(owners[1], 100, "0x00", {from : owners[0]});
            const {logs} = res;
            assert.equal(logs[0].event, "Submit");
            assert.equal(logs[0].args.owner, owners[0]);
            assert.equal(logs[0].args.trxIndex, 0);
            assert.equal(logs[0].args.to, owners[1]);
            assert.equal(logs[0].args.value, 100);
        });

        it("should not submit the transaction because the address is not an owner", async () => {
            await expect(
                wallet.submitTransaction(owners[1], 100, "0x00", {from : forbiddenOwner})
            ).to.be.rejected
        });
    });

    describe("Confirm Transaction", () => {
        beforeEach(async () => {
            const to = owners[0];
            const value = 0;
            const data = "0x00"
            await wallet.submitTransaction(to, value, data);
        });

        it("should confirm the transaction", async () => {
            const res = await wallet.confirmTransaction(0, {from: owners[1]});
            const {logs} = res;
            assert.equal(logs[0].event, "Confirm");
            assert.equal(logs[0].args.owner, owners[1]);
            assert.equal(logs[0].args.trxIndex, 0);
        });

        it("should not confirm the transaction because it belongs to the initiator", async () => {
            await expect(
                wallet.confirmTransaction(0, {from: owners[0]})
            ).to.be.rejected
        });

        it("should not confirm the transaction because it has already been confirmed by this owner", async () => {
            await wallet.confirmTransaction(0, {from: owners[1]});
            await expect(
                wallet.confirmTransaction(0, {from: owners[1]})
            ).to.be.rejected
        });

        it("should not confirm the transaction because it has already been executed", async () => {
            await wallet.confirmTransaction(0, {from: owners[1]});
            await wallet.confirmTransaction(0, {from: owners[2]});
            await wallet.executeTransaction(0, {from : owners[0]});

            await expect(
                wallet.confirmTransaction(0, {from: owners[2]})
            ).to.be.rejected
        });
    });

    describe("Cancel Confirmation", () => {
        beforeEach(async () => {
            const to = owners[0];
            const value = 0;
            const data = "0x00"
            await wallet.submitTransaction(to, value, data);
            await wallet.confirmTransaction(0, {from: owners[1]});
        });

        it("should cancel the confirmation of the transaction", async () => {
            const res = await wallet.cancelConfirmation(0, {from : owners[1]});
            const {logs} = res;
            assert.equal(logs[0].event, "Cancel");
            assert.equal(logs[0].args.owner, owners[1]);
            assert.equal(logs[0].args.trxIndex, 0);
        });

        it("should not cancel the confirmation because this owner has not already confirmed that transaction", async () => {
            await expect(
                wallet.cancelConfirmation(0, {from : owners[2]})
            ).to.be.rejected
        });

        it("should not cancel the confirmation because that transaction does not exist", async () => {
            await expect(
                wallet.cancelConfirmation(1, {from : owners[1]})
            ).to.be.rejected
        });

        it("should not cancel the confirmation because this address is not an owner of the wallet", async () => {
            await expect(
                wallet.cancelConfirmation(0, {from : forbiddenOwner})
            ).to.be.rejected
        });

        it("should not cancel the confirmation because that transaction has already been executed", async () => {
            await wallet.confirmTransaction(0, {from: owners[2]});
            await wallet.executeTransaction(0, {from : owners[0]});
            await expect(
                wallet.cancelConfirmation(0, {from : owners[1]})
            ).to.be.rejected
        });
    })

    describe("Execute Transaction", () => {
        beforeEach(async () => {
            const to = owners[0];
            const value = 0;
            const data = "0x00"
            await wallet.submitTransaction(to, value, data);
            await wallet.confirmTransaction(0, {from: owners[1]});
            await wallet.confirmTransaction(0, {from: owners[2]});
        });


        //execute transaction succeed
        it('should execute transaction', async () => {
            const res = await wallet.executeTransaction(0, {from : owners[0]});

            const {logs} = res;
            assert.equal(logs[0].event, "Execute");
            assert.equal(logs[0].args.owner, owners[0]);
            assert.equal(logs[0].args.trxIndex, 0);

            const trx = await wallet.getTransaction(0);
            assert.equal(trx.executed, true)
        });

        // execute transaction should failed
        it('should reject the transaction because it has already been executed', async () => {
            await wallet.executeTransaction(0, {from: owners[0]});
            await expect(
                wallet.executeTransaction(0, {from: owners[0]})
            ).to.be.rejected
        })

        it('should reject the transaction because it does not exist', async () => {
            await expect(
                wallet.executeTransaction(1, {from: owners[0]})
            ).to.be.rejected
        })

        it('should reject the transaction because the address is not an owner of the wallet', async () => {
            await expect(
                wallet.executeTransaction(0, {from: forbiddenOwner})
            ).to.be.rejected
        })
    });

});