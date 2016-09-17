#/bin/sh

echo Starting the node

if [[ $BLOCKCHAIN_HOME == '' ]]; then
	echo \$BLOCKCHAIN_HOME is undefined
	exit 1
fi


MY_SHELL="xterm -fs 16 -geometry 160x40 -e "

$MY_SHELL"cd $BLOCKCHAIN_HOME/Ethereum/; $BLOCKCHAIN_HOME/Ethereum/geth --identity \"TestNodeOne\" --maxpeers 0 -rpc --rpcport \"8544\" --rpccorsdomain \"*\" --port \"30300\" --nodiscover --rpcapi \"db,eth,net,web3\" --networkid 1987 console 2>log.txt; read -p \"Press any key to close...\"" &

echo .
echo .
echo .
echo loadScript\(\"$BLOCKCHAIN_HOME/Ethereum/NodeUtils00.js\"\)
echo .
echo .
echo .

read -p "Press any key to start the server "

$MY_SHELL"cd $BLOCKCHAIN_HOME/Ethereum/; $BLOCKCHAIN_HOME/node-v4.5.0-linux-x64/bin/node Demo00Server.js; read -p \"Press any key to close...\"" &

echo .
echo .
echo .

read -p "Press any key to start the log window "

$MY_SHELL"cd $BLOCKCHAIN_HOME/Ethereum/; tail -f $BLOCKCHAIN_HOME/Ethereum/log.txt; read -p \"Press any key to close...\"" &

#loadScript("NodeUtils00.js")
