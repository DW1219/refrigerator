import { Button } from '@material-ui/core';
import React from 'react';
import './UserCardBlock.css';

function UserCardBlock(props) {
  //console.log(props)
  //console.log(props.products)

  const renderCartImage = (images) => {
    if (images.length > 0) {
      let image = images[0];
      return `http://localhost:5000/${image}`;
    }
  };

  //신기하게도 props 찍어보면 products 안에 정보가 다들어가있음
  const renderItems = () =>
    props.products &&
    props.products.map((product, index) => (
      <tr key={index}>
        <td className="title-layout">
          <img
            style={{ width: '10rem' }}
            alt="product"
            src={renderCartImage(product.images)}
          />
          <span>&nbsp;&nbsp;{product.title}</span>
        </td>
        <td className="count-layout">{product.quantity} EA</td>
        <td className="price-layout">{product.price}원</td>
        <td className="remove-btn-layout">
          <Button
            variant="contained"
            color="primary"
            onClick={() => props.removeItem(product._id)}
          >
            삭제
          </Button>
        </td>
      </tr>
    ));

  return (
    <div>
      <div>
        <table>
          {/* <thead>
                        <tr>
                            <th>상품</th>
                            <th>상품 수량</th>
                            <th>상품 가격</th>
                            <th>비고</th>
                        </tr>
                    </thead> */}
          <tbody>{renderItems()}</tbody>
        </table>
      </div>
    </div>
  );
}

export default UserCardBlock;
