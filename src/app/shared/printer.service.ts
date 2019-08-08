import { Injectable } from '@angular/core';
import { from as fromPromise, Observable} from 'rxjs';
import { KEYUTIL, KJUR, stob64, hextorstr  } from 'jsrsasign';

import * as qz from 'qz-tray';
import { sha256 } from 'js-sha256';
import { Ordine } from './ordini.service';
import { environment } from '../../environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class PrinterService {
    cfg: any;
  //npm install qz-tray js-sha256 rsvp --save

 constructor(){
    qz.security.setCertificatePromise((resolve, reject) => {    
      resolve(cert);
    });
    qz.security.setSignaturePromise(hash => {
      return (resolve, reject) => {
          var pk = KEYUTIL.getKey(key);
          var sig = new KJUR.crypto.Signature({"alg": "SHA1withRSA"});
          sig.init(pk);
          sig.updateString(hash);
          var hex = sig.sign();
          resolve(stob64(hextorstr(hex)));
       };
     });
    qz.api.setSha256Type(data => sha256(data));
    qz.api.setPromiseType(resolver => new Promise(resolver));    
    qz.websocket.connect({host: environment.webServerIp}); //13:macchina Ivan -- 187: webserver
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
    var config = qz.configs.create({host: environment.stampanteIp,port: environment.stampantePort});
    var data = this.setDataToPrint(objOrdine);
    qz.print(config, data).catch((e) => console.log(e));
    res = true;
  } 
    catch (error) {
      console.error(error)
    }
  return res;
}

/**
 * Dall'oggetto ordine crea l'oggetto data che verra stampato sulla comanda
 * @param objOrdine Oggetto Ordine
 */
setDataToPrint(objOrdine: any){
  let fritto: boolean = false;
  let bibita: boolean = false;
  let totaleBibite: number = 0;
  let c = 0;
  var data: any = [];
  
  if(objOrdine.nomeCliente != undefined || objOrdine.nomeCliente != ""){
    if(objOrdine.consegnaDomicilio == true)
      data.push('Cliente: ' + objOrdine.nomeCliente + '                    CONSEGNA\n'); 
    else if(objOrdine.asporto == true){
      data.push(objOrdine.nomeCliente + '                    ASPORTO\n');
      data.push('Orario Consegna: ' + objOrdine.orario.toString() + '\n');
    }
    else if(objOrdine.nomeCliente != undefined || objOrdine.nomeCliente != ""){
      data.push(objOrdine.nomeCliente + '                    EAT IN \n');
      data.push('Orario Consegna: ' + objOrdine.orario.toString() + '\n');
    }
    (objOrdine.note != "" || objOrdine.note != undefined) ? data.push('NOTE: ' +objOrdine.note + '\n') : data.push('\n');
  }
  else{
      data.push(objOrdine.nomeCliente + '                    EAT IN\n'); 
      (objOrdine.note != "" || objOrdine.note != undefined) ? data.push('NOTE: ' +objOrdine.note + '\n') : data.push('\n');     
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
    //controllo se è di tipo fritto o bevande e se ha la quantita > 1
    if(objOrdine.prodotti[c].tipo == "fritto" && objOrdine.prodotti[c].quantita > 1 
      || objOrdine.prodotti[c].tipo == "bevanda" && objOrdine.prodotti[c].quantita > 1){
      data.push(objOrdine.prodotti[c].quantita + 'x ' + objOrdine.prodotti[c].nome + this.addBlankSpace(objOrdine.prodotti[c].nome.length, 'piuQuantita') + 
      ((objOrdine.prodotti[c].prezzo % 1 == 0) ? (objOrdine.prodotti[c].prezzo + ',00') : (objOrdine.prodotti[c].prezzo + '0'))  + ' \n');
    }
    //controllo se è di tipo menu 
    else if(objOrdine.prodotti[c].isMenu){
      data.push(objOrdine.prodotti[c].nome + ' - menu' + this.addBlankSpace((objOrdine.prodotti[c].nome.length + 6), 'prodotto') + 
      ((objOrdine.prodotti[c].prezzo % 1 == 0) ? (objOrdine.prodotti[c].prezzo + ',00') : (objOrdine.prodotti[c].prezzo + '0'))  + ' \n');
    }
    //controllo se sono le opzioni menu di un prodotto
    else if(objOrdine.prodotti[c].tipo ==  "OPMenu" && objOrdine.prodotti[c].quantita > 1)
      data.push(objOrdine.prodotti[c].quantita + 'x ' + objOrdine.prodotti[c].nome + this.addBlankSpace(objOrdine.prodotti[c].nome.length, 'piuQuantita') + ' \n');
    else{
      if(objOrdine.prodotti[c].tipo ==  "OPMenu")
        data.push('' + objOrdine.prodotti[c].nome + this.addBlankSpace(objOrdine.prodotti[c].nome.length, 'prodotto') + '\n');
      else{
        data.push('' + objOrdine.prodotti[c].nome + this.addBlankSpace(objOrdine.prodotti[c].nome.length, 'prodotto')  + 
        ((objOrdine.prodotti[c].prezzoBase % 1 == 0) ? (objOrdine.prodotti[c].prezzoBase + ',00') : (objOrdine.prodotti[c].prezzoBase + '0'))  + ' \n');
      }
    }

    if(objOrdine.prodotti[c].opzioni != undefined){
      for (var n= 0; n < objOrdine.prodotti[c].opzioni.length; n++) {
        //CONTROLLO CHE IL NOME E IL PREZZO DEI PRODOTTI SELEZIONATI SIA DIVERSO DA UNDEFINED
        if(objOrdine.prodotti[c].opzioni[n].tipo == "ingrediente-extra"){
          if(objOrdine.prodotti[c].opzioni[n].valueQuantita == "P" && objOrdine.prodotti[c].opzioni[n].quantita == 1){
            data.push('    +' + objOrdine.prodotti[c].opzioni[n].nomeOpzione + this.addBlankSpace(objOrdine.prodotti[c].opzioni[n].nomeOpzione.length, 'ingredientiExtra') +  
            ((objOrdine.prodotti[c].opzioni[n].prezzo % 1 == 0) ? (objOrdine.prodotti[c].opzioni[n].prezzo + ',00') : (objOrdine.prodotti[c].opzioni[n].prezzo + '0'))  + ' \n');
          }
          else if(objOrdine.prodotti[c].opzioni[n].valueQuantita == "N" && objOrdine.prodotti[c].opzioni[n].quantita == 1){
            data.push('    ---' + objOrdine.prodotti[c].opzioni[n].nomeOpzione + this.addBlankSpace(objOrdine.prodotti[c].opzioni[n].nomeOpzione.length, 'ingredientiExtra') + '\n');
          }
          else if(objOrdine.prodotti[c].opzioni[n].valueQuantita == "P" && objOrdine.prodotti[c].opzioni[n].quantita > 1){
            data.push('    +' + objOrdine.prodotti[c].opzioni[n].quantita + 'x ' + objOrdine.prodotti[c].opzioni[n].nomeOpzione + this.addBlankSpace(objOrdine.prodotti[c].opzioni[n].nomeOpzione.length, 'ingredientiExtraPiuQuantita') +  
            ((objOrdine.prodotti[c].opzioni[n].prezzo % 1 == 0) ? (objOrdine.prodotti[c].opzioni[n].prezzo + ',00') : (objOrdine.prodotti[c].opzioni[n].prezzo + '0'))  + ' \n');
          }
          else if(objOrdine.prodotti[c].opzioni[n].valueQuantita == "N" && objOrdine.prodotti[c].opzioni[n].quantita > 1){
            data.push('    ---' + objOrdine.prodotti[c].opzioni[n].quantita + 'x ' + objOrdine.prodotti[c].opzioni[n].nomeOpzione + this.addBlankSpace(objOrdine.prodotti[c].opzioni[n].nomeOpzione.length, 'ingredientiExtraPiuQuantita') +'\n');
          }
        }
        else if(objOrdine.prodotti[c].opzioni[n].nomeOpzione == "Tipo Cottura" && objOrdine.prodotti[c].opzioni[n].opzioneSelezionata != "")
          data.push('    Cottura: ' + objOrdine.prodotti[c].opzioni[n].opzioneSelezionata + this.addBlankSpace((objOrdine.prodotti[c].opzioni[n].opzioneSelezionata.length + 9), 'opzione') + '\n');
        else if(objOrdine.prodotti[c].opzioni[n].nomeOpzione == "Opzione" && objOrdine.prodotti[c].opzioni[n].opzioneSelezionata == "Doppio Hamburger")
          data.push('    ' + objOrdine.prodotti[c].opzioni[n].opzioneSelezionata + this.addBlankSpace(objOrdine.prodotti[c].opzioni[n].opzioneSelezionata.length, 'opzione') +   
          ((objOrdine.prodotti[c].opzioni[n].prezzo % 1 == 0) ? (objOrdine.prodotti[c].opzioni[n].prezzo + ',00') : (objOrdine.prodotti[c].opzioni[n].prezzo + '0'))  + ' \n');
      }
    }
    data.push('\n');

    /* CONTROLLO DELL'ULTIMO PRODOTTO E INSERIMENTO DEL DIVISORE DI SEZIONE*/
    if(objOrdine.prodotti[c + 1] != undefined){

      if(fritto == false && objOrdine.prodotti[c + 1].tipo == "fritto"){
        data.push('---------------------------------------------    \n');
        data.push('---------------------------------------------    \n');
        if(objOrdine.nomeCliente != ''){
            data.push(objOrdine.nomeCliente + this.addBlankSpace(20, "prodotto") +'\n');
            data.push('Orario Consegna: ' + objOrdine.orario.toString() + '\n');
        }
        data.push('---------------------------------------------    \n');
        fritto = true;
      }
      else if(bibita == false && objOrdine.prodotti[c + 1].tipo == "bevanda"){
        data.push('---------------------------------------------    \n');
        bibita = true;
      }
      else if(fritto == false && objOrdine.prodotti[c + 1].tipo == "OPMenu" ){
        data.push('---------------------------------------------    \n');
        if(objOrdine.nomeCliente != ''){
            data.push(objOrdine.nomeCliente + this.addBlankSpace(20, "prodotto") +'\n');
            data.push('Orario Consegna: ' + objOrdine.orario.toString() + '\n');
        }
        data.push('---------------------------------------------    \n');
        fritto = true;
      }
      else if(bibita == false && objOrdine.prodotti[c + 1].tipo == "OPMenu" ){
        data.push('---------------------------------------------    \n');
        bibita = true;
      }
    }
    else
      data.push('---------------------------------------------    \n');
  }

    if(objOrdine.consegnaDomicilio == true){
        data.push('CONSEGNA DOMICILIO' + this.addBlankSpace(18, "prodotto") + objOrdine.prezzoConsegna + '  \n');
    }

    //funzione che rivaca il totale delle bibite
    totaleBibite = calcolaTotaleBibite(objOrdine);

    if(totaleBibite != 0){
      data.push('TOTALE BIBITE' + this.addBlankSpace(13, "prodotto") + ((totaleBibite % 1 == 0) ? (totaleBibite + ',00') : (totaleBibite + '0')) + '\n');
      let tot = objOrdine.totale - totaleBibite;
      data.push('TOTALE PANINI' + this.addBlankSpace(13, "prodotto") + ((tot % 1 == 0) ? (tot + ',00') : (tot + '0'))  + ' \n');
    }
    else
      data.push('TOTALE EURO' + this.addBlankSpace(11, "prodotto") + 
      ((objOrdine.totale % 1 == 0) ? (objOrdine.totale + ',00') : (objOrdine.totale + '0')) + '\n');
      let date = new Date();
      data.push('ORA: ' + date.toString().substring(16, 24) + '\n');
    data.push('\n');
    data.push('\n');
    data.push('\n');
    data.push('\n');
    data.push('\n');
    data.push('\n');
    data.push('\n');
    data.push('\n');
    data.push('\n');
    data.push('\n');
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
  else if( richiestoDa == "nome")
  spacenumber = 46 - firststringLenght;
  else
    spacenumber = 28 - firststringLenght;

  var space = "";
  for (let i = 0; i <= spacenumber; i++) {
    space += " ";      
  }
  return space;
}

}

/**
 * SALVO A PARTE IL PREZZO DELLE BIBITE PER POI SOTTRARLO DAL TOTALE E STAMPARLO -> A RICHIESTA DELLA FRANCESCA
 * @param objOrdine oggetto ordine
 */
function calcolaTotaleBibite(objOrdine: Ordine){
  var tot = 0;
  for (let i = 0; i < objOrdine.prodotti.length; i++) {
    if(objOrdine.prodotti[i].tipo == "bevanda" && objOrdine.prodotti[i].quantita > 1)
      tot += objOrdine.prodotti[i].prezzoBase * objOrdine.prodotti[i].quantita;
    else if(objOrdine.prodotti[i].tipo == "bevanda")
      tot += objOrdine.prodotti[i].prezzoBase; 
  }
  return tot;
}

const cert = "-----BEGIN CERTIFICATE-----\n" +
"MIIEBTCCAu2gAwIBAgIURHCB/iDsPbjNEd4L49S1bbctQqYwDQYJKoZIhvcNAQEL\n" +
"BQAwgZAxCzAJBgNVBAYTAklUMQ8wDQYDVQQIDAZNaWxhbm8xDjAMBgNVBAcMBUFy\n" +
"ZXNlMRQwEgYDVQQKDAtidXJnZXIydHJpcDEUMBIGA1UECwwLYnVyZ2VyMnRyaXAx\n" +
"FDASBgNVBAMMC2J1cmdlcjJ0cmlwMR4wHAYJKoZIhvcNAQkBFg9zZGdAc2RnaXRh\n" +
"bHkuaXQwIBcNMTkwNjAzMTUyMjQxWhgPMjA1MDExMjYxNTIyNDFaMIGQMQswCQYD\n" +
"VQQGEwJJVDEPMA0GA1UECAwGTWlsYW5vMQ4wDAYDVQQHDAVBcmVzZTEUMBIGA1UE\n" +
"CgwLYnVyZ2VyMnRyaXAxFDASBgNVBAsMC2J1cmdlcjJ0cmlwMRQwEgYDVQQDDAti\n" +
"dXJnZXIydHJpcDEeMBwGCSqGSIb3DQEJARYPc2RnQHNkZ2l0YWx5Lml0MIIBIjAN\n" +
"BgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAwHOIr4EydMbW1HHVyY2I+3VIj9jx\n" +
"Ua98vvqU7UMPkqeLfd5JnelHSibO32Ff5PHpd9cTAMbFEGcAC8deErCjLrGT0gB8\n" +
"t2QXIKmiyIGae0ATdHReqk8FQuIO/HD948Yl8fnL8CEUVMAXRju3vTygpMlyAtyn\n" +
"gLu+1us2VBqSK1QAP9IAIkUqQdmQTR5BI6feH9XbCINcrK8E/t5wQbeEjRXHD+40\n" +
"OCkEra2pOfJMBrGgCC5qt7Mo0TeotJwviJkHAcsTAWze8/0pTi4LtD8W+XhJEt6A\n" +
"AcJY0ZLMby3aLEDwFvHynaYsengTDPaQRJnPbhHSsh5ZuBKGLTj2XiXqawIDAQAB\n" +
"o1MwUTAdBgNVHQ4EFgQUguVn+9fga/czlDufH9A4Pc5PV80wHwYDVR0jBBgwFoAU\n" +
"guVn+9fga/czlDufH9A4Pc5PV80wDwYDVR0TAQH/BAUwAwEB/zANBgkqhkiG9w0B\n" +
"AQsFAAOCAQEAun1EQUm/zN+4v3QoIq0MqSKMAZW43K9+hkc+V9oHbCV0zvG3SpDh\n" +
"moCULYnhxHt7KLZp0omiFCYUrETNJZgdAwUXn62OOfqbPKCi9PfixzRqg4N3Ra4H\n" +
"7sZJE/S/mPf3MWpO9CMSD1S+gibv71EQQugcFYvzFGkc71F9YSpu5v8VvUShmkTF\n" +
"dXUVLjnTdbrO7pewGhDMz+QkiIuAgzO4HWfR+qMR4aJ/H7auA054b6knUZYhPu2o\n" +
"oJtVUNWhV/EEqiXjKGhyAa4RbxqfBaR6VGv3aeQKYUulGStKpZc/qXa3uQ0hDnGH\n" +
"uLxtFyMB/DbwHhqVHtWCA6IHP4ZpiOkkpA==\n" +
"-----END CERTIFICATE-----";

const key = "-----BEGIN PRIVATE KEY-----\n" +
"MIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQDAc4ivgTJ0xtbU\n" +
"cdXJjYj7dUiP2PFRr3y++pTtQw+Sp4t93kmd6UdKJs7fYV/k8el31xMAxsUQZwAL\n" +
"x14SsKMusZPSAHy3ZBcgqaLIgZp7QBN0dF6qTwVC4g78cP3jxiXx+cvwIRRUwBdG\n" +
"O7e9PKCkyXIC3KeAu77W6zZUGpIrVAA/0gAiRSpB2ZBNHkEjp94f1dsIg1ysrwT+\n" +
"3nBBt4SNFccP7jQ4KQStrak58kwGsaAILmq3syjRN6i0nC+ImQcByxMBbN7z/SlO\n" +
"Lgu0Pxb5eEkS3oABwljRksxvLdosQPAW8fKdpix6eBMM9pBEmc9uEdKyHlm4EoYt\n" +
"OPZeJeprAgMBAAECggEAQlVQLpYMix2iHJWkB5WmOm4Bdbtj6jDfgYAjZugvbPAc\n" +
"72R34VrvvIpF0c7hW6taOnlCTok0kWO/K1Arh6ukg0qn1cFfO2Lfad2ugwfQ9Fxw\n" +
"mDooCvGzsYrzeWWEzUaV+6KK/ZiZRmDzZLzepvZHtKTOjFf70C5mJ/PoxPJnoVD4\n" +
"rRvvU1rXEgYG2MJj1+/KQoKoPVOktIu4wlKuika3A9dL/YcdLjWD4lW/AaI6WiQ4\n" +
"3ixearO93mRXBCchWSulTVbqOmsPMN4TEAs69+FFc1js1acEtlrmjtVcr5LbAkg9\n" +
"X9ODUa/Quvj7MIcopZ3AtCg1I1XjwAoSCdZLfJJO8QKBgQDl+xkVFnWsgJa3oqIc\n" +
"UnHDpWAVZqmzVIfSH1ae78lS+Ib3aOZXtsRTDxdJf+ftxYoWoKl/EtBpbeyLuf/y\n" +
"x2MM58qmWfl2jjPT7uVR5C5HyJxdQpAxeGck374ywFGqxxCadiKIk1usk1NlsZT9\n" +
"UCReiKLvS49I4j709Pd9I34kWQKBgQDWOXkeu4DbwIAuhtzgAt16P+0iKntKqq+n\n" +
"wr1mwb0KFCQC5uy45MaB6NKJZMeyVFiQHs3oyZGV/LGgXhnBYX4pmR7y7zgYd5Zn\n" +
"bJu6bGmNzda9a9/82xI7JOLliQNj+oUwLAlqI9KXoAsqNM+pC55n7tFeRxNatEhu\n" +
"h9fhe4E8YwKBgCH7nJU1IGZBCgRQj8vHku/p++ytot3Q29D8uHv7yq/r8WWVppPH\n" +
"efMcA8DkmYzU57a4PtN8IDez+oQbE+r383bwuU0jdm1CTf4/CruzD/OjfRd6wnvM\n" +
"4tDcDurI6Ehn6dgpJKkxvRYfHu+j8fQMZ5NgdVMOwzlt1Qe1OuzO1dDhAoGATtsB\n" +
"Fqr2l+2YQYgrLdpgJGv7oiP5FlcWKa6pgXW3XEplpxvR741m9NL7DNAoIiCiKQrt\n" +
"yM7J5GgMCngZCvIUOsO+fLZJ89exaYi1Gj5l7Gjkrv1SigUqBNNjIhL5SIgjFsRf\n" +
"As8E6gNjmLmv5w371U43i3imSzEpqGYgtUN9IvkCgYAKY9Q1vfBLVbTKMwjP+JDn\n" +
"35rnQd7lCang727qxjsz1SF+YF82c4OAcWQOJLWGrPLgTvrrpRY1lInVooTLqzPI\n" +
"Xqg+L1pUkP+SaV9O4otEaIR6eugLu3ma5BJNvqAdnNhVaQ1IPEZpapCfnX7ZsOFv\n" +
"C6EFuJcnKZpgpLdX61LNoA==\n" +
"-----END PRIVATE KEY-----";