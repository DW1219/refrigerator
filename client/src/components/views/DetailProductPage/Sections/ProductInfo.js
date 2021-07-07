import React, { useState, useEffect } from 'react'
import { Button, Descriptions } from 'antd';
import { useDispatch } from 'react-redux';    //redux import 하는 방법
import { addToCart } from '../../../../_actions/user_actions';

function ProductInfo(props) {
    const dispatch = useDispatch();


    const clickHandler = () => {
        dispatch(addToCart(props.detail._id))
    }


    return (
        <div>
            <Descriptions title="상품 정보" bordered>
                <Descriptions.Item label="Price">{props.detail.price}</Descriptions.Item>
                <Descriptions.Item label="Sold">{props.detail.sold}</Descriptions.Item>
                <Descriptions.Item label="Views">{props.detail.views}</Descriptions.Item>
                <Descriptions.Item label="Description">{props.detail.description}</Descriptions.Item>
            </Descriptions>

            <br />
            <br />
            <br />
            <div style={{ display: 'flex', justifyContent: 'center' }}>
                <Button size="large" shape="round" type="danger" onClick={clickHandler}>
                    장바구니 담기
                </Button>
            </div>
        </div>

    )
}

export default ProductInfo
