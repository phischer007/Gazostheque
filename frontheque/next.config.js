module.exports = {
  basePath: '/gazostheque',
  env: {
    NEXT_PUBLIC_DJANGO_SERVER: process.env.NEXT_PUBLIC_DJANGO_SERVER || (process.env.NODE_ENV === 'production' ? 'https://liphy-gazotheque.univ-grenoble-alpes.fr/api' : 'http://localhost:8005/api'),
    NEXT_PUBLIC_ASSETS: process.env.NEXT_PUBLIC_ASSETS || (process.env.NODE_ENV === 'production' ? 'https://liphy-gazotheque.univ-grenoble-alpes.fr/static/' : 'http://localhost:8005/assets/'),
  },
};
