import React, { useEffect, useState } from 'react'
import { FaCode } from "react-icons/fa";
import axios from "axios"
import { Icon, Col, Card, Row, Carousel } from 'antd';
import Meta from 'antd/lib/card/Meta';
import ImageSlider from '../../utils/ImageSlider';
import Checkbox from './Sections/CheckBox';
import Radiobox from './Sections/RadioBox';
import SearchFeatrue from './Sections/SearchFeature';
import { regions, price } from './Sections/Datas';
import { Button } from "@material-ui/core"


function LandingPage(/* { voiceSearchTerm } */) {
  const [Products, setProducts] = useState([]);
  const [Skip, setSkip] = useState(0);
  const [Limit, setLimit] = useState(8);

  const [PostSize, setPostSize] = useState(0);
  const [Filters, setFilters] = useState({
    regions: [],
    price: [],
  });
  const [SearchTerm, setSearchTerm] = useState("");

  var searchTerm = "";
  const getSearchTerm = () => {
    console.log("getSearchTerm()");
    searchTerm = JSON.parse(window.localStorage.getItem("searchTerm"));
    console.log("searchTerm = " + searchTerm);
  };

  useEffect(() => {
    //useEffect 함수는 리액트 컴포넌트가 렌더링 될때마다 특정작업을 실행할 수 있도록 하는 Hook
    console.log("useEffect");
    getSearchTerm();
    let body = {
      skip: Skip, //현재 0개로 초기화되있음
      limit: Limit, //현재 8개로 초기화되있음
    };

    getProducts(body); // axios 통신함수

    if (searchTerm !== "") {
      updateSearchTerm(searchTerm);
    }

    console.log("useEffect = " + searchTerm);
  }, []); // Component가 화면에 처음 나타났을때(mount됬을때) 만 동작시키고 싶으면 이렇게 빈배열

  const getProducts = (body) => {
    axios
      .post("/api/product/products", body) //여긴 보내는쪽Client. 서버쪽 routes 밑에 product 쪽에 받는부분 구현해야함 (body 같이 보내줌)
      .then((response) => {
        if (response.data.success) {
          //console.log(response.data);
          if (body.loadMore) {
            setProducts([...Products, ...response.data.productInfo]);
          } else {
            setProducts(response.data.productInfo);
          }
          setPostSize(response.data.postSize);
          console.log(Products);
        } else {
          alert("상품 데이터 로딩 실패");
        }
      });
  };

  const loadMoreHandler = () => {
    let skip = Skip + Limit; //skip되는 부분은 limit수를 더해야 2회차 Skip수 값이 되므로

    let body = {
      skip: skip, //현재 0개로 초기화되있음
      limit: Limit, //현재 8개로 초기화되있음
      loadMore: true, //최초가 아닌 더보기 모드 구분을 위해 추가
    };
    getProducts(body); // 마찬가지 axios 통신함수
    setSkip(skip); // 통신후에는 현재 skip값을 다시 붙여넣어야함. 다음번에는 8+8, 16+8 ... 이 되게끔
  };

  const renderCards = Products.map((product, index) => {
    //console.log(product)

    return (
      <Col lg={6} mg={8} xs={24} key={index}>
        <Card
          cover={
            <a href={`/product/${product._id}`}>
              <ImageSlider images={product.images} />
            </a>
          }
        >
          <Meta title={product.title} description={`${product.price}원`} />
        </Card>
      </Col>
    );
  });

  const showFilteredResults = (filters) => {
    let body = {
      skip: 0, //checkbox를 누를때마다 db에서 새로 싹다 가져오는 패턴으로 구현할꺼라 skip은 매번 0이 맞음
      limit: Limit, //limit은 똑같이 8
      filteredItems: filters,
    };
    getProducts(body); // 마찬가지 axios 통신함수
    setSkip(0); // skip이 다른 알고리즘에서 skip = skip + limit 으로 지정되기 때문에 매번 0으로 초기화해줘야함
  };

  const handlePrice = (value) => {
    const data = price; //Datas.js 의 price 배열을 통으로 가져옴
    let array = []; //가격범위를 담을 임시 array

    for (let key in data) {
      //key는 data의 맨앞부분인 id값들이 될것... 0,1,2,3,4....

      if (data[key]._id === parseInt(value, 10)) {
        // 그냥 data[key]._id === value 로 해도되는데 만약을 위해 10진수로 변환
        array = data[key].array; //넘어온 id이면 임시array 에는 Datas.js 에서의 array([0,9999] 등)를 저장
      }
      //console.log(data[key])
    }
    return array;
  };

  const handleFilters = (filters, category) => {
    // regions 하고 price 필터구분을 모두 받을 용도로 공용할 것이므로 category 라고 명칭
    const newFilters = { ...Filters }; // 현재 Filters 형태를 그대로 newFilters 에 복붙(temp용), 현재는 regions[] 와 price[] 가 모두 복사된다.
    newFilters[category] = filters; // check박스를 선택할때마다 추가되는 개념이 아니고 이미 추가되어온 데이터(filters)를 그대로 복붙해서 가지고 있는것
    //console.log("handleFilters 안에서 동작중.... filters : " + filters + " category : " + category + " newFilters[category] : " + newFilters[category])

    if (category === "price") {
      // Price일 경우에는 index가 아닌 가격조건(0,9999 등)으로 구분해서 이미지를 뿌려줘야하므로,
      let priceValues = handlePrice(filters); // 가격조건을 담을 작업이 필요함. handlePrice라는 함수를 따로만들어 가격조건을 추출하도록하자.
      newFilters[category] = priceValues;
      //console.log(" newFilters[category] : " + newFilters[category])
    }

    showFilteredResults(newFilters); // 내용이 많으니 따로 함수빼줌
    setFilters(newFilters); //setFilters를 추가해주어야 기존의 regions도 유지가 된상태에서 price도 저장이될것. //regions[],price[]
  };

  const updateSearchTerm = (newSearchTerm) => {
    // props.refreshFunction(event.currentTarget.value) 를 받은 데이터
    console.log("updateSearchTerm() term = " + newSearchTerm);

    let body = {
      skip: 0,
      limit: Limit,
      filteredItems: Filters,
      searchTerm: newSearchTerm,
    };

    setSearchTerm(newSearchTerm); //부모컴포넌트 SearchTerm에 저장완료
    getProducts(body);
    setSkip(0);
  };

  return (
    <div style={{ width: "75%", margin: "3rem auto" }}>
      <div style={{ textAlign: "center" }}>
        <h2>
          상품 List <Icon type="rocket" />
        </h2>
      </div>
      {/* Filter */}
      <Row gutter={[16, 16]}>
        <Col lg={12} xs={24}>
          {/* CheckBox */}
          <Checkbox
            list={regions}
            handleCommunication={(filters) => handleFilters(filters, "regions")}
          />
        </Col>
        <Col lg={12} xs={24}>
          {/* RadioBox */}
          <Radiobox
            list={price}
            handleCommunication={(filters) => handleFilters(filters, "price")}
          />
        </Col>
      </Row>

      {/* Search */}
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          margin: "1rem auto",
        }}
      >
        {/* <SearchFeatrue refreshFunction={updateSearchTerm} /> */}
      </div>

      {/* Cards */}
      <Row gutter={[16, 16]}>{renderCards}</Row>

      <br />

      {PostSize >= Limit && (
        <div style={{ display: "flex", justifyContent: "center" }}>
          <Button variant="contained" color="primary" onClick={loadMoreHandler}>
            더보기
          </Button>
        </div>
      )}
    </div>
  );
}

export default LandingPage
