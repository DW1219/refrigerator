import axios from 'axios';
import {
    LOGIN_USER,
    REGISTER_USER,
    AUTH_USER,
    LOGOUT_USER,
    ADD_TO_CART,
    GET_CART_ITEMS,
    REMOVE_CART_ITEM,
    ON_SUCCESS_BUY
} from './types';
import { USER_SERVER } from '../components/Config.js';

export function registerUser(dataToSubmit) {
    const request = axios.post(`${USER_SERVER}/register`, dataToSubmit)
        .then(response => response.data);

    return {
        type: REGISTER_USER,
        payload: request
    }
}

export function loginUser(dataToSubmit) {
    console.log("요청보냄")
    const request = axios.post(`${USER_SERVER}/login`, dataToSubmit)
        .then(response => response.data);
    console.log("요청받음")
    return {
        type: LOGIN_USER,
        payload: request
    }
}

export function auth() {
    const request = axios.get(`${USER_SERVER}/auth`)
        .then(response => response.data);

    return {
        type: AUTH_USER,
        payload: request
    }
}

export function logoutUser() {
    const request = axios.get(`${USER_SERVER}/logout`)
        .then(response => response.data);

    return {
        type: LOGOUT_USER,
        payload: request
    }
}

///장바구니 담기     router는 users.js 에 구현
export function addToCart(id) {               //함수 정의 (ProductInfo.js 에서 사용 할 것)
    let body = {
        productId: id
    }
    const request = axios.post(`${USER_SERVER}/addToCart`, body)         //원하는 이름으로 하위경로를 설정하고, post방식으로 body를 넘김 
        .then(response => response.data);

    return {
        type: ADD_TO_CART,               // ADD_TO_CART 라는 타입으로 명명하고 맨위 import에 추가
        payload: request
    }
}

///cart 정보 가져오기     router는 product.js 에 구현
export function getCartItems(cartItems, userCart) {               //함수 정의 (CartPage.js 에서 dispatch안에 Action명으로 사용 할 것)
    console.log("cartItems" + cartItems)
    const request = axios.get(`/api/product/products_by_id?id=${cartItems}&type=array`)         //조회이기 때문에 get방식이며 body가 필요없음, type은 여러개가 될것이므로 array 형태 
        .then(response => {                                          //response 에는 product 상품Id에 맞는 product 정보들이 담겨있음(서버로부터 도착)
            userCart.forEach(cartItems => {                        //userCart는 redux store 안에 들어있는 cart 정보를 말함. CartItems는 id만 모아놓은 것들을 말함
                response.data.forEach((productDetail, i) => {
                    if (cartItems.id === productDetail._id) {
                        response.data[i].quantity = cartItems.quantity   //product에도 quantity 라는 정보가 들어감
                    }
                })
            })
            return response.data

        });
    return {
        type: GET_CART_ITEMS,               // GET_CART_ITEMS 라는 타입으로 명명하고 맨위 import에 추가
        payload: request
    }
}


///cart Item 지우기     router는 users.js 에 구현
export function removeCartItem(productId) {               //함수 정의 
    const request = axios.get(`/api/users/removeFromCart?id=${productId}`)         // removeFromCart 라는 경로는 임의로 작명해준것 //서버쪽과 맞춰주기만 하면됨
        .then(response => {

            //productInfo, cart 2가지 정보를 조합해서  CartDetail을 다시 만든다.
            response.data.cart.forEach(item => {                //cart정보를 받은것을 활용
                response.data.productInfo.forEach((product, index) => {     //productInfo 정보를 받은것을 활용
                    if (item.id === product._id) {               //id가 같다면 
                        response.data.productInfo[index].quantity = item.quantity
                    }
                })
            })

            return response.data
        });
    return {
        type: REMOVE_CART_ITEM,               // REMOVE_CART_ITEM 라는 타입으로 명명하고 맨위 import에 추가
        payload: request
    }
}

//결재성공 후의 Action 정의       router는 users.js 에 구현
export function onSuccessBuy(data) {               //2개의 인자가 넘어왔으나 그냥 data 하나로 받음
    const request = axios.post(`/api/users/successBuy`, data)     // 값을 변경할 것이므로 post request. succesyBuy 는 작명한것
        .then(response => response.data);

    return {
        type: ON_SUCCESS_BUY,               // REMOVE_CART_ITEM 라는 타입으로 명명하고 맨위 import에 추가
        payload: request
    }
}


