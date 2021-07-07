import {
    LOGIN_USER,
    REGISTER_USER,
    AUTH_USER,
    LOGOUT_USER,
    ADD_TO_CART,
    GET_CART_ITEMS,
    REMOVE_CART_ITEM,
    ON_SUCCESS_BUY
} from '../_actions/types';


export default function (state = {}, action) {
    switch (action.type) {
        case REGISTER_USER:
            return { ...state, register: action.payload }
        case LOGIN_USER:
            return { ...state, loginSucces: action.payload }
        case AUTH_USER:
            return { ...state, userData: action.payload }
        case LOGOUT_USER:
            return { ...state }
        case ADD_TO_CART:              //return res.status(200).send(userInfo.cart) 부분이 payload 인 것
            return { ...state, userData: { ...state.userData, cart: action.payload } }  //userData 는 기존것들 합쳐서 놔두고, cart부분만 결과 붙이는것
        //그래서 처음 ...state 는 여러 user들의 정보를 그대로 합쳐둔다는 것이고, 
        //그다음 순서로 userData 가 위치하는데, 그 유저들의 합의 userData는 ...state.userData 를 의미한다.
        case GET_CART_ITEMS:
            return { ...state, cartDetail: action.payload }
        case REMOVE_CART_ITEM:
            return {
                ...state, cartDetail: action.payload.productInfo,   //요건 CartDetail쪽
                userData: {                                         //요건 기존 userData쪽
                    ...state.userData,                              //userData쪽에는 기존부분은 놔두고(합쳐주고)
                    cart: action.payload.cart                       //cart부분만 바꿔주면됨
                }
            }
        case ON_SUCCESS_BUY:
            return {
                ...state, cartDetail: action.payload.cartDetail,   //항상 다시 서버쪽에서 받은 인자를 넣어주는것. 빈배열[]이 들어갈 것임.
                userData: {
                    ...state.userData,
                    cart: action.payload.cart
                }
            }
        default:
            return state;
    }
}