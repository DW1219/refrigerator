const express = require('express');
const router = express.Router();
const { User } = require('../models/User');
const { Product } = require('../models/Product');
const { Payment } = require('../models/Payment');
const { auth } = require('../middleware/auth');
const async = require('async');

//=================================
//             User
//=================================

router.get('/auth', auth, (req, res) => {
  res.status(200).json({
    _id: req.user._id,
    isAdmin: req.user.role === 0 ? false : true,
    isAuth: true,
    email: req.user.email,
    name: req.user.name,
    lastname: req.user.lastname,
    role: req.user.role,
    image: req.user.image,
    cart: req.user.cart,
    history: req.user.history,
  });
});

router.post('/register', (req, res) => {
  const user = new User(req.body);

  user.save((err, doc) => {
    if (err) return res.json({ success: false, err });
    return res.status(200).json({
      success: true,
    });
  });
});

//redux // const request = axios.post(`${USER_SERVER}/register`, dataToSubmit)   (RegisterPage.js -> user_actions.js)
router.post('/login', (req, res) => {
  User.findOne({ email: req.body.email }, (err, user) => {
    if (!user)
      return res.json({
        loginSuccess: false,
        message: 'Auth failed, email not found',
      });

    user.comparePassword(req.body.password, (err, isMatch) => {
      if (!isMatch)
        return res.json({ loginSuccess: false, message: 'Wrong password' });
      console.log('user : ', user);
      user.generateToken((err, user) => {
        if (err) return res.status(400).send(err);
        res.cookie('w_authExp', user.tokenExp);
        res.cookie('w_auth', user.token).status(200).json({
          loginSuccess: true,
          userId: user._id,
        });
      });
    });
  });
});

router.get('/logout', auth, (req, res) => {
  User.findOneAndUpdate(
    { _id: req.user._id },
    { token: '', tokenExp: '' },
    (err, doc) => {
      if (err) return res.json({ success: false, err });
      return res.status(200).send({
        success: true,
      });
    }
  );
});

// 장바구니에 item 넣을때 데이터 처리용
//client쪽에서 요청: axios.post('/api/product/products', body)     // addToCart 액션으로 실행 (productInfo.js 에서 buttonclick 이벤트로 addToCart -> user_actions.js)
router.post('/addToCart', auth, (req, res) => {
  //https://docs.mongodb.com/manual/reference/method/db.collection.findOne/
  User.findOne(
    { _id: req.user._id }, //findOne은 몽고DB에서 제공하는 메소드 // 원형은 db.collection.findOne(query, projection)  //이 id로 데이터들을 찾기위함
    (err, userInfo) => {
      //2번째 인자인 projection 필드(userInfo)에 값이 포함된 채로 리턴이 되는 것.

      let duplicate = false; //임시 flag (같은게 있는지 여부 확인을 위해)
      userInfo.cart.forEach((item) => {
        //cart에는 여러개가 있을수 있으므로 forEach로 여러번 돌려봐야함
        if (item.id === req.body.productId) {
          //같은게 하나라도 있으면
          duplicate = true; //있다고 표시
        }
      });
      if (duplicate) {
        //상품이 있다면 cart 쪽에 quantity 만 1개 추가
        User.findOneAndUpdate(
          //마찬가지 몽고DB 제공 메소드. 원형: findOneAndUpate(filter,update,options)
          { _id: req.user._id, 'cart.id': req.body.productId }, //첫번째 인자 filter. (우리는 유저ID(_id) 아래에 cartID(cart.id)에 접근해야하므로)
          { $inc: { 'cart.$.quantity': 1 } }, //두번째 인자 update. 이런식으로 바로 몽고DB에서 수량을 1올리라고 쿼리문을 줄수있음
          { new: true }, //세번째 인자 options. new: true 라고 하면 리턴받는 값은 업데이트된 내용을 리턴받을수있음
          (err, userInfo) => {
            // 다시 받아온 업데이트 정보를 가지고 front-end(client)쪽에 리턴해주어야함.
            if (err) return res.status(400).json({ success: false, err });
            return res.status(200).send(userInfo.cart); //front-end 쪽에는 cart 정보만 주면 됨
          }
        );
      } else {
        //상품이 없다면 id와 장바구니수량(quantity)과 날짜(date)를 넣어줘야한다.
        console.log('req.user._id : ' + req.user._id);
        User.findOneAndUpdate(
          { _id: req.user._id },
          {
            $push: {
              cart: {
                //cart 안에 정보들을 넣을때 이런식으로 넣는다.
                id: req.body.productId,
                quantity: 1,
                date: new Date(Date.now()).toString(),
              },
            },
          },
          { new: true },
          (err, userInfo) => {
            if (err) return res.status(400).json({ success: false, err });
            return res.status(200).send(userInfo.cart); //front-end 쪽에는 cart 정보만 주면 됨
          }
        );
        //console.log("userInfo : " + userInfo + ", userInfo.cart : " + userInfo.cart)
      }
    }
  );
});

// 장바구니에 item 지울때 데이터 처리용
//client쪽에서 요청: axios.post('/api/product/products', body)     // removeCartItem 액션으로 실행 (CartPage.js -> user_actions.js)
router.get('/removeFromCart', auth, (req, res) => {
  // Cart안의 상품 지우기 (user data쪽)
  User.findOneAndUpdate(
    { _id: req.user._id }, //다시말하지만 이렇게 할수 있는 이유는 auth 미들웨어 때문에 가능함.
    {
      //body 가 아닌 query 문으로 날라갈때는 쌍따옴표"" 붙여야함.... 그냥 암기..
      $pull: {
        //push와 다르게 빼는 옵션....
        cart: {
          id: req.query.id,
        },
      },
    },
    { new: true }, //마찬가지 새로 업데이트된 정보를 가져오는 옵션
    (err, userInfo) => {
      let cart = userInfo.cart; //빼고난 다음의 업데이트된 cart정보
      let array = cart.map((item) => {
        return item.id; //다시 남아있는 id들을 추출한다
      });

      // cartDetail 정보도 수정하기위해 다시 가져오는것..(다시 집어넣는 행위. product.js에서 상세보기Page나 카트Page 공통부분과 동일)
      Product.find({ _id: { $in: array } }) //다시 추출한것을 새로 넣는 것임....
        .populate('writer')
        .exec((err, productInfo) => {
          //productInfo를 받았다면 다시 client쪽으로 보냄
          return res.status(200).json({ productInfo, cart }); //client쪽에서 cartDetail을 다시 만들려면 cart 정보도 필요함
        });
    }
  );
});

// 장바구니에서 결재성공 후의 데이터 처리용
//client쪽에서 요청: axios.post(`/api/users/successBuy`, data)     // onSuccessBuy 액션으로 실행 (CartPage.js -> user_actions.js)
router.post('/successBuy', auth, (req, res) => {
  // 1. User Collection 안의 History 필드안에 결제정보 넣어주기
  let tempHistory = [];
  let transactionData = {}; // user[] / data[] / product[] 를 Payment 모델에 대입하기 위한 변수

  req.body.cartDetail.forEach((item) => {
    //이미 action 넘길때 인자로 cartDetail: props.user.cartDetail 라고 redux의 구조를 받았음.
    tempHistory.push({
      //redux cartDetail 구조를 그대로 넣는거라고 보면됨.
      dateOfPurchase: new Date(Date.now()).toLocaleString(),
      name: item.title,
      id: item._id,
      price: item.price,
      quantity: item.quantity,
      paymentId: req.body.paymentData.paymentID, //action 넘길때 인자로   paymentData: payment(Paypal 에서의 return 정보였음)  구조를 받았음. ID접근은 payment.paymentID
    });
  });
  // 2. Payment collection 안에 자세한 결제 정보 넣어주기(새로운 tree하나 만드는것 - root부터 _id / user[] / data[] / product[]  이렇게 구성되도록 할것. )
  transactionData.user = {
    // 첫째로 user[] 구성하기
    id: req.user._id, // 유저 id
    name: req.user.name, // 유저 name
    email: req.user.email,
  };

  transactionData.data = req.body.paymentData; // 둘째로 data[] 구성하기. 여기는 그냥 결재사에서 return 해준 내용을 그대로 넣어주겠음
  transactionData.product = tempHistory; // 셋째로 product[] 구성하기. 이미 history 만들면서 구성했던 내용으로 똑같이 넣어주겠음

  User.findOneAndUpdate(
    { _id: req.user._id },
    {
      $push: { history: tempHistory }, //history 트리안에 정보들을 넣을때 이런식으로 넣는다.
      $set: { cart: [] }, //cart는 결재완료했으니 다시 비워줘야 함.
    },
    { new: true },
    (err, userInfo) => {
      if (err) return res.status(400).json({ success: false, err });
      //return res.status(200).send(userInfo)

      const payment = new Payment(transactionData); //데이터 모델에 값 통으로 대입하는 방법 !!!!save 하면됨!!!
      payment.save((err, doc) => {
        if (err) return res.status(400).json({ success: false, err });

        // 3. Product Collection 안에 있는 sold 필드 정보 업데이트 시켜주기 (일반 쇼핑몰에서 재고상품 몇개 팔렸는지 확인위해.... 당근마켓용은 안어울림)
        // 상품당 몇개의 quantity를 샀는지.  3개를 샀다면 몽고dB상에 product의 sold 부분에 3개를 올려줘야함
        let tempProducts = [];
        doc.product.forEach((item) => {
          tempProducts.push({ id: item.id, quantity: item.quantity });
        });

        //Product.update()  //결국 이런식으로 update를 해줘야하는데, 여러상품이다 보니 for문을 돌리면서 상품 id를 또 찾아가면서 업데이트 해주려면 매우복잡하다.
        //여기서 해결책이 async 라는 모듈
        async.eachSeries(
          tempProducts,
          (item, callback) => {
            Product.update(
              { _id: item.id }, //id로 찾고
              {
                $inc: {
                  sold: item.quantity, //item 수량만큼 업데이트(증가시켜줌 $inc : increase)
                },
              },
              { new: false }, //이번에는 update된 내용을 굳이 안받아도된다.
              callback
            );
          },
          (err) => {
            if (err) return res.status(400).json({ success: false, err });
            return res
              .status(200)
              .json({ success: true, cart: userInfo.cart, cartDetail: [] }); //cartDetial은 비워주는것. cart는 임의이름. reducer쪽에 payload.cart 로만 넘겨주면됨
          }
        );
      });
    }
  );
});

module.exports = router;
