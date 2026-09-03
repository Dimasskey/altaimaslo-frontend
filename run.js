// const express = require('express');
// const onHeaders = require('on-headers');
// const {createProxyMiddleware} = require("http-proxy-middleware");
// const app = express();
// const port = process.env.PORT || 8005;
//
//
// function parseCookies (request) {
//     const list = {};
//     const cookieHeader = request.headers?.cookie;
//     if (!cookieHeader) return list;
//
//     cookieHeader.split(`;`).forEach(function(cookie) {
//         let [ name, ...rest] = cookie.split(`=`);
//         name = name?.trim();
//         if (!name) return;
//         const value = rest.join(`=`).trim();
//         if (!value) return;
//         list[name] = decodeURIComponent(value);
//     });
//
//     return list;
// }
//
// function unsetHeaders() {
//   this.removeHeader('Etag');
//   this.removeHeader('Last-Modified');
//   this.removeHeader('Cache-Control');
//   this.removeHeader('Date');
// }
//
// app.listen(port, () => console.log(`Listening on port ${port}`));
// app.disable('x-powered-by');
// app.set('etag', false);
//
// app.use(function (req, res, next) {
//     onHeaders(res, unsetHeaders);
//     next();
// })
//
// app.use(
//     '/assets',
//     express.static(
//         __dirname + '/dist/assets/',
//         {
//             setHeaders: function (res, path) {
//                 onHeaders(res, unsetHeaders);
//             }
//         }
//     )
// );
//
//
// app.get('/', async (req, res) => {
//     res.sendFile('/dist/index.html', {root: __dirname });
// });
//

const express = require('express');
const onHeaders = require('on-headers');
const path = require('path');
const app = express();
const port = process.env.PORT || 8005;

function parseCookies(request) {
    const list = {};
    const cookieHeader = request.headers?.cookie;
    if (!cookieHeader) return list;

    cookieHeader.split(`;`).forEach(function(cookie) {
        let [name, ...rest] = cookie.split(`=`);
        name = name?.trim();
        if (!name) return;
        const value = rest.join(`=`).trim();
        if (!value) return;
        list[name] = decodeURIComponent(value);
    });

    return list;
}

function unsetHeaders() {
    this.removeHeader('Etag');
    this.removeHeader('Last-Modified');
    this.removeHeader('Cache-Control');
    this.removeHeader('Date');
}

app.disable('x-powered-by');
app.set('etag', false);

app.use((req, res, next) => {
    onHeaders(res, unsetHeaders);
    next();
});

app.use(
    '/assets',
    express.static(path.join(__dirname, 'dist/assets'), {
        setHeaders: (res, path) => onHeaders(res, unsetHeaders),
    })
);

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist/index.html'));
});

app.use((req, res) => {
    res.sendFile(path.join(__dirname, 'dist/index.html'));
});

app.listen(port, () => console.log(`Listening on port ${port}`));

