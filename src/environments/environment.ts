// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

// http://192.168.0.19:8000/api/
// http://192.168.0.23:8888/api/

export const environment = {
  production: false,
  // SERVER_API_URL: "http://bg.gateway.atmaneuler.com/"
  SERVER_API_URL: "http://localhost:7005/",
  // SERVER_API_URL: "http://192.168.1.248:7005/"
  //  SERVER_API_URL: "http://dev.bg.gateway.atmaneuler.com/"
  // SERVER_API_URL: "http://bg.gateway.atmaneuler.com/",
  // SERVER_API_URL: "http://ae.gateway.atmaneuler.com/",
  // SERVER_API_URL: "http://bg.gateway.atmaneuler.com/",


  
  
  // SERVER_API_URL: "http://192.168.1.2:7005/",
  // SERVER_API_URL: "http://kaser.atmaneuler.com"
  // SERVER_API_URL: "http://ae.atmaneuler.com"
  
  // firebase: {},


  // debug: true,
  // log: {
  //   auth: false,
  //   store: false,
  // },

  // smartadmin: {
  //   api: null,
  //   db: 'smartadmin-angular'
  // }

};