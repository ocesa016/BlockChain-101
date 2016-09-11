echo off
echo CleanUp
del log.txt
del storageTX.txt
del storageCA.txt
echo Initialize the node
geth init CustomGenesis.json
