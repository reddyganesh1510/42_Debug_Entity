const IpfsAPI = require("ipfs-api");
const ganache = require("ganache-cli");

// connect to ipfs daemon API server
// const ipfs = IpfsAPI('localhost', '5001', { protocol: 'http' })

const ipfs = new IpfsAPI({
  host: "ipfs.infura.io",
  port: 5001,
  protocol: "https",
});
// https://gateway.ipfs.io/ipfs/:hash
const Web3 = require("web3");
const HDWalletProvider = require("truffle-hdwallet-provider");
// const provider = new HDWalletProvider(
//   "79f40dcf6f5419fd378b5899e84164d8615902f07ae22d5ab40eb7e0915166cd",
//   "https://rinkeby.infura.io/v3/7d2698770e4e4363bda70be438142553"
// );
// const web3 = new Web3(
//   new Web3.providers.HttpProvider(
//     // "https://rinkeby.infura.io/v3/7d2698770e4e4363bda70be438142553"
//   )
// );
// const web3 = new Web3(provider);
const web3 = new Web3(ganache.provider());

const DocumentContract = require("../build/contracts/Document.json");
const Contract = new web3.eth.Contract(
  DocumentContract.abi,
  DocumentContract.address
);

module.exports = {
  ipfs,
  Contract,
  web3,
};
