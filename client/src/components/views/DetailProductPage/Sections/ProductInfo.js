import { Button, Descriptions } from 'antd';
import React from 'react';
import { useDispatch } from 'react-redux'; //redux import 하는 방법
import { addToCart } from '../../../../_actions/user_actions';
import './ProductInfo.css';

function ProductInfo(props) {
  const dispatch = useDispatch();

  const clickHandler = () => {
    dispatch(addToCart(props.detail._id));
  };

  return (
    <div className="product-info-container">
      <Descriptions bordered className="product-info-main-layout">
        <Descriptions.Item label="Price">
          {props.detail.price}원
        </Descriptions.Item>
        <Descriptions.Item label="Sold">{props.detail.sold}</Descriptions.Item>
        <Descriptions.Item label="Views">
          {props.detail.views}
        </Descriptions.Item>
        <Descriptions.Item label="Description">
          {props.detail.description}
        </Descriptions.Item>
      </Descriptions>

      <br />
      <br />
      <br />
      <div className="add-cart-btn">
        <Button size="large" shape="round" type="danger" onClick={clickHandler}>
          장바구니 담기
        </Button>
      </div>
    </div>
  );
}

export default ProductInfo;
