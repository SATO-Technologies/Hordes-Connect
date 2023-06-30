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

  open(type, message) {
    return window.open(`${connectUrlBase}?type=${type}&msg=${message}`, '_blank', `toolbar=no,scrollbars=no,resizable=no,top=${this.size.top},left=${this.size.left},width=${this.size.width},height=${this.size.height}}`);
  }

  update(hordesConnectWindow, requestId, type, message, callback) {
    hordesConnectWindow.location.href = `${connectUrlBase}/${requestId}?type=${type}&msg=${message}`;
    window.addEventListener('message', (e) => {
      let origin = e.originalEvent?.origin || e.origin;
      if( origin.includes(connectUrlBase) ) {
        callback(JSON.parse(e.data));
      }
    });
  }

  getAddress({ message = 'Address' } = { }) {
    let hordesConnectWindow = this.open('address', message);
    return new Promise(async (resolve, reject) => {
      try {
        let requestId = await this.createRequest({
          app: this.app,
          type: 'address',
          message: message,
        });
        if( requestId ) {
          this.update(hordesConnectWindow, requestId, 'address', message, (data) => {
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
    let hordesConnectWindow = this.open('sign_transaction', message);
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
          this.update(hordesConnectWindow, requestId, 'sign_transaction', message, (data) => {
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

  mint({ message = 'Inscribe Inscription', address, commitmentPsbt, revealTxData, fee }) {
    let hordesConnectWindow = this.open('mint_inscription', message);
    return new Promise(async (resolve, reject) => {
      try {
        let requestId = await this.createRequest({
          app: this.app,
          type: 'mint_inscription',
          message: message,
          address: address,
          commitmentPsbt: commitmentPsbt,
          revealTxData: revealTxData,
          fee: fee
        });
        if( requestId ) {
          this.update(hordesConnectWindow, requestId, 'mint_inscription', message, (data) => {
            if( data && data.type == 'mint_inscription' ) {
              resolve(data.payload)
            } else {
              reject({ error: 'unable to inscribe inscription' });
            }
          });
        } else {
          reject({ error: 'unable to create request' });
        }
      } catch (e) {
        reject({ error: 'unable to inscribe inscription' });
      }
    });
  }

}

const hordesConnect = new HordesConnect();

window.HordesConnect = hordesConnect;
export default hordesConnect;
