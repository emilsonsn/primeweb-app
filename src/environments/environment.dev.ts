declare const require: any;

export const environment = {
  production: false,
  appName: 'Granatum App',
  home: '/painel',
  api: 'http://195.200.1.79:3001/api',
  version: require('../../package.json').version
};

