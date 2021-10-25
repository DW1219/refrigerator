import { Col, Row } from 'antd';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import './DetailProductPage';
import ProductImage from './Sections/ProductImage';
import ProductInfo from './Sections/ProductInfo';

function DetailProductPage(props) {
  const productId = props.match.params.productId;

  const [Product, setProduct] = useState({}); //받을 data가 objdct면 {} 로 정의해준다.

  console.log('productID는 : ' + productId);

  //useEffect 함수는 리액트 컴포넌트가 렌더링 될때마다 특정작업을 실행할 수 있도록 하는 Hook
  useEffect(() => {
    axios
      .get(`/api/product/products_by_id?id=${productId}&type=single`) //서버쪽으로 query문 형태로 요청
      .then((response) => {
        setProduct(response.data[0]); // 원래 상세보기페이지 구현당시에만 해도 제품이 하나였기 때문에, response.data.product[0] 안에 정보들이 다 있었다!!!?
        //console.log(response)         // 그러나 제품이 여러개가 되면서 구조가 response.data[0]에 정보들이 들어감!!   0 인덱스는 단순 f12눌러보면 0인덱스에 정보들이 있어서 그렇게 표기
      })
      .catch((err) => alert(err));
  }, []);

  return (
    <div className="detail-product-page-container">
      <Row gutter={[16, 16]}>
        <Col lg={12} xs={24}>
          {/* ProductImage */}
          <ProductImage detail={Product} />
        </Col>
        <Col lg={12} xs={24}>
          {/* ProductInfo */}
          <ProductInfo detail={Product} />
        </Col>
      </Row>
    </div>
  );
}

export default DetailProductPage;
