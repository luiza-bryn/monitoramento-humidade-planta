const httpProxy = require('express-http-proxy');
const express = require('express');
const app = express();
var logger = require('morgan');

app.use(logger('dev'));

function selectProxyHost(req) {
    if (req.path.startsWith('/parametros'))
        return 'http://ip:8080/';
    else if (req.path.startsWith('/logging'))
        return 'http://ip:8090/';
    else return null;
}

app.use((req, res, next) => {
    var proxyHost = selectProxyHost(req);
    if (proxyHost == null)
        res.status(404).send('Not found');
    else
        httpProxy(proxyHost)(req, res, next);
});

app.listen(8000, '0.0.0.0', () => {
    console.log('API Gateway iniciado!');
});