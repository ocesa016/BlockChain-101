/*
 *	This file is part of BlockChain-101 package which is released under the MIT License.
 *	See file LICENSE file for full license details.
 */ 	

/*
 * Change Log (bump the version in scfg)
 *
 * 	0.3 - Make it run stand alone
 *  0.4 - Handle transactions in async
 *  	
 */

/* 
 * Server Configuration
 */
var scfg = {

    SID: "DEMO00Server",
	PORT: '8093',
	STARTPAGE: 'C:\\BlockChain-101\\Ethereum\\web\\Demo00_index.html',
	PAGESROOT: 'C:\\BlockChain-101\\Ethereum\\',
	VERSION: '0.4',
	getServer: function() {
		return this.SID + ":" + this.PORT;
	}
}

//
// Requires 
// 

var fs = require('fs');
var url = require('url');
var http = require("http");
var express = require('express');

/*
if (typeof web3 !== 'undefined') {
  console.log(" *** REUSE PROVIDER ***");
  web3 = new Web3(web3.currentProvider);
} else {
  // set the provider you want from Web3.providers
  console.log(" *** NEW PROVIDER ***");
  web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8544"));
}
*/

/*
 *	Access the web3 provider 
 */
var web3;
var gasPrice = 0;
var EtherEuroChange = 10;
var EtherEuroDate = "July 20, 2016";
var online = false;
try {
	const Web3 = require('web3');	
	web3 = new Web3(new Web3.providers.HttpProvider("http://127.0.0.1:8544"));
	var version = web3.version.api;
	console.log(version);
	web3.eth.accounts; 
	gasPrice = web3.eth.gasPrice;
	online = true; // web3 is operational
}
catch (e) {
	console.log(e);
	console.log("");
	console.log(" ** Could not contact Node !!");
	console.log(" ** Will continue in stand alone mode **");
	console.log("");
	// process.exit();
}

/*
 *	Old style sleep funcion. Now deprecated.  
 */
var execSync = require('child_process').execSync;
function sleep(milliseconds) {
	var cmd = "waitFor " + milliseconds / 1000;
	
	try {
		// console.log("Running Command [" + cmd + "]");
		result = execSync(cmd);
	}
	catch (error) {
		console.log("ERROR: Command [" + cmd + "] Failed.");
		console.log(error.toString());
	}
}

function addTransaction2Queue(trans,type) {
	fs.appendFileSync('storageTX.txt', trans + ';' + type + '\n');
	txsQueue.push(new txsObject(trans, type)); 
}

function addContract2Queue(caddr,type) {
	fs.appendFileSync('storageCA.txt', caddr + ';' + type + '\n');
	cadQueue.push(new txsObject(caddr, type)); 
}


/*
 *	Asyncronous transaction wait  
 */
function transactionWaitAsync(trans,res,type) {

	if (res) res.write("\n\nTransaction: " + trans);
	if (res) res.write("\n\nWaiting for Transaction Receipt...");

	console.log("transactionWaitAsync for " + trans);

	var checkCount = 50;
	var received = false;
	
	function checkReceipt(iterator, endLoop) {
		var doneCount = 0;  		
		function doNext() {

			doneCount++;	
			// Check Monitoring Conditions
			if(doneCount === checkCount || received ) {
				endLoop();
			} else {
				iterator(doNext,endLoop);
			}
		}
		iterator(doNext,endLoop);
	}

	checkReceipt(function(reportBack) {

		web3.eth.getTransactionReceipt(trans, function(error, result) {
			if(!error) {
				if (result) {
					// Output the string 
					var trr  = "\n\nTransaction Receipt:    " 
						+ "\n  blockNumber     " + result.blockNumber
						+ "\n  gasUsed         " + result.gasUsed
						+ "\n  contractAddress " + result.contractAddress
						+ "\n  logLenght       " + result.logs.length
						+ "\n";
					res.write(trr.toString());

					if (result.contractAddress) {

						myContractAddress = result.contractAddress;
						myContractInstace = myContract.at(myContractAddress);
						console.log("Contrct Address Set: " + myContractAddress);
						if (res) res.write("\n ** Contrct Address Set: " + myContractAddress);
						addContract2Queue(myContractAddress,'Demo00');
						received = true;						
						reportBack();
						return;
					}
				} else {
					// No result yet... wait a bit and retry
					setTimeout(function() {
						if (res) res.write("\nWaiting...");
						reportBack();
						return;
					}, 5000);
				}
			} else {
				if (res) res.write('\n ERROR in transactionWaitAsync: ' + error.toString());
				console.error(error);	
				if (res) res.end("\nDone!");
			}
		});	
	},
	function() { 
		console.log('Waiting Ended !!');
		if (res) res.end("\nDone!");
	});	
}

/*
 *	Transfer   
 */
function transferNewAsync(a,b,c,res) { 

	var sender = web3.eth.accounts[a];
	var receiver = web3.eth.accounts[b];
	var amount = web3.toWei(c, "ether");

	try {
		var txhash = web3.eth.sendTransaction({from:sender, to:receiver, value: amount})
		if (res) res.write("\nTransfer Transaction Sent.");
		addTransaction2Queue(txhash,"Transfer");
		transactionWaitAsync(txhash,res);
	}
	catch (e) {
		console.log(e);
		if (res) res.write("\n\n** ERROR ** \n" + e.toString());
		if (res) res.end("\nDone!");
	}
}

/*
 *	DEMO Contract Control Variables   
 */
var myContract;
var myContractAddress;
var myContractInstace;

 var code = 
 '606060405260405161047f38038061047f8339810160405280510160605160028054600160a060020a031916331781553460009081556004805460ff1916905583516003805492819052936020601f60001960018616156101000201909416949094048301939093047fc2575a0e9e593c00f959f8c92f12db2869c3395a3b0502d05e2516446f71f85b9081019391929091608001908390106100d657805160ff19168380011785555b506100c59291505b8082111561010657600081556001016100b1565b5050506103758061010a6000396000f35b828001600101855582156100a9579182015b828111156100a95782518260005055916020019190600101906100e8565b5090566060604052361561006c5760e060020a600035046317d7de7c81146100745780631865c57d146100dd57806320965255146100ea578063603daf9a146100f55780636a8165481461010957806373fac6f014610126578063dbd0e1b614610143578063feb71d9a14610157575b61016e610002565b61017060408051602081810183526000825282516003805460026000196001831615610100020190911604601f810184900484028301840190955284825292939092918301828280156102385780601f1061020d57610100808354040283529160200191610238565b6101de60045460ff165b90565b6101de6000546100e7565b6101f0600254600160a060020a03166100e7565b61016e600254600160a060020a0333811691161461024757610002565b61016e600254600160a060020a033381169116146102c557610002565b6101f0600154600160a060020a03166100e7565b61016e60045460009060ff16811461034657610002565b005b60405180806020018281038252838181518152602001915080519060200190808383829060006004602084601f0104600f02600301f150905090810190601f1680156101d05780820380516001836020036101000a031916815260200191505b509250505060405180910390f35b60408051918252519081900360200190f35b60408051600160a060020a03929092168252519081900360200190f35b820191906000526020600020905b81548152906001019060200180831161021b57829003601f168201915b505050505090506100e7565b50565b60045460009060ff16811461025b57610002565b6040517f52805cf33d678577574a085577701d49f18378b491bccd3232f1815a923a87a490600090a16004805460405160ff19909116600317909155600254600160a060020a03908116916000913016319082818181858883f19350505050151561024457610002565b60045460019060ff1681146102d957610002565b6040517f64ea507aa320f07ae13c28b5e9bf6b4833ab544315f5f2aa67308e21c252d47d90600090a160048054604051600260ff1990921691909117909155600154600160a060020a03908116916000913016319082818181858883f19350505050151561024457610002565b506001805473ffffffffffffffffffffffffffffffffffffffff1916331781556004805460ff1916909117905556';

myContract = web3.eth.contract([{"constant":true,"inputs":[],"name":"getName","outputs":[{"name":"","type":"string"}],"type":"function"},{"constant":true,"inputs":[],"name":"getState","outputs":[{"name":"","type":"uint8"}],"type":"function"},{"constant":true,"inputs":[],"name":"getValue","outputs":[{"name":"","type":"uint256"}],"type":"function"},{"constant":true,"inputs":[],"name":"getBuyer","outputs":[{"name":"","type":"address"}],"type":"function"},{"constant":false,"inputs":[],"name":"cancelOrder","outputs":[],"type":"function"},{"constant":false,"inputs":[],"name":"confirmReceived","outputs":[],"type":"function"},{"constant":true,"inputs":[],"name":"getSeller","outputs":[{"name":"","type":"address"}],"type":"function"},{"constant":false,"inputs":[],"name":"confirmShipment","outputs":[],"type":"function"},{"inputs":[{"name":"demoName","type":"string"}],"type":"constructor"},{"anonymous":false,"inputs":[],"name":"itemReceived","type":"event"},{"anonymous":false,"inputs":[],"name":"orderCancell","type":"event"}]);


/*
 * Create a contract   
 */
function createContractOriginal(a,c,res) { 

	console.log("createContractOriginal..." );

	try {
		var txhash = web3.eth.sendTransaction({from: web3.eth.accounts[a], data: code, gas:3000000, value: web3.toWei(c, "ether")});
		if (res) res.write("\nContract Transaction Sent.");
		addTransaction2Queue(txhash,"New Contract");
		transactionWaitAsync(txhash,res);
	}
	catch (e) {
		console.log(e);
		if (res) res.write("\n\n** ERROR ** \n" + e.toString());
		if (res) res.end("\nDone!");
	} 
};

/*
 * Create a contract   
 */
function createContractNew(a,b,c,res) { 

	console.log("createContractNew..." );

	try {
		// MyContract.new([arg1, arg2, ...,]{from: primaryAccount, data: evmCode}, function(err, contract) {
		 myContract.new(b,{from: web3.eth.accounts[a], data: code,  gas:3000000, value: web3.toWei(c, "ether")}, function(err, contract) {	
			if (!err) {
				// on first invocation we have the transaction hash. 
				// on second when mined.
				if (!contract.address) {
					res.write('\nContract Transaction: ' + contract.transactionHash);
					res.write('\n\nWaiting for mining to complete...');
					addTransaction2Queue(contract.transactionHash,"New Contract");
				} else { 
					myContractAddress = contract.address;
					myContractInstace = myContract.at(myContractAddress);
					res.write('\n\nContract Address:     ' + myContractAddress);
					addContract2Queue(myContractAddress,b);
					res.end("\nDone!");
				}
			} else {
				res.write("\n\n** ERROR ** \n" + err.toString());
				console.log(err.toString());
				res.end("\nDone!");
			}

		});	
	}
	catch (e) {
		console.log(e);
		res.write("\n\n** ERROR ** \n" + e.toString());
		res.end("\nDone!");
	} 
};

/*
 * Ship a contract   
 */
function confirmShip(a,res) { 

	try {
		var txhash = myContractInstace.confirmShipment.sendTransaction({from: web3.eth.accounts[a],  gas:3000000})
		if (res) res.write("\nShipment Transaction Sent.");	
		addTransaction2Queue(txhash,"Method Ship");
		transactionWaitAsync(txhash,res);
	}
	catch (e) {
		console.log(e);
		if (res) res.write("\n\n** ERROR ** \n" + e.toString());
		if (res) res.end("\nDone!");
	} 
 
};

/*
 * Receive a contract   
 */
function confirmReceive(a,res) { 

	try {
		console.log("confirmReceive..." );
		var txhash = myContractInstace.confirmReceived.sendTransaction({from: web3.eth.accounts[a],  gas:3000000})
		if (res) res.write("\nReceipt Transaction Sent.");	
		addTransaction2Queue(txhash,"Method Confirm");
		transactionWaitAsync(txhash,res);
	}
	catch (e) {
		console.log(e);
		if (res) res.write("\n\n** ERROR ** \n" + e.toString());
		if (res) res.end("\nDone!");
	} 
 
};

/*
 * Cancel a contract   
 */
function confirmCancel(a,res) { 

	try {
		console.log("confirmCancel..." );
		var txhash = myContractInstace.cancelOrder.sendTransaction({from: web3.eth.accounts[a],  gas:3000000})
		if (res) res.write("\nCancel Transaction Sent.");	
		addTransaction2Queue(txhash,"Method Cancel");
		transactionWaitAsync(txhash,res);
	}
	catch (e) {
		console.log(e);
		if (res) res.write("\n\n** ERROR ** \n" + e.toString());
		if (res) res.end("\nDone!");
	} 
 
};

/*
 * Show contract Info   
 */
function showContract(res, full) { 
	res.setHeader('Connection', 'Transfer-Encoding');
    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    res.setHeader('Transfer-Encoding', 'chunked');
	
	if (myContractInstace) { 
		if (full) res.write("Contract Info...\n");
		res.write("\nContract Address  " + myContractAddress + "\n");
	
		var cname = myContractInstace.getName.call();	
		res.write("\nContract Name     " + cname.toString());		

		var value = myContractInstace.getValue.call();
		res.write("\nContract Value    " + web3.fromWei(value) + " ether");

		if (full) res.write("\nContract Balance  " + web3.fromWei(web3.eth.getBalance(myContractAddress)) + " ether");

		var state = myContractInstace.getState.call();		
		res.write("\nContract State    " + contractStatus[state]);		
		if (full) res.write("\n");		

		var buyer = myContractInstace.getBuyer.call();			
		res.write("\nContract Buyer    " + buyer + " (" + getUser(buyer) + ")");	

		var seller = myContractInstace.getSeller.call();			
		res.write("\nContract Seller   " + seller + " (" + getUser(seller) + ")");

	} else {
		res.write("Contract Address Not Set !!\n");
	}	

};


/*
 * Contract Status  
 */
var contractStatus = [ 'Created', 'Shipped', 'Delivered', 'Cancelled', 'Unknown'];

/*
 * Handle the transaction history.  
 */
var txsQueue = new Array();
var cadQueue = new Array();

// Transaction;Type;
function txsObject(hash, type) {
	this.txhash = hash;
	this.txtype = type;
}
// Methods
txsObject.prototype.toURL = function () {
	return '<tr><td><a href="/queryTrans?txhash=' + this.txhash + '" target="resultframe">' + this.txhash + '</a></td><td>' + this.txtype + '</td></tr>';
};
txsObject.prototype.toContractURL = function () {
	var state = 5;
	var value = 0;
	var balan = 0;
	if (online) {
		var	myContractInstace = myContract.at(this.txhash);
		state = myContractInstace.getState.call();
		balan = web3.fromWei(web3.eth.getBalance(this.txhash), "ether");
	}
	
	return '<tr><td><a href="/setContract?txhash=' + this.txhash + '" target="resultframe">' + this.txhash + '</a></td><td>'  + this.txtype + '</td><td align="right">' + balan + '</td><td>' + contractStatus[state] + '</td><tr>';
};

/*
 * Users  
 */
var user = [ 'Zero', 'One', 'Two', 'Three', 'Four', 'Five','Unknown'];
function getUser(uhash) { 
	var i=0;
	var match = 6;
	web3.eth.accounts.forEach( function(e) {
		// console.log("getUser " + e + " " + uhash );
		if (e === uhash)  {
			// console.log("MATCH getUser " + e + " " + uhash );
			match = i;
		}
		i++; 
	})
	return user[match]
};

//
// Get Transactions 
//
try {
	var stat = fs.statSync('storageTX.txt');  
	var data = fs.readFileSync('storageTX.txt').toString();
	var lineToRead = data.split('\n');

	console.log("Getting Transactions: " + lineToRead.length);
	for(var line = 0; line < lineToRead.length; line++) {
		var lineFields = lineToRead[line].split(';');
		if (lineFields.length === 2) {
			txsQueue.push(new txsObject(lineFields[0], lineFields[1])); 
			console.log("Added Transaction: " + lineToRead[line]);
		}
	}
}
catch (e) {
	console.log(e);
	console.log("No Transactions Found...");
}

//
// Get Contract Address 
//
try {
	var stat = fs.statSync('storageCA.txt');  
	var data = fs.readFileSync('storageCA.txt').toString();
	var lineToRead = data.split('\n');

	console.log("Getting Contracts: " + lineToRead.length);
	for(var line = 0; line < lineToRead.length; line++) {
		var lineFields = lineToRead[line].split(';');
		if (lineFields.length === 2) {
			cadQueue.push(new txsObject(lineFields[0], lineFields[1])); 
			console.log("Added: " + lineToRead[line]);
		}
	}
}
catch (e) {
	console.log(e);
	console.log("No Contract Address Found...");
}

//
// Express Server 
// 
var app = express();

app.use(function(req, res, next) {
  console.log(scfg.getServer() + " Incoming " + req.method + " request for " + req.url);
  next();
});

//
// Those methods are used to act as root server 
//

// Respond to the index page
app.get('/', function (req, res) {
    res.writeHead(200, {'Content-Type': 'text/html'});
	res.write(fs.readFileSync(scfg.STARTPAGE));	
    res.end('Tappo');
})

// Respond to the _frame pages
app.get('/*_frame.html', function (req, res) {
    res.writeHead(200, {'Content-Type': 'text/html'});
	res.write(fs.readFileSync(scfg.PAGESROOT + req.url));	
    res.end('Tappo');
})
// Respond to css
app.get('/*.css', function (req, res) {
    res.writeHead(200, {'Content-Type': 'text/css'});
	res.write(fs.readFileSync(scfg.PAGESROOT + req.url));	
    res.end();
})
// Respond to Image
app.get('/*.jpg', function (req, res) {
    res.writeHead(200, {'Content-Type': 'image/xyz'});
	res.write(fs.readFileSync(scfg.PAGESROOT + req.url));	
    res.end();
})

////////////////////////////////////////////////
// Add here the module specific funcions. 
////////////////////////////////////////////////

// Show node info
app.get('/info', function (req, res) {
	res.setHeader('Connection', 'Transfer-Encoding');
    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    res.setHeader('Transfer-Encoding', 'chunked');
	res.write("\n");
	res.write("\nNode Info:");
	res.write("\n   web3.version.api: "+ web3.version.api);
	res.write("\n   web3.version.client: "+ web3.version.client);
	res.write("\n   web3.version.network: "+ web3.version.network);	
	res.write("\n   web3.version.ethereum: "+ web3.version.ethereum);	
	res.write("\n");	
	res.write("\n   web3.eth.mining:   "+ web3.eth.mining);	
	res.write("\n   web3.eth.gasPrice: "+ gasPrice + " Wei ");
	
	
    res.end('\nDone!');

});

// Show accounts balances
app.get('/balance', function (req, res) {
	res.setHeader('Connection', 'Transfer-Encoding');
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.setHeader('Transfer-Encoding', 'chunked');
	
	res.write("<html><body>");
	res.write("<br><br><b>Accoounts:</b><br><br>");
	res.write('<table cellpadding="3" cellspacing="8" border="1" align="left"> <tbody>');
	res.write('<tr><td>User</td><td>Hash</td><td align="right">Balance</td></tr>');

	var i = 0; 
	var result = "";
	
	web3.eth.accounts.forEach( function(e){
		res.write('<tr><td>'+ user[i] + '</td><td>' + e + '</td><td align="right">' + web3.fromWei(web3.eth.getBalance(e), "ether") + '</td></tr>'); 
		i++; 
	})
    res.end('</body></html>');
});

// Create a new contract
app.get('/doContract', function (req, res) {
	res.setHeader('Connection', 'Transfer-Encoding');
    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    res.setHeader('Transfer-Encoding', 'chunked');
	
	
    var params = url.parse(req.url,true).query;
    // console.log(params);
    var a = params.from;
    var b = params.item;
    var c = params.amount;
	
	res.write("Creating Contract...\n");
	// createContractOriginal(a,c,res);
	createContractNew(a,b,c,res);


});

// Ship Goods
app.get('/doShip', function (req, res) {
	res.setHeader('Connection', 'Transfer-Encoding');
    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    res.setHeader('Transfer-Encoding', 'chunked');
	
	res.write("Confirming Shipment...\n");
	
	var params = url.parse(req.url,true).query;
    var a = params.from;
    
	confirmShip(a,res);

});

// Receive Goods
app.get('/doReceive', function (req, res) {
	res.setHeader('Connection', 'Transfer-Encoding');
    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    res.setHeader('Transfer-Encoding', 'chunked');
	
	res.write("Confirming Reception...\n");
	var params = url.parse(req.url,true).query;
    var a = params.from;

	confirmReceive(a,res);

});

// Cancel Order
app.get('/doCancel', function (req, res) {
	res.setHeader('Connection', 'Transfer-Encoding');
    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    res.setHeader('Transfer-Encoding', 'chunked');
	
	res.write("Cancelling Order...\n");
	var params = url.parse(req.url,true).query;
    var a = params.from;

	confirmCancel(a,res);

});

// Transfer
app.get('/doTransfer*', function (req, res) {

	res.setHeader('Connection', 'Transfer-Encoding');
    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    res.setHeader('Transfer-Encoding', 'chunked');
	

    var params = url.parse(req.url,true).query;

    // console.log(params);
	// http://localhost:8090/Somma?number1=1&number2=3
    var a = params.from;
    var b = params.to;
    var c = params.amount;
	
	res.write("Initiate transfer...");
	
	transferNewAsync(a,b,c,res);

});	

// show contract info
app.get('/getinfo', function (req, res) {
	res.setHeader('Connection', 'Transfer-Encoding');
    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    res.setHeader('Transfer-Encoding', 'chunked');

	showContract(res, false);
	
    res.end('\nDone!');

});

// showTransactions
app.get('/showTransactions', function (req, res) {
	res.setHeader('Connection', 'Transfer-Encoding');
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.setHeader('Transfer-Encoding', 'chunked');
	
	res.write("<html><body>");

    /*
	console.log(' forEach ');
	txsQueue.forEach(
		function (elem, index) { 
		console.log(index + '. ' + elem);
	});
	*/
	if (txsQueue.length > 0) {
		res.write("<br><br><b>Trasactions:</b><br><br>");
		res.write('<table cellpadding="2" cellspacing="8" border="1" align="left"> <tbody>');
		res.write('<tr><td>Transaction</td><td>Type</td></tr>');
		for(var line = 0; line < txsQueue.length; line++) {
			// var lineFields = txsQueue[line].toURL();
			res.write(txsQueue[line].toURL());
		}
		res.write('</tbody></table>');
	} else {
		res.write("<br><br><b>There are no trasactions.</b>");
		res.write("<br>Perform some operations to generate transactions");
	} 

	
    res.end('</body></html>');

});

// Query a transaction
app.get('/queryTrans*', function (req, res) {

	res.setHeader('Connection', 'Transfer-Encoding');
    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    res.setHeader('Transfer-Encoding', 'chunked');
	

    var params = url.parse(req.url,true).query;

	// http://localhost:8090/queryTrans?txhash=xxxx
    var  trans = params.txhash;  
	console.log('getting tx ' + trans);
    web3.eth.getTransaction(trans, function(error, result) {
			if(!error) {
				if (result) {
					// Output the string 
					var trr  = "\n\nTransaction:\n" 
						+ "\n  blockNumber     " + result.blockNumber
						+ "\n  input           " + result.input
						+ "\n  from            " + result.from + " (" + getUser(result.from) + ")"
						+ "\n  to              " + result.to   + " (" + getUser(result.to) + ")"
						+ "\n  value           " + web3.fromWei(result.value) + " ether"
						+ "\n";
					res.write(trr.toString());

					web3.eth.getTransactionReceipt(trans, function(error, result) {
						if(!error) {
							if (result) {
								var trr  = "\n\nTransaction Receipt:\n" 
									+ "\n  blockNumber     " + result.blockNumber
									+ "\n  contractAddress " + result.contractAddress
									+ "\n  logLenght       " + result.logs.length
									+ "\n";
								res.write(trr.toString());

								var ttc  = "\n\nTransaction Cost:\n" 
									+ "\n  gasUsed  in wei  " + result.gasUsed 
									+ "\n  Transaction Cost in ether:  " + web3.fromWei(gasPrice * result.gasUsed, "ether")
									+ "\n  Transaction Cost in €    :  " + web3.fromWei(gasPrice * result.gasUsed, "ether") * EtherEuroChange
									+ "\n\n  where:"
									+ "\n     gasPrice in wei  " + gasPrice
									+ "\n     1 ether = 1e18 wei (quintillion)"
									+ "\n     1 ether = " + 1 * EtherEuroChange + " € as of " + EtherEuroDate
									+ "\n";								
								res.write(ttc.toString());

							} else {
								res.write('\n WARNING: Transaction Receipt Not Available');
							}
						} else {
							res.write('\n ERROR in Getting Transaction Receipt: ' + error.toString());
							console.error(error);	
						}

						res.end("\n\nDone!");

					});	// web3.eth.getTransactionReceipt

				} else {
						res.write("\nNo Transaction Data...");
						res.end("\n\nDone!");
				}
			} else {
				res.write('\n ERROR in getTransaction: ' + error.toString());
				console.error(error);
				res.end("\n\nDone!");	
			}

		});	// web3.eth.getTransaction

});	

// showContracts
app.get('/showContracts', function (req, res) {
	res.setHeader('Connection', 'Transfer-Encoding');
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.setHeader('Transfer-Encoding', 'chunked');
	
	res.write("<html><body>");

	if (cadQueue.length > 0) {
		res.write("<br><br><b>Contracts:</b><br><br>");
		res.write('<table cellpadding="2" cellspacing="8" border="1" align="left"> <tbody>');
		res.write('<tr><td>Contract</td><td>Name</td><td>Balance</td><td>Status</td></tr>');
		for(var line = 0; line < cadQueue.length; line++) {
			res.write(cadQueue[line].toContractURL());
		}
		res.write('</tbody></table>');
	} else {
		res.write("<br><br><b>There are no Contracts.</b>");
	} 
    res.end('</body></html>');

});

// Query a transaction
app.get('/setContract*', function (req, res) {

	res.setHeader('Connection', 'Transfer-Encoding');
    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    res.setHeader('Transfer-Encoding', 'chunked');
	

    var params = url.parse(req.url,true).query;

	// http://localhost:8090/queryTrans?txhash=xxxx
    myContractAddress = params.txhash;  
	console.log('contract ' + myContractAddress);
	myContractInstace = myContract.at(myContractAddress);

	showContract(res, true);

	res.write("\n\nThis is Now the Active Contract");
	
    res.end('\nDone!');


});


/*
	This function is currently not exposed from HTML because of 
	unexpected connection closures
	<br><a href="/doMonitor" target="statusframe">ShowMonitor</a>

	Keep here for future references
*/

app.get('/doMonitor*', function (req, res) {

	res.setHeader('Connection', 'Transfer-Encoding');
    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    res.setHeader('Transfer-Encoding', 'chunked');


	var checkCount = 10;
	var pendings   = 0; 

	function IterateOver(iterator, endLoop) {
		var doneCount = 0;  		
		function doNext() {

			doneCount++;	
			//  
			// Check Monitoring Conditions
			//
			if(doneCount === checkCount && pendings === 0 ) {
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
				res.write('\n Mining: ' + web3.eth.mining + ' Block: ' + web3.eth.blockNumber + ' PendingTransactions: ' + result.toString());	
			} else {
				res.write('\n ERROR: ' + error.toString());
				console.error(error);
			}
			// Wait a bit...
			setTimeout(function() {
				// console.log('Timeout ended !!');
				reportBack();
				return;
			}, 1000);
		});
				
		}, 

		function() { 
			console.log('doMonitor Ended !!');
			res.end('\nMonitor Stopped !');
			// Completition Call Back  
	});	
	
});	

// keep here for now.
app.get('/Somma*', function (req, res) {

	res.setHeader('Connection', 'Transfer-Encoding');
    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    res.setHeader('Transfer-Encoding', 'chunked');
	
	res.write("Computing...");
	
    var params = url.parse(req.url,true).query;

    console.log(params);
	// http://localhost:8090/Somma?number1=1&number2=3
    var a = params.number1;
    var b = params.number2;
    var numA = new Number(a);
    var numB = new Number(b);

    var sum = new Number(numA + numB).toFixed(0);
    res.write( numA + " + " + numB + " = " + sum);
    res.end('\nDone!');
	
});	

app.get("*", function(req, res) {
  res.write(scfg.getServer() + " ERROR 404 - Do not know how to handle Incoming " + req.method + " request for " + req.url);
  console.log(scfg.getServer() + " ERROR 404 -Do not know how to handle Incoming " + req.method + " request for " + req.url);
  res.end();
});

//Create and start the server. The callback is called when 
var server = http.createServer(app);
server.listen(scfg.PORT, function(){
        console.log(scfg.getServer() + " Version: " + scfg.VERSION + " listening on: http://localhost:%s start page: %s", scfg.PORT, scfg.STARTPAGE);
});

console.log("Tappo");
