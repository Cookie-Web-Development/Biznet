'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _passport = _interopRequireDefault(require("passport"));
var _bcrypt = _interopRequireDefault(require("bcrypt"));
var _passportLocal = _interopRequireDefault(require("passport-local"));
var _expressFlash = _interopRequireDefault(require("express-flash"));
var _mongoose = _interopRequireDefault(require("mongoose"));
var _users_schema = require("./schema/users_schema.js");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
var auth = function auth(app, db) {
  var userDB = db.model('users', _users_schema.users_schema);
  _passport["default"].use(new _passportLocal["default"](function (username, password, done) {
    //PENDING: FAILED ATTEMP ACCOUNT LOCKOUT
    userDB.findOne({
      username: username.trim().toLowerCase()
    }).then(function (user) {
      if (!user) {
        return done(null, false, {
          message: 'invalid_login'
        });
      }
      if (!_bcrypt["default"].compareSync(password, user.password)) {
        return done(null, false, {
          message: 'invalid_login'
        });
      }
      ;
      return done(null, user);
    })["catch"](function (err) {
      if (err) {
        return done(err);
      }
    });
  }));
  _passport["default"].serializeUser(function (user, done) {
    done(null, user._id);
  });
  _passport["default"].deserializeUser(function (id, done) {
    var objectId = new _mongoose["default"].Types.ObjectId(id);
    userDB.findOne({
      _id: objectId
    }, {
      _id: 1,
      profile_name: 1
    }).then(function (user) {
      done(null, user);
    });
  });
};
var _default = auth;
exports["default"] = _default;