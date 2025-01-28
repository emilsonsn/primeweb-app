declare const require: any;

export const environment = {
  production: false,
  appName: 'Prime Web',
  home: '/painel',
  //api: 'https://api.primewebsistema.com.br/api',
  api: 'http://127.0.0.1:8000/api',
  version: require('../../package.json').version
};
