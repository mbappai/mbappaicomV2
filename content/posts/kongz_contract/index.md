---
title: 'Cyberkongz part 1: Kongz contract breakdown'
date: 2022-06-26
description: Cyberkongz is a generative NFT that has a collection of 1000 unique and randomly generated 2D pixelated gorillas (known as kongz) tradable on open sea market place. These first 1000 set of minted kongz are know as **genesis kongz** which comes with the ability to breed with each other to extend a newly generated set of kongz known as **baby kongz.**
tags: ['post','nft','cyberkongz','breakdown']
---
 <br />


Cyberkongz is a generative NFT that has a collection of 1000 unique and randomly generated 2D pixelated gorillas (known as kongz) tradable on open sea market place. These first 1000 set of minted kongz are know as **genesis kongz** which comes with the ability to breed with each other to extend a newly generated set of kongz known as **baby kongz.**

These 34x34 pixelated kongz are not just freaking awesome to be used as profile pics in any social platform, but also has a huge community and a lot of utility around them!

Breeding of two genesis kongz gives birth to a baby kong as well as a 3D voxel kong which can be used as a social avatar in the metaverse.

The about page on the [cyberkongz website](https://www.cyberkongz.com/about) gives a well detailed explanation of the tokens entire ecosystem and tokenomics.

I just love how they manage to exquisitely blend their NFT’s with both DeFi and metaverse.

There are just so many thing we can learn as smart contract devs, specifically in the NFT space by understanding their contract design and development, that is why in the upcoming weeks, I’ll be dedicating them to diving into the contracts that makes cyberkongz what it is today and share my findings here as much as I can. 

---
<br />
<br />

## Kongz contract


<aside>
💡 It is important to mention that every function broken down in this article belongs to the kongz contract. Any mention of a function that is not inside the kongz contract will be clearly stated.

</aside>

Every kong goes through 2 main phases of growth

1. **Incubation**  
There are two main prominent places where a kong gets incubated in the contract. The first is during the initial minting of genesis kongz in the constructor, while the second is after breeding a new kong.  

2. **Evolve**  
This is the part where a kong evolves; what this means here is that the kong gets assigned a new gene which has some other meaning.
    

The kongz contract chiefly contains 5 key functionalities

- Ability to mint new Kong.
- Breeding between genesis kongz
- Ascending of kongz
- Ability for kongz to evolve
- Changing name and bio of kongz  
<br />
<br />

## Constructor

At the start of the contract, the contract owner starts by minting 3 genesis tokens for themselves as seen in the snippet below

```sol
contract Kongz {
... 

// data structure representing each kong
struct Kong {
		uint256 genes; // the value 0 implies that it's a genesis kong
		uint256 bornAt; // when the kong got minted
	}

constructor (
string memory _name, 
string memory _symbol, 
string[] memory _names, 
uint256[] memory _ids
) public ERC721Namable(_name, _symbol, _names, _ids) {
		// cyberkongz uses heroku to host their metadata
		_setBaseURI("https://kongz.herokuapp.com/api/metadata/");
		// owner minting 3 kongz for themselves.
		_mint(msg.sender, 1001);
		_mint(msg.sender, 1002);
		_mint(msg.sender, 1003);
		// saving state of newly minted kongz
		kongz[1001] = Kong(0, block.timestamp);
		kongz[1002] = Kong(0, block.timestamp);
		kongz[1003] = Kong(0, block.timestamp);
		// emiting events for newly minted kongz.
		emit KongIncubated(1001, 0, 0);
		emit KongIncubated(1002, 0, 0);
		emit KongIncubated(1003, 0, 0);
		// handling the total supply of kongz.
		bebeCount = 3;
	}

...
}
```
<br />
<br />

## Breeding kongz

This function is responsible for creating and incubating **baby kongz** provided that the owner has two genesis kongz to serve as a sire and a matron. 

More description is added in the comments.

```solidity
function breed(
uint256 _sire, 
uint256 _matron
) external {

		// confirm that msg.sender owns both NFT's serving as sire and matron
		require(ownerOf(_sire) == msg.sender && ownerOf(_matron) == msg.sender);

		// classified breedManager attempts to breed kongz if breed is successful 
		// then function continues execution else it terminates.
		require(breedManager.tryBreed(_sire, _matron));

		// the equavalent amount (600 BANANA) required for breeding gets burned from
		// msg.sender balance.
		yieldToken.burn(msg.sender, BREED_PRICE);

		// update token supply after birth of baby kong
		bebeCount++;

		// create ID for new baby kong
		uint256 id = 1000 + bebeCount; // 1004

		// nice! Baby kong is also from gen 0
		kongz[id] = Kong(0, block.timestamp); // should confirm this from team.
		
		// msg.sender is a proud owner of a baby kong
		_mint(msg.sender, id);

		// msg.sender announces to the world his new baby kongz alongside the parents.
		emit KongIncubated(id, _matron, _sire);
	}
```

**Noticeable changes**

- 600 BANANA’s was burned in order for the breeding process to take place.
- Token supply was updated
- Baby kong is added to kongz record with a newly generated id.
- Baby kong finally gets minted and assigned its new owner ( msg.sender )
- Baby kong gets incubated
<br />
<br />

## Evolving kongz — *function evolve()*

After a baby kong has been incubated, the last thing left for its full transition is to evolve. This function handles how a baby kong evolves by passing its `ID` as a parameter to the **tryEvolve** method inside the breedManager (which is kept secret from the world) which returns back a new gene for the kong.

 

```solidity
// @param _tokenId uint256 is the Id of kong to evolve
function evolve(
uint256 _tokenId
) external {
		require(ownerOf(_tokenId) == msg.sender);
		Kong storage kong = kongz[_tokenId];

		// kong must have a gene of 0 before it can be evolved.
		require(kong.genes == 0);

		// breedmanger tries to evolve the kong at the given tokenId.
		uint256 genes = breedManager.tryEvolve(_tokenId);
		
		kong.genes = genes;
		
		emit KongBorn(_tokenId, genes);
	}
```
<br />

**Assumptions**
Since there is no way for me to see exactly what goes on inside the `breedManager.tryEvolve` method, my assumption is that; the method uses the tokenId to create a new gene to be reassigned to the evolving kong.

**Things I’m still unsure of**
I am still yet to fully understand what happens after the gene of a kong gets changed after evolving it. Does it get some special utility or something? Please let me know if you have a better understanding of this function.
<br />
<br />

## Ascending kongz

Seeing as the first generation of kongz were created and stored directly on Opensea, the team behind cyberkongz decided to migrate all of their tokens from Opensea to their own smart-contracts. The migration of tokens created and stored directly on Opensea to a smart-contract is what is known as — *ascending* 

```solidity

function ascend(
uint256 _tokenId,
uint256 _genes, 
bytes calldata _sig
) external {
		
		// confirms that the tokenId conforms to Opensea's ID format (REF 1)
		// Opensea ID format -> 73424079983647210902572285069973579475843508985221180214989722260978404425729
		require(isValidKong(_tokenId), "Not valid Kong");

		// extracts currentId format from opensea tokenFormat (REF 2)
		uint256 id = returnCorrectId(_tokenId);

		require(keccak256(abi.encodePacked(id, _genes)).toEthSignedMessageHash().recover(_sig) == SIGNER, "Sig not valid");
	
		kongz[id] = Kong(_genes, block.timestamp);
		_mint(msg.sender, id);
		OPENSEA_STORE.safeTransferFrom(msg.sender, burn, _tokenId, 1, "");
		yieldToken.updateRewardOnMint(msg.sender, 1);
		balanceOG[msg.sender]++;
		emit KongAscended(id, _genes);
	}
```
<br />

**REF1 - isValidKong**

`isValidKong` is a utility function used to check whether or not the the tokenID of a kong conforms to Opeansea ID format. Seeing as the explanation of this format is beyond the scope of this breakdown, I will instead leave a [medium post right here](https://medium.com/coinmonks/opensea-tokenid-explained-f420401f5109) that explains it properly.

```solidity
function isValidKong(uint256 _id) pure internal returns(bool) {
		// making sure the ID fits the opensea format:
		// first 20 bytes are the maker address
		// next 7 bytes are the nft ID
		// last 5 bytes the value associated to the ID, here will always be equal to 1
		// There will only be 1000 kongz, we can fix boundaries and remove 5 ids that dont match kongz
		if (_id >> 96 != 0x000000000000000000000000a2548e7ad6cee01eeb19d49bedb359aea3d8ad1d)
			return false;
		if (_id & 0x000000000000000000000000000000000000000000000000000000ffffffffff != 1)
			return false;
		uint256 id = (_id & 0x0000000000000000000000000000000000000000ffffffffffffff0000000000) >> 40;
		if (id > 1005 || id == 262 || id == 197 || id == 75 || id == 34 || id == 18 || id == 0)
			return false;
		return true;
	}
```
<br />

**REF2 - returnCorrectId**

This utility function is responsible for taking tokenId in Opensea’s Id format and extracting only the tokenId from it. Checkout this medium post that beautifully explains [opensea’s ID format](https://medium.com/coinmonks/opensea-tokenid-explained-f420401f5109) if this function confuses you.

```solidity
function returnCorrectId(uint256 _id) pure internal returns(uint256) {
		_id = (_id & 0x0000000000000000000000000000000000000000ffffffffffffff0000000000) >> 40;
		if (_id > 262)
			return _id - 5;
		else if (_id > 197)
			return _id - 4;
        else if (_id > 75)
            return _id - 3;
        else if (_id > 34)
            return _id - 2;
        else if (_id > 18)
            return _id - 1;
		else
			return _id;
	}
```
<br />
<br />

## Changing names and bio of kongz

Cyberkongz is really the first NFT project that I have personally witnessed that allows owners to change the name and bio by giving your kong(z) their very own unique story. However, these ability also come at a cost of few BANANA’s as we’ll see soon enough.

The actual implementation of the changeName and changeBio contract is another contract called **ERC721Namable** which was inherited by the kongz contract.

```solidity
function changeName(uint256 tokenId, string memory newName) public override {
		yieldToken.burn(msg.sender, nameChangePrice);
		super.changeName(tokenId, newName);
	}

	function changeBio(uint256 tokenId, string memory _bio) public override {
		yieldToken.burn(msg.sender, BIO_CHANGE_PRICE);
		super.changeBio(tokenId, _bio);
	}
```
<br />
<br />

## Up next

We have seen the invocation of some functions that live inside the **YieldToken** as well as the **ERC721Namable** contract. We will be taking those contracts one by one and breaking them down as well.
<br />
<br />

