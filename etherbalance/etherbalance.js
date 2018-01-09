
var Request = require('request'),
    BigNumber = require('bignumber.js')

const ethereum_endpoint = "https://ropsten.infura.io/"; // Ropsten Testnet Endpoint
const public_address = "0xEA0fab7509A09571C41868da513950FF743745B1"; // test public address

var getEtherbalance = (ether_address, cb) => {
    var data = {
        jsonrpc: "2.0",
        method: "eth_getBalance",
        params: [
            ether_address,
            "latest"
        ],
        id: 1
    };
    Request.post({url: ethereum_endpoint,json: data}, (err, response, body) => {
        if(err)
            cb("Error occured: " + err, null);
        else {
            if(body.error)
                cb("Error occured: " + body.error.message, null);
            else
                cb(null, new BigNumber(body.result).div(new BigNumber(10).pow(18)).toString());
        }
    });
}

getEtherbalance(public_address, (err, response) => {
    if(err)
        console.log(err)
    else
        console.log("Ether Balance: "+ response)
})