import { Injectable } from '@angular/core';
import { from as fromPromise, Observable} from 'rxjs';
import { KEYUTIL, KJUR, stob64, hextorstr  } from 'jsrsasign';

import * as qz from 'qz-tray';
import { sha256 } from 'js-sha256';
import { Ordine } from './ordini.service';

@Injectable({
  providedIn: 'root'
})
export class PrinterService {
    cfg: any;
  //npm install qz-tray js-sha256 rsvp --save

  constructor(){
    qz.security.setCertificatePromise((resolve, reject) => {
      fetch("assets/certificate.pem", {cache: 'no-store', headers: {'Content-Type': 'text/plain'}})
      .then(data => resolve(data.text()));
    });
    
    qz.security.setSignaturePromise(hash => {
      return (resolve, reject) => {
          var pk = KEYUTIL.getKey(privateKey);
          var sig = new KJUR.crypto.Signature({"alg": "SHA1withRSA"});
          sig.init(pk);
          sig.updateString(hash);
          var hex = sig.sign();
          console.log(privateKey)
          console.log(hash)
          console.log(hex)
          resolve(stob64(hextorstr(hex)));
      };
    });
    
    qz.api.setSha256Type(data => sha256(data));
    qz.api.setPromiseType(resolver => new Promise(resolver));
    
    qz.websocket.connect({host: "172.31.5.25"}).then(console.log("connesso alla stampante"));
 }
  
  
  // Get the SPECIFIC connected printer
  getPrinter(objPrinter: any): Observable<string> {
    
    //Setto la stampante
    var config = this.updadeConfig();
    config.setPrinter(objPrinter);

    return fromPromise(
      qz.websocket.connect(config)
        .then(() => console.log('Connesso alla stampante'))
    )
  }

  updadeConfig(){
      if(this.cfg == undefined || this.cfg == null)
        this.cfg = qz.configs.create(null);

      this.cfg.reconfigure({
          colorType: "color",
          copies: 1,
          interpolation: "default",
          orientation: "default",
          rotation: 0
          })  
      return this.cfg;
  }
  print(objOrdine: Ordine){
    var data = this.setDataToPrint(objOrdine);
    console.log(data)
    var config = qz.configs.create({host: '172.31.5.200',port: '9100'});
    qz.print(config, data).catch((e) => console.log(e));        
  }

/**
 * Dall'oggetto ordine crea l'oggetto data che verra stampato sulla comanda
 * @param objOrdine Oggetto Ordine
 */
  setDataToPrint(objOrdine: any){
  let c = 0;
    let i = 0;
    let ham : boolean = false;
    let fritti : boolean = false;
    let bevande : boolean = false;
    var data: any = [];
    data.push('\n');
    data.push('Hamburger          \n');
    for (c; c < objOrdine.prodotti.length; c++) {
      if(objOrdine.prodotti.tipo == "fritto" && fritti == false){
        data.push('\n');
        data.push('Fritti          \n');
        data.push('\n');
      }
      else if(objOrdine.prodotti.tipo == "bevande" && bevande == false){
        data.push('\n');
        data.push('Bevande          \n');
        data.push('\n');
      }
      else{
        data.push('\n');
        data.push('Panini          \n');
        data.push('\n');
      }

      data.push('' + objOrdine.prodotti[c].nome + '                            ' + objOrdine.prodotti[c].prezzo + '\n');
      if(objOrdine.prodotti[c].opzioni != undefined){
        for (var n= 0; n < objOrdine.prodotti[c].opzioni[n].length; c++) {
          data.push('   ' + objOrdine.prodotti[c].opzioni[n].nome + '                            ' + objOrdine.prodotti[c].opzioni[n].prezzo + '\n');
        }
      }
    }
    return data;
  }

}

const privateKey= '-----BEGIN PRIVATE KEY-----\n' +
'MIIEvwIBADANBgkqhkiG9w0BAQEFAASCBKkwggSlAgEAAoIBAQCuojMxspYpXlbX\n' +
'w3sFeC4RuLmSOr0VIZ+81TyoGmbnmgit3feyhx07Kcpdoc9VJaIkABbYbOsbYJ/A\n' +
'wMKPXnsObpZpyY4VhqqWa+9voS27SMjp7SVWx6DGxwNTygdFeIvAS2cArMp4erjv\n' +
'2PCsHrrX6AzztTluIm/972tYPb5WTJQuoKsYr/BYKaTKyZ77WUEgQS8tLV63po0b\n' +
'6b38snsKbgB/QE3oeWtaT9d2/UO6dVM3A0neb8p3AxyGUBMHBcRQnfvSUB97G1ig\n' +
'xOLEL59JfyHLwySiby/rTL4QwiYUZJJkyrkerFNfW3s4UUB5bw03ER3f+iLZJlkv\n' +
'lJ4I5R29AgMBAAECggEBAIT1V3bqGmvquMHTwlFau/CgLSGJeTaigAT8cQ8n8ts4\n' +
'qoz9573UI0xNOBbrwHh6i6VPMBWdb69LdLYDzN3tOFG3nutyGqyG+FBIY2chVzk1\n' +
'ZEq+VGRq3x0Yno7nzXt2GSjR/91CsXDjNvTdvfe9+dGyilHu04fnzk6PP7JSaB05\n' +
'M6vjY8BIocNNyNmDLfUr5ncY1+zoR2gSg64yPcTAM07MJ9IcXND8HNcZLArVrxUW\n' +
'O49v+QUi3iPC7AZi8uzyrUzEQrKKbtiyms/xpVRi0BSp6snVrtOiPDDqPN7M+yZc\n' +
'mCVJ6nl18KtBAmxOQdw/wVMmo6ll4WA9DPJsP72YBB0CgYEA5fBdAOmuVbyzkOr2\n' +
'GTjenFVMgd6lMPv8x9jGnSp8klpC8HSyIUvXF0gUvNJwJSWmAzLx5aCrSI94xqRq\n' +
'yfYDcng7VpoPt0ts8YlRqyzf7fg7+jY7fDonMA5vjGh85nWAcSyaf0Oez9uUK4+F\n' +
'GD3ny1bCBdETRx8ZrD0pTXldJVMCgYEAwm0pm8S1jFL396uJDMTQcF+wezkyr7WH\n' +
'BHEKc0o5mkcWLuZ1++fT/PKsNO041wwEWAwDMBQGn6iVNU/dSQajGFbtjZwgsWTH\n' +
'w/+N/gARB9Y/JoSpzwNkt1YU8E8eC8zXgYanrVfFCJSIEXxKnARA6g6Gerv37xqz\n' +
'vch13L/Hvq8CgYEA1jFO4X/NB07t0qwdLaedLvICf+Pf676AXcWgVl1yh36PZqC+\n' +
'ImgcaDKcJry8/M2SVN6LGUXO6JvFfP1CAPorgeFgHS8MPsmDJYiuTA9UVb/sVwtX\n' +
'5EPjp097N8dJugBw8nwDO1PJR4UbBG0AJXHdT7x0pqh5FcJxztF2fRX138MCgYBk\n' +
'JhLOt+7ET2CHZQZ9W0v69m9TqczgEWNw+EFnzY4KWB+nHPMdRPc/TklCIgerTfdW\n' +
'2ykxNL+MsivZgD/+A7szKGPJE+kLN1xnK1YaxjH/lW6GCsPlbFwOy/qRJk/VyDgh\n' +
'8hihA5rspoXIa/uKje5aIg1HX1eBBIIdegqsIOVk5QKBgQCCxvj7Y/M5wacEQbhz\n' +
'FmxTr0XyBfqymfdnkKNN8dLv2C0PYe8D6JmB+Zp2g+0eEHF76YRQGI75uf+Eqt9e\n' +
'ZqO+SPxCzJRDPeO/1Rw/Ech9rsQr+Flo9zWMuP7KKqJCbSSaVokfd3pbjHHzbbcr\n' +
'w2V35r3FT0dfle8iL+2Qhf//yA==\n' +
'-----END PRIVATE KEY-----';


