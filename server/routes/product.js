const express = require('express');
const router = express.Router();
const multer = require('multer');
const { Product } = require('../models/Product');

//=================================
//             Product
//=================================

// Disk에 저장하는 부분
var storage = multer.diskStorage({              // Disk저장 포맷
    destination: function (req, file, cb) {           // 어디에 저장하는지 부분. 나는 root폴더 아래 uploads 폴더를 만들어 저장할예정.
        cb(null, 'uploads')
    },
    filename: function (req, file, cb) {                // 파일이름 어떻게 저장할지
        cb(null, `${Date.now()}_${file.originalname}`)
    }
})

var upload = multer({ storage: storage }).single("file") // Disk에 저장실행

// Dropzone 이미지 요청 처리용
// client쪽에서 요청 : axios.post('/api/product/image', formData, config)    //(FileUpload.js)
router.post('/image', (req, res) => {
    // 여기서 라우터로 이미지를 받는거고 저장해주는 부분 구현하면됨.
    upload(req, res, err => {                            // 제대로 저장이 될것이고
        if (err) {                                       // 안되면 에러리턴
            return req.json({ success: false, err })
        }
        return res.json({ success: true, filePath: res.req.file.path, fileName: res.req.file.filename })   //정상 저장되면 path, name 리턴 (다시 client로)
    })
})


// 전체 UploadPage 정보를 DB에 넣어줄때 사용하는 router
//client쪽에서 요청: Axios.post("/api/product", body)      //(UploadProductPage.js)
router.post('/', (req, res) => {
    // 받아온 정보들을 DB에 넣어준다. (body에 넣은것들)
    const product = new Product(req.body)
    product.save((err) => {
        if (err) return res.status(400).json({ success: false, err })
        return res.status(200).json({ success: true })
    })
})


// 메인LandingPage 에서 몽고DB DB들 loading용
//client쪽에서 요청: axios.post('/api/product/products', body)     //(LandingPage.js)
router.post('/products', (req, res) => {

    let limit = req.body.limit ? parseInt(req.body.limit) : 20;       // limit값이 있는게 있다면 client쪽에서 보낸 초기값으로 설정하고, 없다면 20으로 설정해라 라는 문법
    let skip = req.body.skip ? parseInt(req.body.skip) : 0;

    let term = req.body.searchTerm    // frondEnd 검색창에서 입력한 검색어를 받음


    let findArgs = {};               // 데이터만 뽑아서 밑에 Product.find( // 요기 ) 안에 전달해줄 용도로 객체생성

    for (let key in req.body.filteredItems) {              // 현재 filteredItems 에는 regions[] 과 price[] 둘다 들어있음. 따라서 2번 반복할것
        //console.log("req.body.filteredItems : " + req.body.filteredItems + " req.body.filters : " + req.body.filteredItems[key] + " key : " + key)
        if (req.body.filteredItems[key].length > 0) {              //key 는 필터 카테고리로. regions 이나 price 가 될것.    filters[key] = [1,6,5] 이런식으로 저장되있으므로 0보다 크면 데이터가 있는 것

            if (key === "price") {
                findArgs[key] = {
                    $gte: req.body.filteredItems[key][0],          // $gte(grater than equal), 값보다 크거나 같고  // 몽고DB에서 지원하는 쿼리문
                    $lte: req.body.filteredItems[key][1]           // $lte(less than equal), 값보다 작거나 같고 //이외에 $gt, $lt 하면 각각 초과 미만
                }
            } else {             // key === regions 일때
                findArgs[key] = req.body.filteredItems[key]          //데이터 복사
            }
        }
    }
    //console.log('findArgs : ', findArgs)
    //console.log("limit과 skip값은 : " + limit + "과" + skip)


    // 몽고DB에게 요구사항을 적어주는 부분
    // product collection에 들어있는 모든 상품정보를 가져옴  
    if (term) {                    //검색어로 필터 모드
        Product.find(findArgs)        // Product.js 내 productSchema 안의 item들을 모두 찾아보는 것
            .find({ $text: { $search: term } })    // 몽고dB 제공 (검색어로 db찾기) // 더많은 쿼리정보는 https://docs.mongodb.com/manual/
            .populate("writer")                     // writer(사용자)가 가지는 유저관련 모든 정보도 싹다 가져오는 행위
            .skip(skip)
            .limit(limit)
            .exec((err, productInfo) => {                    // exec 의 첫번째 인자는 err 여부를 가져오고, 두번째 인자는 data들을 가져온다.
                console.log("서버쪽에서 몽고DB에 요청할 productInfo 는 : " + productInfo.length)
                if (err) return res.status(400).json({ success: false, err })
                return res.status(200).json({ success: true, productInfo, postSize: productInfo.length })
            })
    } else {
        Product.find(findArgs)        // Product.js 내 productSchema 안의 item들을 모두 찾아보는 것
            .populate("writer")                     // writer(사용자)가 가지는 유저관련 모든 정보도 싹다 가져오는 행위
            .skip(skip)
            .limit(limit)
            .exec((err, productInfo) => {                    // exec 의 첫번째 인자는 err 여부를 가져오고, 두번째 인자는 data들을 가져온다.
                console.log("서버쪽에서 몽고DB에 요청할 productInfo 는 : " + productInfo.length)
                //console.log(new Date(Date.now()).toString())
                if (err) return res.status(400).json({ success: false, err })
                return res.status(200).json({ success: true, productInfo, postSize: productInfo.length })
            })
    }
})

// 상품 상세보기 Page에서 데이터 뿌려주기 && 장바구니 Page에서 데이터 뿌려주기 용도 
/// client쪽에서 요청 : axios.get(`/api/product/products_by_id?id=${cartItems}&type=array`)      //getCartItems 액션으로 실행 (CartPage.js -> user_actions.js)
/// client쪽에서 요청 : axios.get(`/api/product/products_by_id?id=${productId}&type=single`)     //(DetailProductPage.js)
router.get('/products_by_id', (req, res) => {
    // productId를 이용해서 DB에서 productId와 같은 상품의 정보를 가져와야함
    let type = req.query.type            //client(frontend) 에서 요청한 type
    let productIds = req.query.id         //client(frontend) 에서 요청한 id

    if (type === "array") {                //장바구니 페이지용 이면
        let ids = req.query.id.split(',')       // id들이 123123123,12312312312312,31231231231 이런식으로 올것이라 배열형태로 넣어주려면 split해야함
        productIds = ids.map(item => {
            return item
        })
    }
    console.log("productIds : " + productIds)


    //console.log("req.query.type은 : " + type + " req.query.id는 : " + productId)
    Product.find({ _id: { $in: productIds } })         // 몽고DB쪽으로 원하는id를 요청.   //장바구니 Page 때문에 이런식으로 $in 쿼리문으로 구현해주어야함
        .populate("writer")
        .exec((err, product) => {            // productInfo 든 product 든 원하는 정보를 요청하면 된다.
            if (err) return res.status(400).send(err)
            return res.status(200).send(product)  // .send는 몽고DB로부터 결과받아서 다시 client 쪽으로 보내주는 내용임
        })
})



module.exports = router;
