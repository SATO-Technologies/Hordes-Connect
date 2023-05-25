/* contants */
const connectUrlBase = 'https://hordesconnect.bysato.com';

/* utils */
import { isMobile } from './utils/device';

class HordesConnect {

  constructor() {
    this.app = '';
    this.size = {
      width: isMobile() ? window.innerWidth : 350,
      height: isMobile() ? window.innerHeight : 820,
      top: isMobile() ? 0 : (window.innerHeight / 2) - (820 / 2),
      left: isMobile() ? 0 : (window.innerWidth / 2) - (350 / 2)
    }

  }

  /* init */
  initialize({ app = '', size }) {
    this.app = app;

    const { top, left, width, height } = size || { };
    if( !isNaN(top) ) this.size.top = +top;
    if( !isNaN(left) ) this.size.left = +left;
    if( !isNaN(width) ) this.size.width = +width;
    if( !isNaN(height) ) this.size.height = +height;
  }

  /* actions */
  open(params = { }, callback) {
    let hordesConnectWindow = window.open(`${connectUrlBase}?payload=${encodeURIComponent(JSON.stringify(params))}`, '_blank', `toolbar=no,scrollbars=no,resizable=no,top=${this.size.top},left=${this.size.left},width=${this.size.width},height=${this.size.height}}`);
    window.addEventListener('message', (e) => {
      let origin = e.originalEvent?.origin || e.origin;
      if( origin.includes(connectUrlBase) ) {
        callback(JSON.parse(e.data));
      }
    });
  }

  getAddress({ message = 'Address and Utxos' } = { }) {
    return new Promise(async (resolve, reject) => {
      try {
        this.open({
          app: this.app,
          type: 'address_utxos',
          message: message,
        }, (data) => {
          if( data && data.type == 'address_utxos' ) {
            resolve(data.payload);
          } else {
            resolve(null);
          }
        });
      } catch {
        reject(null);
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
