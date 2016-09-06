
 Assumptions:
 ------------
 	The package BlockChain-101 was unpacked in C:\BlockChain-101
	
	If you have unpaked in a different directory edit the file
	Demo00Server.js
	and update the "server confituration" section at the top of the file. 

 Requirements:
 -------------
 
  git       https://git-scm.com/downloads
			Only needs the git shell.
			
  node.js   https://nodejs.org/en/download/
			Make sure you also install the NPM (the pakage manager)
			
  geth.exe  https://github.com/ethereum/go-ethereum/releases
            This is the ethereum Node executable.
			
			
 Install:
 --------
 
 1) open a GIT SHELL and go in C:\BlockChain-101\Ethereum
 
 2) npm install 
	this will create a node_modules directory with 
		express 
		web3 
	modules installed. 
	
 3) place the geth.exe in C:\BlockChain-101\Ethereum 

 	
 Bootstrap the Ethereum Node:
 ----------------------------

 Open a Dos Command shell and go in C:\BlockChain-101\Ethereum 
 
 1) geth account new 
	when propted provide "test" as passphrase. 
	This creates the first account. 
	
 2) copy the user HASH value (the very long number)
 
 3) edit the CustomGenesis.json and place it in 
	the "coinbase": and "alloc": sections.
	
 4) save the file 
 
 5) Create 3 additional users as in step 1
 
 6) NodeInit.cmd
	This inizialise the node.
	
 7) NodeStart.cmd
	This starts an Ethereum node is stand alone test mode. 
	This also starts 3 command shells:
		- The geth node console (the windows with the > prompt)
		- The web server log output
		- The geth node log output
	
 8) On the geth node console type: 
	loadScript("C:\\BlockChain-101\\Ethereum\\NodeUtils00.js")
	
 9) on the node console type:
	trans()
	This will take quite some time to complete because the node 
	in initializing the mining data structure. 

 Play the Demo Code:
 -------------------
 
 10) Open a web browser to port 8093
	http://localhost:8093/	
	
 11) Once you submit transaction from the 	
	web server make sure to start mining in the node
	with the command 
	automine() 
	in the node console. 

 To quit:
 -------------------	
 1) on the node console type:
	exit
	
 2) Cntl-C on the other shells. 
 
 3) Close the browser 
  
 To restart perform step starting form 7, 8, 9 etc...

 To Clean Up: 
 ------------ 
 remove:
 %APPDATA%\\Roaming\Ethereum  
 %APPDATA%\ethash 
 
 To Restart:
 ------------ 
 remove all the content of 
 %APPDATA%\\Roaming\Ethereum  
 but keep the keystore directory that contnains the defined users. 
 You should not have to delete %APPDATA%\ethash either. 
 Resume from NodeInit.cmd step. 
 
