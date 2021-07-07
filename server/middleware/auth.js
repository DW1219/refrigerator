const { User } = require('../models/User');

let auth = (req, res, next) => {
  let token = req.cookies.w_auth;                 //request의 cookies.w_auth 는 알수없는 string 형식으로 되어있음. ex)eyhJbgsdfseJ1.......
  //console.log("token은?" + token)
  User.findByToken(token, (err, user) => {        //이 token을 findByToken(User.js 에 정의)에서 jwt(jsonwebtoken 이라는 lib)를 사용해서 decoding 작업을 해서 구한다.
    if (err) throw err;
    if (!user)
      return res.json({
        isAuth: false,
        error: true
      });

    req.token = token;
    req.user = user;          //그래서 얻어낸 user 정보를 req.user에 담는다.  
    next();
  });
};

module.exports = { auth };
