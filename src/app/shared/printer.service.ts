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
      fetch("assets/cert.pem", {cache: 'no-store', headers: {'Content-Type': 'text/plain'}})      
      .then(data => resolve(data.text()));
    });

    qz.security.setSignaturePromise(hash => {
      try {
          return (resolve, reject) => {
            var pk = KEYUTIL.getKey(key);
            var sig = new KJUR.crypto.Signature({"alg": "SHA1withRSA"});
            sig.init(pk);
            sig.updateString(hash);
            var hex = sig.sign();
            console.log(key)
            console.log(hash)
            console.log(hex)
            resolve(stob64(hextorstr(hex))); 
      };
      } 
      catch (error) {
        console.log(error)
      }
      
    });
    qz.api.setSha256Type(data => sha256(data));
    qz.api.setPromiseType(resolver => new Promise(resolver));
    
    qz.websocket.connect({host: "172.31.5.25"}).then(console.log("connesso alla stampante")); //13
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
    var res = false;
    try {
      var config = qz.configs.create({host: '172.31.5.200',port: '9100'});
      var data = this.setDataToPrint(objOrdine);
      qz.print(config, data).catch((e) => console.log(e));
      res = true;
    } 
    catch (error) {
      console.log(error)
    }
  return res;
  }

/**
 * Dall'oggetto ordine crea l'oggetto data che verra stampato sulla comanda
 * @param objOrdine Oggetto Ordine
 */
  setDataToPrint(objOrdine: any){
    let c = 0;
    var data: any = [];
    console.log(objOrdine)
    if(objOrdine.nomeCliente != undefined || objOrdine.nomeCliente != ''){
      if(objOrdine.consegnaDomicilio == true)
        data.push('Cliente: ' + objOrdine.nomeCliente + '                    CONSEGNA'); 
      else if(objOrdine.asporto == true)
        data.push(objOrdine.nomeCliente + '                    ASPORTO');
      else if(objOrdine.nomeCliente != undefined || objOrdine.nomeCliente != '')
        data.push('                     EAT IN');
      else
        data.push(objOrdine.nomeCliente + '                    EAT IN');
    }
    data.push('\n');
    data.push('\n');
    //SE DEVE ESSERE CONSEGNARE AGGIUNGO ALTRE INFORMAZIONI SUL CLIENTE
    if(objOrdine.consegnaDomicilio == true){
      data.push('Indirizzo: ' + objOrdine.indirizzo + '\n');
      if(objOrdine.citofono != undefined || objOrdine.citofono != '')
        data.push('Citofono: ' + objOrdine.citofono + '\n');
      data.push('Telefono: ' + objOrdine.numeroTelefono.toString() + '\n');
      data.push('Orario: ' + objOrdine.orario.toString() + '\n');
      (objOrdine.note != "" || objOrdine.note != undefined) ? data.push('NOTE: ' +objOrdine.note + '\n') : data.push('\n');
    }
    data.push('\n');
    for (c; c < objOrdine.prodotti.length; c++) {
      //CONTROLLOSE I PRODOTTO HANNO QUANTITA MAGGIORE DI 1 E STAMPO IN BASE A QUELLO
      if(objOrdine.prodotti[c].tipo == "fritto" && objOrdine.prodotti[c].quantita > 1 ||
            objOrdine.prodotti[c].tipo == "bevanda" && objOrdine.prodotti[c].quantita > 1)
        data.push(objOrdine.prodotti[c].quantita + 'x ' + objOrdine.prodotti[c].nome + this.addBlankSpace(objOrdine.prodotti[c].nome.length, 'piuQuantita') + objOrdine.prodotti[c].prezzoBase + 'E\n');
      else if(objOrdine.prodotti[c].tipo ==  "OPMenu")
        data.push('' + objOrdine.prodotti[c].nome + this.addBlankSpace(objOrdine.prodotti[c].nome.length, 'prodotto') + ' \n');
      else
        data.push('' + objOrdine.prodotti[c].nome + this.addBlankSpace(objOrdine.prodotti[c].nome.length, 'prodotto') + objOrdine.prodotti[c].prezzoBase + ' E \n');

      if(objOrdine.prodotti[c].opzioni != undefined){
        for (var n= 0; n < objOrdine.prodotti[c].opzioni.length; n++) {
          //CONTROLLO CHE IL NOME E IL PREZZO DEI PRODOTTI SELEZIONATI SIA DIVERSO DA UNDEFINED
          if(objOrdine.prodotti[c].opzioni[n].tipo == "ingrediente-extra"){
            if(objOrdine.prodotti[c].opzioni[n].valueQuantita == "P" && objOrdine.prodotti[c].opzioni[n].quantita == 1)
              data.push('    +' + objOrdine.prodotti[c].opzioni[n].nomeOpzione + this.addBlankSpace(objOrdine.prodotti[c].opzioni[n].nomeOpzione.length, 'ingredientiExtra') + objOrdine.prodotti[c].opzioni[n].prezzo + ' E\n');
            else if(objOrdine.prodotti[c].opzioni[n].valueQuantita == "N" && objOrdine.prodotti[c].opzioni[n].quantita == 1)
              data.push('    -' + objOrdine.prodotti[c].opzioni[n].nomeOpzione + this.addBlankSpace(objOrdine.prodotti[c].opzioni[n].nomeOpzione.length, 'ingredientiExtra') + '\n');
            else if(objOrdine.prodotti[c].opzioni[n].valueQuantita == "P" && objOrdine.prodotti[c].opzioni[n].quantita > 1)
              data.push('    +' + objOrdine.prodotti[c].opzioni[n].quantita + 'x ' + objOrdine.prodotti[c].opzioni[n].nomeOpzione + this.addBlankSpace(objOrdine.prodotti[c].opzioni[n].nomeOpzione.length, 'ingredientiExtraPiuQuantita') + objOrdine.prodotti[c].opzioni[n].prezzo + ' E\n');
            else if(objOrdine.prodotti[c].opzioni[n].valueQuantita == "N" && objOrdine.prodotti[c].opzioni[n].quantita > 1)
              data.push('    -' + objOrdine.prodotti[c].opzioni[n].quantita + 'x ' + objOrdine.prodotti[c].opzioni[n].nomeOpzione + this.addBlankSpace(objOrdine.prodotti[c].opzioni[n].nomeOpzione.length, 'ingredientiExtraPiuQuantita') +'\n');
          }
          else if(objOrdine.prodotti[c].opzioni[n].nomeOpzione == "Tipo Cottura" && objOrdine.prodotti[c].opzioni[n].opzioneSelezionata != "")
            data.push('    Cottura: ' + objOrdine.prodotti[c].opzioni[n].opzioneSelezionata + this.addBlankSpace((objOrdine.prodotti[c].opzioni[n].opzioneSelezionata.length + 9), 'opzione') + '\n');
          else if(objOrdine.prodotti[c].opzioni[n].nomeOpzione == "Opzione" && objOrdine.prodotti[c].opzioni[n].opzioneSelezionata == "Doppio Hamburger")
            data.push('    ' + objOrdine.prodotti[c].opzioni[n].opzioneSelezionata + this.addBlankSpace(objOrdine.prodotti[c].opzioni[n].opzioneSelezionata.length, 'opzione') + objOrdine.prodotti[c].opzioni[n].prezzo + ' E\n');
        }
      }
      data.push('\n');
      data.push('\n');
    }
    if(objOrdine.consegnaDomicilio == true)
    data.push('CONSEGNA DOMICILIO' + this.addBlankSpace(18, "prodotto") + '3 E\n');
    data.push('TOTALE EURO' + this.addBlankSpace(11, "prodotto") + objOrdine.totale + 'E\n');
    data.push('\n');

    return data;
  }

  /**
   * Calcolo lo spazio tra il nome e il prezzo dei prodotti in base al numbero dei carattero.
   * su una riga della comanda il limite max dei caratteri è 48
   * @param firststringLenght Lunghezza del nome prodotto
   * @param richiestaDa da chi viene richiesto
   */
  addBlankSpace(firststringLenght: number, richiestoDa: string){
    var spacenumber;
    if(richiestoDa == 'prodotto')
      spacenumber = 36 - firststringLenght;
    else if( richiestoDa == "piuQuantita")
      spacenumber = 33 - firststringLenght;
    else if( richiestoDa == "ingredientiExtra")
      spacenumber = 27 - firststringLenght;
    else if( richiestoDa == "ingredientiExtraPiuQuantita")
      spacenumber = 24 - firststringLenght;
    else
      spacenumber = 28 - firststringLenght;

    var space = "";
    for (let i = 0; i <= spacenumber; i++) {
      space += " ";      
    }
    return space;
  }

}

const key = '-----BEGIN PRIVATE KEY-----\n' +
'MIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQCxthkhc0fWyRSd\n' +
'OfyvaRiWVEF2887GdCkXXOHNpSP1+M18OyB2zdE5DkGlUHRzwPIkcv1HUtkXCcBX\n' +
'1SRWZD54TfATsCB6XdjFvJ1fvRr+Nmk6kLtyAqFGAh58fvYuNXxeUhQcU3ecfR6W\n' +
'no3gKOhQUbhPoVRHK7Nhnl6P/LDtLUtldd61Im0i942jgA58NNrW3UF6YF+ytTcL\n' +
'uQGoV1DAYwwL3e/kio1oMynmuEQuogA7H/SQ2Yhh7OMhG2IAwoETBZIwe8my8oNV\n' +
'pnhL/xTfylLZHRMXXuVB0NM+wCnpY5vbm1qP6qlwZvCBJ0hIlCebQFESgWqwgAS7\n' +
'b9eNypn7AgMBAAECggEAYuEQcJVFJpQxnR3zo+IVJSfyWO5lYfSmHHK4zQSS0rzC\n' +
'ENqRQKlaPaXaDtKKSRHVaUR1+uZ1FiV92SEmG8+hFq0+5KV+HLf08mj1I50D1OiP\n' +
'el+nfFNMSrjJH7pA3gsyjQScXfpvNipEB8hm5o+8W1xs8hmw2/zLzYgh03nlM8Gv\n' +
'sfaOZQLabcF/Br9B2N4nju05oAQvYhWq/ZZyBXVw7BOzaIe+puiPoVNpOD845peS\n' +
'99HLJpD54zVmvKtWNuN5q+zbMs90ElLpkzSdZNw5Igu9x+CO+A0Swp+aMJzMUqML\n' +
'x7i5+GUZKgxC32h8v8nJuKm9fCuPEve3I6h0/4XmwQKBgQDWrVghxslpX2U/diyR\n' +
'739bW/jnhx2ks0FBJ4D06uiuglBEMLrQbcXQvia5ZRhGZaYjorr55XP965DdpP3T\n' +
'NGSAG2cZgSSgG3ZcF1t2d392gSfA40r+ZE5iNDsI6TOXTECUb7/JIWbTCvaKasqB\n' +
'DQSsX581MuxMwZljKTzbWiG64QKBgQDT6zAi1B/qGZmzDUo3I0Tk8FE2m5HedMcu\n' +
'H5LZBWjN21VqSwjme0YtBuvsjYAcTBR8RbA9B/eXOWRa5Rdoojf9wZClt1/Rye1H\n' +
'/ij3x87qGN+4JaQ0E5aN6KXpHDhpiMLN1ZiKCAQnKk9cdvQ4zNvKNaiiPO7O6FTN\n' +
'UBHNT/6sWwKBgFSalDUbhp0Ef353MDGDVYnHwVxdn40dKAZpbyUWvwSnTsLRAY7K\n' +
'9D7D8bb25I452TQKGe4KQ6A6iikPsQjfiQwDwKoIf0qqCAdbHSyfA5jMZcJa0V9Y\n' +
'YJvLQcjNPwvNfVYChG7bvw5FL8x1McGSQ9k7Bh+NJhtJ4Q13XwiDiO+BAoGAaguH\n' +
'0/XoXoIfCp185OiOQi4LxdLFhNdVELyWBGmTj2fRb1ZLBuLrM/8BsicA06gynBlX\n' +
'XsMM36zFjkKTmzWJ5T6mfnaryVRNm7gQkiV3Yme+E+0qJTEkJrEjzOnlRNI+ATiA\n' +
'k5n9Ugf3HKMeBQpmdeKyFzV8nyddwDvwHJiKLX8CgYAj8gr+W7e/sMB1hsEdGHif\n' +
'Bh7iu7sYMXT0CEUG9TMwz4qAjuhxSoc1wS0T7tdcKioQ2narPkArygAtDEfVeHBQ\n' +
'rlyKz7xcNEP7hGOiKY4zpa7NL5ZuLGx+QllzMeFkfXb9BKoXr///3x++HFLg+R6D\n' +
'CXZ1N6zQc1WOu4FdUUsG6Q==\n' +
'-----END PRIVATE KEY-----';