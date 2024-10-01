declare const require: any;

export const environment = {
  production: false,
  appName: 'Granatum App',
  home: '/painel',
  api: 'https://api.primewebsistema.com.br/api',
  version: require('../../package.json').version
};
