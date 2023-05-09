/* contants */
const connectUrlBase = 'https://hordesconnect.bysato.com';

class HordesConnect {

  constructor() {
    this.app = '';
    this.size = {
      width: 350,
      height: 600,
      top: (window.innerHeight / 2) - (600 / 2),
      left: (window.innerWidth / 2) - (350 / 2)
    }
    this.connected = false;
    this.address = null;
    this.utxos = {
      funds: [],
      dummies: []
    };

  }

  /* init */
  initialize({ app = '', size }) {
    this.app = app;

    const { top, left, width, height } = size || { };
    if( width && height ) {
      this.size = {
        width: width,
        height: height,
        top: top || ((window.innerHeight - height) / 2),
        left: left || ((window.innerWidth - width) / 2)
      }
    }
  }

  /* getters */
  getAddress() {
    if( !this.isConnected() ) {
      console.warn('Hordes Wallet is not connected')
    }
    return this.address;
  }

  getUtxos({ key = 'funds' }) {
    if( !this.isConnected() ) {
      console.warn('Hordes Wallet is not connected')
    }
    return this.utxos[key] || [];
  }

  /* actions */
  isConnected() {
    return this.connected;
  }

  open(params = { }, callback) {
    let hordesConnectWindow = window.open(`${connectUrlBase}?payload=${encodeURIComponent(JSON.stringify(params))}`, '_blank', `toolbar=no,scrollbars=no,resizable=no,top=${this.size.top},left=${this.size.left},width=${this.size.width},height=${this.size.height}}`);
    window.addEventListener('message', (e) => {
      let origin = e.originalEvent?.origin || e.origin;
      if( origin.includes(connectUrlBase) ) {
        callback(JSON.parse(e.data));
      }
    });
  }

  connect({ message = 'Address and list of utxos' } = { }) {
    return new Promise(async (resolve, reject) => {
      try {
        this.open({
          app: this.app,
          type: 'address_utxos',
          message: message,
        }, (data) => {
          if( data && data.type == 'address_utxos' ) {
            this.connected = true;
            this.address = data.payload.address;
            this.utxos = data.payload.utxos;
            resolve(true);
          }
        });
      } catch {
        reject(false)
      }
    });
  }

  signTransaction({ message = 'Sign Transaction', base64Psbt = null, broadcast = false }) {
    return new Promise(async (resolve, reject) => {
      try {
        this.open({
          app: this.app,
          type: 'sign_transaction',
          message: message,
          base64Psbt: base64Psbt,
          broadcast: broadcast
        }, (data) => {
          if( data && data.type == 'sign_transaction' ) {
            resolve(data.payload)
          }
        });
      } catch {
        reject({
          error: 'unable to sign transaction'
        });
      }
    });
  }

}

const hordesConnect = new HordesConnect();

window.HordesConnect = hordesConnect;
export default hordesConnect;
