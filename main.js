const {Blockchain, Transaction} = require('./blockchain');
const EC = require('elliptic').ec;
const ec = new EC('secp256k1');

const myKey = ec.keyFromPrivate('767154cd74fee356409b5069cb2ff481d09431055243d32cde8f52249789d682');
const myWalletAddress = myKey.getPublic('hex');

let shubham= new Blockchain();

const tx1 = new Transaction(myWalletAddress, 'here go public key', 10);
tx1.signTransaction(myKey);
shubham.addTransactions(tx1);




/*console.log("Mining block 1....");
shubham.AddBlock(new Block("25/07/1998", {amount : 4}));
//console.log("Hash of the block : " + shubham.chain[1].hash)

console.log("Mining block 2....")
shubham.AddBlock(new Block("27/07/1998", {amount : 20}));
//console.log("Hash of the block : " + shubham.chain[2].hash)

//console.log("is the chain valid? " + shubham.isChainValid());
//console.log(JSON.stringify(shubham, null ,4));*/

/*shubham.createTransactions(new Transaction("ad1", "ad2", 100));
shubham.createTransactions(new Transaction("ad2", "ad1", 50));

shubham.minePendingTransactions("ad3");
console.log(shubham.getBalanceOfAddress("ad3"));
*/

shubham.minePendingTransactions(myWalletAddress);
console.log(shubham.getBalanceOfAddress(myWalletAddress));
console.log("Is this chain valid:", shubham.isChainValid());
console.log(JSON.stringify(shubham, null ,4));