pragma solidity >=0.4.21 < 0.8.0;

contract Document{
    struct DocumentItem{
        string ipfsHash;
        bool isValid;
    }
    address private owner;
    mapping(string => mapping(string => DocumentItem)) public users;

    constructor() public {
        owner = msg.sender;
    }

    modifier isOwner(){
        require(owner==msg.sender,"Only admin can perform this operation");
        _;
    }

    function upload(string memory id, string memory ipfs, string memory txHash) public isOwner() returns (bool) {
        DocumentItem memory documentItem= DocumentItem(ipfs,false); 
        users[id][txHash] = documentItem;
        return true;
    }

    function validate(string memory userId,string memory txHash, bool isValid) public isOwner() returns (bool) {
        DocumentItem storage documentItem = users[userId][txHash];
        documentItem.isValid = isValid;
        return true;
    }

    function hasValidated(string memory userId,string memory txHash) public isOwner() view returns(bool){
        return users[userId][txHash].isValid;
    }
    
}