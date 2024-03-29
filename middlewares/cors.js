const allowedCors = [
  'http://api.nikeliot.nomoredomainsmonster.ru',
  'https://api.nikeliot.nomoredomainsmonster.ru',
  'http://nikeliot.nomoredomainsmonster.ru',
  'https://nikeliot.nomoredomainsmonster.ru',
  'http://localhost:3000',
  'https://localhost:3000',
  'http://localhost:3001',
  'https://localhost:3001',
];

const cors = (req, res, next) => {

  const { origin } = req.headers; 
  const { method } = req; 
  
  const DEFAULT_ALLOWED_METHODS = 'GET,HEAD,PUT,PATCH,POST,DELETE';

  const requestHeaders = req.headers['access-control-request-headers'];
  // allow send cookies
  res.header('Access-Control-Allow-Credentials', true);

  if (allowedCors.includes(origin)) {
    res.header('Access-Control-Allow-Origin', origin);
  }

  if (method === 'OPTIONS') {
    res.header('Access-Control-Allow-Methods', DEFAULT_ALLOWED_METHODS);
    res.header('Access-Control-Allow-Headers', requestHeaders);
    res.end();
    return;
  }

  next();
};

module.exports = cors;