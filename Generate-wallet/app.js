var EthUtil = require('ethereumjs-util'),
    EthCrypto = require('crypto'),
    QRCode = require('qrcode')

var GenerateWallet = (cb) => {
    while (true) {
        var private_key = EthCrypto.randomBytes(32)
        if (EthUtil.privateToAddress(private_key)[0] === 0) {
            private_key = private_key == 32 ? private_key : Buffer(private_key, 'hex')
            var wallet_data = {
                private_key : private_key.toString('hex'),
                public_key : '0x' + EthUtil.privateToPublic(private_key).toString('hex'),
                address: '0x' + EthUtil.privateToAddress(private_key).toString('hex')
            };
            return cb(wallet_data);
        }
    }
}

GenerateWallet(wallet => {
    QRCode.toDataURL(wallet.address, (err, public_address_qr) => {
        if(err)
            console.log("Error occured: " + err)
        else {
            QRCode.toDataURL(wallet.private_key, (err, private_key_qr) => {
                if(err)
                    console.log("Error occured: " + err)
                else {
                    var wallet_data = {
                        private_key : wallet.private_key,
                        public_address : wallet.address,
                        private_key_qr : private_key_qr,
                        public_address_qr : public_address_qr
                    };
                    console.log(wallet_data)
                }
            });
        }
    });
});
