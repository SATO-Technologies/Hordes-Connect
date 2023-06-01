/* contants */
const connectUrlBase = 'https://hordesconnect.bysato.com';
const apiUrlBase = 'https://api.bysato.com/hordesconnect';

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
  async createRequest(params) {
    try {
      let response = await fetch(`${apiUrlBase}/request.php`, {
        method: 'POST',
        body: JSON.stringify(params),
        headers: {
          'Content-Type': 'application/json'
        }
      });
      response = await response.json();
      if( response && response.requestId ) {
        return response.requestId;
      }
      return null;
    } catch {
      return null;
    }
  }

  open(requestId, callback) {
    let hordesConnectWindow = window.open(`${connectUrlBase}/${requestId}`, '_blank', `toolbar=no,scrollbars=no,resizable=no,top=${this.size.top},left=${this.size.left},width=${this.size.width},height=${this.size.height}}`);
    window.addEventListener('message', (e) => {
      let origin = e.originalEvent?.origin || e.origin;
      if( origin.includes(connectUrlBase) ) {
        callback(JSON.parse(e.data));
      }
    });
  }

  getAddress({ message = 'Address' } = { }) {
    return new Promise(async (resolve, reject) => {
      try {
        let requestId = await this.createRequest({
          app: this.app,
          type: 'address',
          message: message,
        });
        if( requestId ) {
          this.open(requestId, (data) => {
            if( data && data.type == 'address' ) {
              resolve(data.payload);
            } else {
              reject({ error: 'unable to get address' });
            }
          });
        } else {
          reject({ error: 'unable to create request' });
        }
      } catch (e) {
        reject({ error: 'unable to get address' });
      }
    });
  }

  signTransaction({ message = 'Sign Transaction', base64Psbt = null, broadcast = false }) {
    return new Promise(async (resolve, reject) => {
      try {
        let requestId = await this.createRequest({
          app: this.app,
          type: 'sign_transaction',
          message: message,
          base64Psbt: base64Psbt,
          broadcast: broadcast
        });
        if( requestId ) {
          this.open(requestId, (data) => {
            if( data && data.type == 'sign_transaction' ) {
              resolve(data.payload)
            } else {
              reject({ error: 'unable to sign transaction' });
            }
          });
        } else {
          reject({ error: 'unable to create request' });
        }
      } catch {
        reject({ error: 'unable to sign transaction' });
      }
    });
  }

  mint({ message = 'Mint Inscription', commitmentPsbt, revealTxData, fee }) {
    return new Promise(async (resolve, reject) => {
      try {
        let requestId = await this.createRequest({
          app: this.app,
          type: 'mint_inscription',
          message: message,
          commitmentPsbt: commitmentPsbt,
          revealTxData: revealTxData,
          fee: fee
        });
        if( requestId ) {
          this.open(requestId, (data) => {
            if( data && data.type == 'mint_inscription' ) {
              resolve(data.payload)
            } else {
              reject({ error: 'unable to mint inscription' });
            }
          });
        } else {
          reject({ error: 'unable to create request' });
        }
      } catch (e) {
        reject({ error: 'unable to mint inscription' });
      }
    });
  }

}

const hordesConnect = new HordesConnect();

window.HordesConnect = hordesConnect;
export default hordesConnect;
