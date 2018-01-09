
var Requestpromise = require('request-promise'),
    BigNumber = require('bignumber.js')

const ethereum_endpoint = "https://ropsten.infura.io/"; // Ropsten Testnet Endpoint
const public_address = "0xEA0fab7509A09571C41868da513950FF743745B1"; // test public address

const balanceHex = "0x70a08231"

// this Object Array List can be store in a json file or in database
const TokensList = [
    {
        "address": "0xdaf1e00673cdc5d911a2f26be1e7bcc50415211a",
        "name": "Eagle",
        "symbol": "EGL",
        "decimal": 18
    },
    {
        "address": "0x72314680658f6edc381785788696d4f21d685a4e",
        "name": "Eagle3",
        "symbol": "EGL3",
        "decimal": 18
    },
    {
        "address": "0x0f50b5db7110e2c4d9c60ab377f90ff3c6378b7f",
        "name": "Eagle5",
        "symbol": "EGL5",
        "decimal": 18
    }
]

var removeZeroEx = (address) =>  {
    return address.toLowerCase().replace('0x', '');
}

// https://stackoverflow.com/questions/10073699/pad-a-number-with-leading-zeros-in-javascript
var padLeft = (n, width, z) => {
    z = z || '0';
    n = n + '';
    return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
}

var getDataSignature = (token_address, balanceHex, addrArray) => {
    var address = "";
    for(var count = 0; count < addrArray.length; count++)
        address += padLeft(addrArray[count], 64);
    
    return balanceHex + address
}

var actions = TokensList.map((value) => {

    var dataSignature = getDataSignature(value.address, balanceHex, [removeZeroEx(public_address)]); 

    var options = {
        method: 'POST',
        uri: ethereum_endpoint,
        body: {
            jsonrpc: "2.0",
            method: "eth_call",
            params: [{
                to: value.address,
                data: dataSignature
            },"latest"],
            id: 1
        },
        json: true
    }

    var results = Requestpromise(options).then((body) => {
        var balance = 0;
        if(body.result && body.result != '0x') {
            balance = new BigNumber(body.result).div(new BigNumber(10).pow(value.decimal)).toString();
        }
        return {
            address: value.address,
            symbol : value.symbol,
            decimal: value.decimal,
            balance : balance
        }
    })

    return results

})
    
Promise.all(actions).then((results) => {
    results.map((result) => {
        console.log("Address: " + result.address);
        console.log("Symbol " + result.symbol);
        console.log("Decimal " + result.decimal);
        console.log("Balance " + result.balance);
        console.log("---------------------------");
    })
}).catch(error => {
    console.log("Error : "+ error)
});

