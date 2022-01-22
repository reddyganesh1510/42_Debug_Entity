const IpfsAPI = require("ipfs-api");
// connect to ipfs daemon API server
// const ipfs = IpfsAPI('localhost', '5001', { protocol: 'http' })

const ipfs = new IpfsAPI({
  host: "ipfs.infura.io",
  port: 5001,
  protocol: "https",
});
// https://gateway.ipfs.io/ipfs/:hash
const Web3 = require("web3");

const web3 = new Web3(
  new Web3.providers.HttpProvider(
    "https://rinkeby.infura.io/v3/7d2698770e4e4363bda70be438142553"
  )
);
const DocumentContract = require("../build/contracts/Document.json");
const Contract = new web3.eth.Contract(
  DocumentContract.abi,
  DocumentContract.address
);

module.exports = {
  ipfs,
  Contract,
};
