
The Ethereum prototype
======================
This is the Ethereum prototype portion of the BlockChain-101 package.
	
It is intended to demonstrate Ethereum smart contracts by running a 
stand alone test ethereum node (not connected to the real blockchain)
	
 
Assumptions:
------------
The package BlockChain-101 was unpacked in C:\BlockChain-101

*Linux:*  The package BlockChain-101 was unpacked in <your_install_folder>/BlockChain-101-master/ 
	 (e.g. /home/user123/Desktop/BlockChain-101-master/)	
	
If you have unpaked in a different directory edit the file
Demo00Server.js
and update the "server confituration" section at the top of the file. 

Requirements:
-------------
 
1. git    
[download] (https://git-scm.com/downloads)    
Select the safiest command prompt option only.

	* *Linux (Ubuntu):* apt-get install git 
			
2. node.js    
[download] (https://nodejs.org/en/download/)
Make sure you also install the NPM (the pakage manager)

	* *Linux:* 
	Download node-v4.5.0-linux-x64.tar.xz (NPM is included)   
	Extract the node-v4.5.0-linux-x64.tar.xz in <your_install_folder>/BlockChain-101-master/
			
3. geth.exe   
[download] (https://github.com/ethereum/go-ethereum/releases)
This is the ethereum Node executable.
			
			
Installation:
-------------
 
1. open a GIT BASH and cd to C:\BlockChain-101\Ethereum

	* *Linux:*  Open a terminal shell  
	 export BLOCKCHAIN_HOME=<your_install_folder>/BlockChain-101-master  
	 cd $BLOCKCHAIN_HOME/Ethereum
 
2. At the GIT Shell command prompt type:  
	npm install   
	to installs the needed prerequisites (express and web3) in a node_modules directory.  

	* *Linux:*  $BLOCKCHAIN_HOME/node-v4.5.0-linux-x64/bin/npm install
	
3. place the geth.exe in C:\BlockChain-101\Ethereum 

	* *Linux:*  Place the geth executable in <your_install_folder>/BlockChain-101-master/Ethereum

 	
Bootstrap the Ethereum Node:
----------------------------

1. Open a Dos Command shell and go in C:\BlockChain-101\Ethereum 
 
	* *Linux:*  Open a terminal shell  
	 cd $BLOCKCHAIN_HOME/Ethereum

2. At the Dos command prompt type:  
	geth account new   
	When propted provide "test" as passphrase. This creates an account. 
	
	* *Linux:*  ./geth account new  
	 When propted provide "test" as passphrase. This creates an account. 

3. copy the user HASH value (the very long number) provided in output. 
 
4. edit the CustomGenesis.json and place the user HASH in the "coinbase": and "alloc": sections.
	
5. save the file 
 
6. Create 3 additional users (with "test" as passphrase) as in step 1. No need to modify the CustomGenesis.json.
 
7. At the Dos command prompt type:    
	NodeInit.cmd  
 	This initializes the node.

	* *Linux:*  ./NodeInit.sh
	
8. At the Dos command prompt type:  
	NodeStart.cmd  
	This starts an Ethereum node is stand alone test mode.  
	This also starts a command shell every time you press enter as requested.  
	A total of 3 shell will be available once completed.  
    1) The geth node console (The windows with the > prompt)  
	2) The web server log output  
	3) The geth node log output  

	* *Linux:*  	
	modify the Demo00Server.js:   
		STARTPAGE: '<your_install_folder>/BlockChain-101-master/Ethereum/web/Demo00_index.html',  
		PAGESROOT: '<your_install_folder>/BlockChain-101-master/Ethereum/',  
	starts the node process:  
		./NodeStart.sh  

9. On the geth node console type:   
	loadScript("C:\\BlockChain-101\\Ethereum\\NodeUtils00.js")

	* *Linux:*  
	loadScript("<your_install_folder>/BlockChain-101-master/Ethereum/NodeUtils00.js")
	
10. on the geth node console type:  
	trans()  
	This will take quite some time to complete because the node 
	in initializing the mining data structure. 

Run the Demo Code:
-------------------
 
1. Open a web browser to port 8093  
	http://localhost:8093/	
	
2. Once you submit transaction from the web server make sure the node is mining and if needed start mining with the command   
	automine()   
	in the node console. 

To Quit:
--------
1. on the node console type:  
	exit
	
2. Cntl-C on the other shells. 
 
3. Close the browser 
  
To restart perform step starting form 8, 9 etc...

To Clean Up: 
------------ 
 remove:  
 - %APPDATA%\\Roaming\Ethereum    
 - %APPDATA%\ethash   
 
*Linux:*   
	~/.ethereum  
	~/.ethash

To Restart:
------------ 
 remove all the content of   
 %APPDATA%\\Roaming\Ethereum    
 but keep the keystore directory that contnains the defined users. 
 You should not have to delete %APPDATA%\ethash either. 
 Resume from NodeInit.cmd step. 
 
*Linux:*  
	~/.ethereum
	
License
-------
BlockChain-101 is licensed under the MIT license.
