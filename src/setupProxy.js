const { createProxyMiddleware } = require('http-proxy-middleware');
// const morgan = require("morgan");

module.exports = function(app) {
  app.use(  
    '/api',
    createProxyMiddleware({
      target: 'http://staging.nomadsembassy.com/api/api/v1',
      changeOrigin: true,
    //   pathRewrite: {
    //     "^/api": "/public/api/v1/signUp"
    //   }
    })
  );
  app.listen(3000); 
//   app.use(morgan('combined'));
};