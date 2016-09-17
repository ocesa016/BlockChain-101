#/bin/sh

echo Initialize the node

if [[ $BLOCKCHAIN_HOME == '' ]]; then
	echo \$BLOCKCHAIN_HOME is undefined
	exit 1
fi

$BLOCKCHAIN_HOME/Ethereum/geth init $BLOCKCHAIN_HOME/Ethereum/CustomGenesis.json
