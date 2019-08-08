// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  webServerIp: "192.168.1.40",
	webServerPort: "8083",
	stampanteIp: "192.168.1.42",
  stampantePort: "9100",
	hamburgerSheet: "http://1192.168.1.40:8083/spreadsheets?spreadSheetID=1VkMyVpqfR1QG5w4OY6Tu-nACiRGvBi2ehLV2TRcztCw&range=A%3AG&searchFilter&api-version=1.0",
	creaHamburgerSheet: "http://192.168.1.40:8083/spreadsheets?spreadSheetID=1Js-J50XB1nRbniEaVQQ5fudAfBKROj9CAdia4kXkA1s&range=A%3AE&searchFilter&api-version=1.0",
	frittiSheet: "http://192.168.1.40:8083/spreadsheets?spreadSheetID=1511HMmm2eLKMOfvtsslte-2AQb2iX4FV595GCEnj16Q&range=A%3AE&searchFilter&api-version=1.0",
	bevandeSheet: "http://192.168.1.40:8083/spreadsheets?spreadSheetID=16RWD1WCxG904rGeP04DArBHqfovlN102GY65aZhLJcU&range=A%3AD&searchFilter&api-version=1.0"
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
