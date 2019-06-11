const SHA256= require('crypto-js/sha256');
const EC = require('elliptic').ec;
const ec = new EC('secp256k1');

class Transaction{
    constructor(fromAddress, toAddress, amount){
        this.fromAddress=fromAddress;
        this.toAddress=toAddress;
        this.amount=amount;
    }

    calculateHash(){
        return SHA256(this.fromAddress + this.toAddress + this.amount).toString();
    }

    signTransaction(signingKey){
        if(signingKey.getPublic('hex') !== this.fromAddress){
            throw new Error("You can not sign transactions of other wallets!");
        }

        const hashTx = this.calculateHash();
        const sig = signingKey.sign(hashTx, 'base64');
        this.signature = sig.toDER('hex');
    }

    isValid(){
        if(this.fromAddress === null) return true;

        if(!this.signature || this.signature.length === 0){
            throw new Error('No signature is in this transaction');
        }

        const publicKey = ec.keyFromPublic(this.fromAddress, 'hex');
        return publicKey.verify(this.calculateHash(), this.signature);
    }


}

class Block {
    constructor(timestamp, transanctions, previousHash=''){
        this.timestamp=timestamp;
        this.transactions=transanctions;;
        this.previousHash=previousHash;
        this.hash=this.calculateHash();
        this.nonce=0;
    }

    calculateHash(){
        return SHA256(this.index + this.timestamp + this.previousHash + JSON.stringify(this.transactions) + this.nonce).toString();
    }

    mineBlock(difficulty){
        while(this.hash.substring(0, difficulty) !== Array(difficulty + 1).join("0")){
            this.nonce++;
            this.hash=this.calculateHash();
        }

        console.log(`Block mined: ${this.hash}`);
    }

    hasValidTransactions(){
        for(const tx of this.transactions){
            if(!tx.isValid()){
                return false;
            }
        }

        return true;
    }
}

class Blockchain{
    constructor(){
        this.difficulty=2;
        this.chain=[this.createGenesisBlock()];
        this.pendingTransactions = [];
        this.mineReward = 100;
    }

    createGenesisBlock(){
        return new Block("23/07/1998", "Genesis Block", "0")
    }

    GetLatestBlock(){
        return this.chain[this.chain.length - 1];
    }

    /*AddBlock(newBlock){
        newBlock.previousHash=this.GetLatestBlock().hash;
        newBlock.mineBlock(this.difficulty);
        this.chain.push(newBlock);
    }*/

    minePendingTransactions(miningRewardAddress){
        let block = new Block(Date.now(), this.pendingTransactions, this.GetLatestBlock().hash);
        block.mineBlock(this.difficulty);

        console.log('Block successfully mined!');
        this.chain.push(block);

        this.pendingTransactions = [
            new Transaction(null, miningRewardAddress, this.mineReward)
        ]
    }

    addTransactions(transaction){

        if(!transaction.fromAddress || !transaction.toAddress){
            throw new Error('Transaction must include from and to address');
        }

        if(!transaction.isValid()){
            throw new Error('Cannot add invalid transaction to chain');
        }

        this.pendingTransactions.push(transaction);
    }

    getBalanceOfAddress(address){
        let balance = 0;

        for(const block of this.chain){
            for(const trans of block.transactions){
                if(trans.fromAddress == address){
                    balance -= trans.amount;
                }
                 if(trans.toAddress == address){
                     balance += trans.amount;
                 }

            }
        }

        return balance;
    }

    isChainValid(){
        for(let i=1;i<this.chain.length;i++){

            const currentBlock = this.chain[i];
            const previousBlock = this.chain[i-1];

            if(!currentBlock.hasValidTransactions()){
                console.log("1");
                return false;
            }

            if(currentBlock.hash !== currentBlock.calculateHash()){
                console.log("2");
                return false;
            }

            if(previousBlock.hash !== currentBlock.previousHash){
                console.log("3");
                console.log(previousBlock.hash);
                console.log(currentBlock.hash);    
                return false;
            }
        }

        return true;
    }


}

module.exports.Blockchain = Blockchain;
module.exports.Transaction = Transaction;
