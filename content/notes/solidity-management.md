---
date: 2022-05-03
tags: ['note', 'solidity']
---

## Solidity memory management
- **Storage:** These are variables that are committed to storage, meaning are persistent throughout the life-cycle of the contract on the blockchain. Reading and writing from it is quite expensive, especially writing; where the entire blockchain needs to be updated of the change.
- **Memory:** Variable with *memory* attached to them are destroyed immediately after function execution.
- **CallData:** These are used for call stack in the EVM such as the function calls.
