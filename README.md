# HORDES CONNECT

1. npm.
    ```javascript
    npm install hordesconnect
    ```

2. cdn.
    ```html
    <script src='https://cdn.jsdelivr.net/npm/hordesconnect@latest/dist/bundle.min.js'></script>
    ```

## Implementation
1. import.
    ```javascript
    import HordesConnect from 'hordesconnect';
    ```
    
2. initialize.
    ```javascript
    HordesConnect.initialize({ app: 'Ordinals Test App' });
    ```

3. wallet connection.
    ```javascript
    const connected = await HordesConnect.connect();
    ```

4. methods.
    ```javascript
    /* get address */
    let address = HordesConnect.getAddress();
    
    /* get utxos */
    let funds = HordesConnect.getUtxos({ key: 'funds' }); // funds - dummies
    
    /* sign transaction */
    let signTransactionRes = await HordesConnect.signTransaction({ message: 'Sign Transaction', base64Psbt: base64Psbt, broadcast: false });
    if( signTransactionRes.error ) {
      throw new Error(signTransactionRes.error);
    } else {
      // broadcast == true ? signTransactionRes.txid : signTransactionRes.signedPsbt
    }
    ```
    
# Download HORDES WALLET for iOS & Android

![https://bysato.com/hordesQR.png](https://bysato.com/hordesQR.png)


### iOS (Apple TestFlight)

To download the app on your iOS device, please follow the link below to access it on Apple TestFlight:

[iOS TestFlight Download](<https://testflight.apple.com/join/YSPV8MQn>)

### Android (Open Testing)

For Android users, you can download the app by following the link below:

[Android Download](https://play.google.com/store/apps/details?id=com.sato.hordes)

## Upcoming Documentation

Thank you for visiting our GitHub repository! We are currently working on providing comprehensive documentation to help you better understand and work with our project. The documentation will be available soon, so please stay tuned for updates.

In the meantime, if you have a website or app working with ordinals and are interested in joining our program, we would love to hear from you! Please fill out the form linked below, and a member of our team will get in touch with you as soon as possible.

[**Join the Program - Contact Form**](<https://forms.gle/GNAPX19U9PJuKCRJ8>)

We appreciate your patience and look forward to collaborating with you!

## Contributing

We welcome contributions to the project. If you have any questions or suggestions, feel free to open an issue or submit a pull request. We are excited to work with you and build a better project together.

## License

This project is licensed under the [MIT License](LICENSE).
