import { Empty, Result } from 'antd';
import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import {
  getCartItems,
  onSuccessBuy,
  removeCartItem,
} from '../../../_actions/user_actions';
import Paypal from '../../utils/Paypal';
import './CartPage.css';
import UserCardBlock from './Sections/UserCardBlock';

function CartPage(props) {
  //여기 props는 현재 redux 최상위 root 경로임
  const dispatch = useDispatch();

  const [TotalPrice, setTotalPrice] = useState(0);
  const [ShowTotal, setShowTotal] = useState(false);
  const [ShowSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    let cartItems = []; //상품id를 뭉쳐넣을 임시배열

    // Redux  User state 안에 cart안에 상품이 들어있는지 확인필요
    if (props.user.userData && props.user.userData.cart) {
      //userData가 있고 cart까지 있다면
      if (props.user.userData.cart.length > 0) {
        props.user.userData.cart.forEach((item) => {
          cartItems.push(item.id); //상품id를 우선 다 담아둔다.
        });
        //redux를 이용한 컨트롤(통신)
        dispatch(getCartItems(cartItems, props.user.userData.cart)) //상품id집합 과 cart 정보를 인자로 넘긴다.
          .then((response) => {
            calculateTotalPrice(response.payload);
          }); //상품합계 구하는 함수 실행(인자로 전체 데이터 넘김)
      }
    }
  }, [props.user.userData]); //괄호안의 data가 바뀔때 useEffect hook이 실행되는 것. 안넣어주면 맨첨에 1번만 실행되고 실행안됨.

  let calculateTotalPrice = (cartDetail) => {
    let total = 0;

    cartDetail.map((item) => {
      //왠만한건 다 map으로 가져옴
      total += parseInt(item.price, 10) * item.quantity; // string을 숫자로 : parstInt
    });
    setTotalPrice(total);
    setShowTotal(true);
  };

  //UserCardBlock.js 에서 button누를때 제품id를 넘겨줬음
  let removeFromCart = (productId) => {
    dispatch(removeCartItem(productId)) //Action (removeCartItem) 정의필요
      .then((response) => {
        //console.log(response)
        if (response.payload.productInfo.length <= 0) {
          //하나도 상품이 없을경우
          setShowTotal(false);
        }
      });
  };

  //PayPay 결재버튼 눌렀을때 동작
  const transactionSuccess = (payment) => {
    dispatch(
      onSuccessBuy({
        //2개의 인자를 서버로 넘김 1.paypal 리턴받은 데이터,  2. 리덕스 store의 cartDetail 정보
        paymentData: payment,
        cartDetail: props.user.cartDetail,
      })
    ).then((response) => {
      if (response.payload.success) {
        setShowTotal(false);
        setShowSuccess(true);
      }
    });
  };

  return (
    <div className="mycart-container">
      {/* <h1>My Cart</h1> */}
      <div>
        <UserCardBlock
          products={props.user.cartDetail}
          removeItem={removeFromCart}
        />
      </div>

      {ShowTotal ? (
        <div className="total-price-layout">
          <h2>총 금액: {TotalPrice}원</h2>
          <br />
        </div>
      ) : ShowSuccess ? (
        <Result status="success" title="주문 완료" />
      ) : (
        <>
          <br />
          <Empty description={false} />
        </>
      )}

      {ShowTotal && (
        <Paypal totalPrice={TotalPrice} onSuccess={transactionSuccess} />
      )}
    </div>
  );
}

export default CartPage;
