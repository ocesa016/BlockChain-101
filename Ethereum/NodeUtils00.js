/*
 *	This file is part of BlockChain-101 package which is released under the MIT License.
 *	See file LICENSE file for full license details.
 */ 	

/*
 * Change Log 
 *
 * 	0.0 - Initial Release
 *  	
 */

function checkAllBalances() { 
var i =0; 
eth.accounts.forEach( function(e){
    console.log("  eth.accounts["+i+"]: " +  e + " \tbalance: " + web3.fromWei(eth.getBalance(e), "ether") + " ether"); 
	i++; 
})
}; 

function unlockAccounts() { 
var i =0; 
eth.accounts.forEach( function(e){
    personal.unlockAccount(eth.accounts[i],"test",0);
    console.log("  eth.accounts["+i+"]: unlocked !"); 
	i++; 
})
}; 

/*
var execSync = require('child_process').execSync;
function sleep(milliseconds) {
	var cmd = "waitFor " + milliseconds / 1000;
	
	try {
		console.log("Running Command [" + cmd + "]");
		result = execSync(cmd);
	}
	catch (error) {
		console.log("ERROR: Command [" + cmd + "] Failed.");
		console.log(error.toString());
	}
}
*/
function sleep(milliseconds) {
  var start = new Date().getTime();
  for (var i = 0; i < 1e7; i++) {
    if ((new Date().getTime() - start) > milliseconds){
      break;
    }
  }
}

//  console.log("monitor(loops) initiates a mining monitoring loop");
function monitor(loops) {

	var loop = 1;
	
	checkAllBalances();
		
	console.log("  ...Starting Miner. current block " + eth.blockNumber + " pending transactions " + eth.pendingTransactions.length);
	miner.start(4)

	while ( eth.pendingTransactions.length > 0 || loop < loops) {
		loop++;
		sleep(8000); // 8 seconds
		console.log("  ...Mining... current block " + eth.blockNumber + " pending transactions " + eth.pendingTransactions.length);
	}
	
	checkAllBalances();
	
	console.log("  ...Stopping Miner. current block " + eth.blockNumber + " pending transactions " + eth.pendingTransactions.length);
	console.log("");
	miner.stop();
}

function chk() {
	console.log("  Mining: " + eth.mining + " CurrentBlock: " + eth.blockNumber + " PendingTransactions: " + eth.pendingTransactions.length);
}

function getBLK(block) {

    console.log("  ...Getting Block Info for " + block);
	
	var blk = eth.getBlock(block);
	console.log("  nonce           " + blk.nonce);
	console.log("  hash            " + blk.hash);	
	console.log("  miner           " + blk.miner);
	console.log("  difficulty      " + blk.difficulty);
	console.log("  gasUsed/gasLimt " + blk.gasUsed + " / " + blk.gasLimt);
	console.log("  timestamp       " + blk.timestamp);
	console.log("  blockTransCount " + eth.getBlockTransactionCount(block));	
	console.log("");
	
}
//  console.log("getTR(transHash) initiates a mining monitoring loop");
function getTR(tran) {

    console.log("  ...Getting transaction receipt for " + tran);
	
	var trr = eth.getTransactionReceipt(tran);
	console.log("  blockNumber     " + trr.blockNumber);
	console.log("  gasUsed/comulat " + trr.gasUsed + " / " + trr.comulativeGasUsed);
	console.log("  contractAddress " + trr.contractAddress);
	console.log("  logLenght       " + trr.logs.length);
	console.log("");
	
	getBLK(trr.blockNumber);
	
}

//  console.log("trans() initiates transfer of ether");
function trans() { 

	// Create another accout if needed
	if (eth.accounts.length == 1) {
		personal.newAccount("test");
	}

	var primary = eth.accounts[0];
	personal.unlockAccount(eth.accounts[0],"test");

	var sender = eth.accounts[0];
	var receiver = eth.accounts[1];
	var amount = web3.toWei(1.00, "ether");

	var txhash = eth.sendTransaction({from:sender, to:receiver, value: amount})
	console.log("  -----> Transaction: " + txhash);

	// monitor till there are eth.pendingTransactions
	monitor(0); 

	getTR(txhash);
}

function help() { 

	console.log("");
	console.log("");
	console.log("Utils Library Loaded");
	console.log("");
	console.log("trans() initiates transfer of ether");
	console.log("monitor(loops) initiates the OLD STYLE mining monitoring loop");
	console.log("automine() initiates the NEW STYLE mining monitoring loop");
	console.log("unlockAccounts() Unlock Accounts");
	console.log("miner.start(4) Start mining");
	console.log("miner.stop() Stop mining");
	console.log("chk() show one mining");
	console.log("");
	console.log("");
}

function automine() { 
	
	var checkCount = 20;
	var pendings   = eth.pendingTransactions.length;
	
	console.log("Automine Started !");

	function IterateOver(iterator, endLoop) {

		function doNext() {

			// Start Mining if needed
			if (!web3.eth.mining && pendings > 0) {
				console.log('Starting mining...');
				miner.start(4);
				console.log('Mining Started !!');
			}

			checkCount--;

			//  
			// Check Monitoring Conditions
			//
			if(checkCount <= 0 && pendings === 0 ) {
				endLoop();
			} else {
				iterator(doNext);
			}
		}
		iterator(doNext);
	}

	IterateOver(function(reportBack) {

		web3.eth.getBlockTransactionCount("pending", function(error, result) {
			if(!error) {
				// Output the string 
				pendings = result;
				console.log('Checks Left: ' + checkCount + ' Mining: ' + web3.eth.mining + ' Block: ' + web3.eth.blockNumber + ' Pending Transactions: ' + result.toString());	
			} else {
				console.log('\n ERROR: ' + error.toString());
				console.error(error);
			}

			// Wait a bit...
			setTimeout(function() {
				reportBack();
			}, 3000);
		});
				
		}, 
		// Completition Call Back  
		function() { 
			if (web3.eth.mining) {
				console.log('Stopping mining...');
				miner.stop();
				console.log('Mining Stopped !!');
			}
			console.log('Automine Ended !!' );		
		});	
}

function set1() {

	var primary = eth.accounts[0];
	personal.unlockAccount(eth.accounts[0],"test");

	// PROBLEM. This does not return txhash !!
	var globalRegistrarTxHash = admin.setGlobalRegistrar("", primary); 
	var hashRegAddr = admin.setHashReg("", primary);
	var urlHintAddr = admin.setUrlHint("", primary);

	console.log("  -----> Transaction: " + globalRegistrarTxHash);

	// monitor till there are eth.pendingTransactions
	monitor(0); 

	getTR(globalRegistrarTxHash);

	var globalRegistrarAddr = eth.getTransactionReceipt(globalRegistrarTxHash).contractAddress;
	var registrar = GlobalRegistrar.at(globalRegistrarAddr);

	// Verification
	primary == registrar.owner("HashReg");
	primary == registrar.owner("UrlHint");
	hashRegAddr == registrar.addr("HashReg");
	urlHintAddr == registrar.addr("UrlHint");

	eth.getCode(registrar.address);
	eth.getCode(registrar.addr("HashReg"));
	eth.getCode(registrar.addr("UrlHint"));

}


function reg() { 

	var contractaddress = '0x4b6ea93b78f8c81b70689464d478ac2e27755af3';
	var contractname = 'regTest';

	console.log('Getting Contract Info...');
	var info = admin.getContractInfo(contractaddress); 

	console.log('Saving Contract Info...');
	var contenthash = admin.saveInfo(info, "C:\\BCWORK\\info.json");
	
	console.log('contenthash is: ' + contenthash);

	console.log('Registering the Contract...');
	admin.register(eth.accounts[0], contractaddress, contenthash)

	console.log('Registering the URL...');
	filename = "C:\\BCWORK\\info.json";
	admin.registerUrl(primary, contenthash, "file://"+filename);

}

unlockAccounts();
help();
