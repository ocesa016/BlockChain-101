echo off
echo Starting the node
start cmd /C "geth --identity "TestNodeOne" --maxpeers 0 -rpc --rpcport "8544" --rpccorsdomain "*" --port "30300" --nodiscover --rpcapi "db,eth,net,web3" --networkid 1987 console 2>log.txt"
echo .
echo .
echo .
echo loadScript("C:\\BlockChain-101\\Ethereum\\NodeUtils00.js")
echo .
echo .
echo .
pause
start cmd /c node Demo00Server.js
echo .
echo .
echo .
pause
REM tail -f log.txt 
powershell -command "& {Get-Content log.txt -Wait}"