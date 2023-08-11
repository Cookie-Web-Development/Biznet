'use strict';

var _express = _interopRequireDefault(require("express"));
var _expressSession = _interopRequireDefault(require("express-session"));
var _connectMongo = _interopRequireDefault(require("connect-mongo"));
var _mongoose = _interopRequireDefault(require("mongoose"));
var _http = _interopRequireDefault(require("http"));
var _dotenv = _interopRequireDefault(require("dotenv"));
var _api = _interopRequireDefault(require("./server/api.js"));
var _bodyParser = _interopRequireDefault(require("body-parser"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
var app = (0, _express.default)();
var server = _http.default.createServer(app);
_dotenv.default.config({
  path: './.env'
});
app.set('view engine', 'pug');
app.set('views', './views');
app.use('/public', _express.default.static(process.cwd() + '/public'));
app.use('/src', _express.default.static(process.cwd() + '/src'));
var sessionDB = _mongoose.default.createConnection(process.env.URI_SESSION, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});
var store = _connectMongo.default.create({
  mongoUrl: process.env.URI_SESSION,
  mongooseConnection: sessionDB,
  collectionName: 'session'
});
app.use((0, _expressSession.default)({
  //from ChatGPT
  secret: process.env.SESSION,
  resave: false,
  saveUninitialized: false,
  cookie: {
    sameSite: 'lax',
    //Set none for Production. lax for dev
    httpOnly: true,
    //Prevent client-side scripting
    secure: false,
    //Sends cookies only HTTPS. true for Production. false for dev
    maxAge: 300000 //5min FOR DEV ONLY!
  },

  store: store
}));

// Set up body-parser middleware from ChatGPT
app.use(_bodyParser.default.urlencoded({
  extended: false
}));
app.use(_bodyParser.default.json());

// Middleware function to set language preference
var setLanguagePreference = function setLanguagePreference(req, res, next) {
  if (!req.session.language) {
    // Check for language in request headers
    req.session.language = req.headers['accept-language'];
    if (!req.session.language) {
      // Set default language
      language = 'es';
    } else {
      // Extract the language code from the header
      req.session.language = req.session.language.split(',')[0].split(';')[0].split('-')[0];
    }
  }
  next();
};

// Set the middleware function for all routes
app.use(setLanguagePreference);
(0, _api.default)(app);
var PORT = process.env.PORT || 3000;
server.listen(PORT, function () {
  console.log("Listening to port: ".concat(PORT));
});