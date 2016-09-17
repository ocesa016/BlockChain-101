
The BlockChainTheory
======================
This is the BlockChainTheory portion of the BlockChain-101 package.
	
It is intended to provide some explanation on what the technology is
and how it is evolving. 

This package is provided as a set of static HTML pages.  

Assumptions:
------------
The package BlockChain-101 was unpacked in C:\BlockChain-101

*Linux:* The package BlockChain-101 was unpacked in <your_install_folder>/BlockChain-101-master/ 
	 (e.g. /home/user123/Desktop/BlockChain-101-master/)	

If you have unpaked in a different directory edit the file
Theory00Server.js
and update the "server configuration" section at the top of the file. 

Requirements:
-------------
 
1. node.js    
[download] (https://nodejs.org/en/download/)
Make sure you also install the NPM (the pakage manager)

	* *Linux:*  
	Download node-v4.5.0-linux-x64.tar.xz (NPM is included)  
	Extract the node-v4.5.0-linux-x64.tar.xz in <your_install_folder>/BlockChain-101-master/  
	
			
Installation:
-------------
 
1. open a DOS Shell and cd to C:\BlockChain-101\BlockChainTheory
 
	* *Linux:* Open a terminal shell  
	 export BLOCKCHAIN_HOME=<your_install_folder>/BlockChain-101-master  
	 cd $BLOCKCHAIN_HOME/BlockChainTheory/  
	 

2. At the DOS Shell command prompt type:  
	npm install   
	This installs the needed express prerequisite in a node_modules directory.  

	* *Linux:* $BLOCKCHAIN_HOME/node-v4.5.0-linux-x64/bin/npm install

3. At the DOS Shell command prompt type:  
	node Theory00Server.js  
	This starts the node process that provides the web server.  

	* *Linux:*  
	modify the Theory00Server.js:  
		STARTPAGE: '<your_install_folder>/BlockChain-101-master/BlockChainTheory/web/Theory00_index.html',  
		PAGESROOT: '<your_install_folder>/BlockChain-101-master/BlockChainTheory/',  

	starts the node process:
	$BLOCKCHAIN_HOME/node-v4.5.0-linux-x64/bin/node Theory00Server.js &


View the presentation:
----------------------
 
1. Open a web browser to port 8093  
	http://localhost:8093/	
	
*Enjoy !!*   

 
License
-------
BlockChain-101 is licensed under the MIT license.
