const passport = require('passport');
const passportLocalMongoose = require('passport-local-mongoose');
const User = require('../model/User');
const flash = require("connect-flash");
const connectEnsureLogin = require('connect-ensure-login');

const users = {
  signin: async(req, res) => {
    res.status(200).json({success:true,message:"로그인 성공"})
  },
  signup: async (req, res) => {
    res.status(200).json({success:true,message:"회원가입이 성공하였습니다"})
  },
  signout: async(req, res) => {
    req.logout();
    res.redirect(200, '/');
  },
  mypage: async(req, res) => {
    res.redirect(200, '/mypage');
  },
}

module.exports = users
