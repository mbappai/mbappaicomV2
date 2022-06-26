---
date: 2022-05-05
tags: ['Note', 'Solidity']
---
## Solidity global variables
Some global variables in a contract provides external calls with information about the contract on the blockchain. Mind you, these are known as special global variables. The default scope of a global variable is contract-wide and only available within a contract, while special global variables are also accessible from an external source.

Global variables also known as state variables are declared outside of function (global scope) and are also known by default to have the **storage** class (variables that are stored permanently on the blockchain), while variables declared within functions are by default have the **memory** class.

### Special global variable
**msg.sender**

This happens to be a special variables that holds the address of a contract which called a function inside another contract.

> The way I see functions contained in a smart-contract, is like a server that has cloud functions contained in it, patiently waiting for an external invocation from either a client or a cloud-function like itself.

In light of the above discovery, the msg.sender variable holds the address of the smart-contract that is calling a function within a contract.
