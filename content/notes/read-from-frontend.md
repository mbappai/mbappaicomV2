---
date: 2022-05-03
tags: ['note', 'solidity']
---
## How to read a public variable in solidity from frontend
Solidity creates a getter function for all public variables in your contract after it compiles. So the most efficient way of reading public variables from your front-end is as follows

```jsx
let result = await Contract.methods.publicVariable.call()
console.log(result)
```
