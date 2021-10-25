import { Form, Input, Typography } from 'antd';
import Axios from 'axios';
import React, { useState } from 'react';
import btnUpload from '../../../images/btn_upload.png';
import FileUpload from '../../utils/FileUpload';
import './UploadProductPage.css';

const { Title } = Typography;
const { TextArea } = Input;

const Regions = [
  { key: 1, value: '강남구' },
  { key: 2, value: '강동구' },
  { key: 3, value: '강서구' },
  { key: 4, value: '강북구' },
  { key: 5, value: '관악구' },
  { key: 6, value: '광진구' },
  { key: 7, value: '구로구' },
  { key: 8, value: '금천구' },
  { key: 9, value: '노원구' },
  { key: 10, value: '동대문구' },
  { key: 11, value: '도봉구' },
  { key: 12, value: '동작구' },
  { key: 13, value: '마포구' },
  { key: 14, value: '서대문구' },
  { key: 15, value: '성동구' },
  { key: 16, value: '성북구' },
  { key: 17, value: '서초구' },
  { key: 18, value: '송파구' },
  { key: 19, value: '영등포구' },
  { key: 20, value: '용산구' },
  { key: 21, value: '양천구' },
  { key: 22, value: '은평구' },
  { key: 23, value: '종로구' },
  { key: 24, value: '중구' },
  { key: 25, value: '중랑구' },
];

function UploadProductPage(props) {
  const [TitleName, setTitleName] = useState('');
  const [Description, setDescription] = useState('');
  const [Price, setPrice] = useState();
  const [Region, setRegion] = useState(1);
  const [Images, setImages] = useState([]);

  const titleNameChangeHandler = (event) => {
    //람다식 표현, 함수하나 만들어준거
    setTitleName(event.currentTarget.value);
  };
  const descriptionChangeHandler = (event) => {
    //설명
    setDescription(event.currentTarget.value);
  };
  const priceChangeHandler = (event) => {
    //가격
    setPrice(event.currentTarget.value);
  };
  const regionChangeHandler = (event) => {
    //지역
    setRegion(event.currentTarget.value);
  };

  const updateImages = (newImages) => {
    console.log('넘어온 이미지 : ' + newImages);
    setImages(newImages);
  };

  const submitHandler = (event) => {
    console.log('정상동작중');
    event.preventDefault(); // 확인버튼 눌렀을때 자동적으로 page가 refresh 되지 않게 막아줌

    if (!TitleName || !Description || !Price || !Region || !Images) {
      // 모든 입력칸 중 단 하나라도 채워지지 않았을 경우엔 방지
      return alert(' 모든 정보를 입력해 주세요');
    }

    const body = {
      //로그인 된 사람의 ID
      writer: props.user.userData._id,
      title: TitleName,
      description: Description,
      price: Price,
      images: Images,
      regions: Region,
    };

    //서버에 채운 값들을 request로 보낸다.
    Axios.post('/api/product', body).then((response) => {
      if (response.data.success) {
        alert('상품 업로드 성공');
        // 이 이후에 최초 메인페이지로 이동하게 하고 싶을때
        props.history.push('/');
      } else {
        alert('상품 업로드 실패');
      }
    });
  };

  return (
    <div className="wrap__totalUploadPage">
      {/* <div className="wrap__titleUploadPage">
                <Title level={1}>음식 올리기</Title>
            </div>
            <br />
            <br /> */}
      <Form onSubmit={submitHandler}>
        {/* DropZone */}
        <FileUpload refreshFunction={updateImages} />
        <br />
        <br />
        {/* <label className="label_format">식품명</label> */}
        <Input
          className="input-data input-data-input"
          onChange={titleNameChangeHandler}
          value={TitleName}
          placeholder="식품명"
        />
        <br />
        <br />

        {/* <label>가격(원)</label> */}
        <Input
          className="input-data input-data-input"
          type="number"
          onChange={priceChangeHandler}
          value={Price}
          placeholder="가격(원)"
        />
        <br />
        <br />

        {/* <label>설명</label> */}
        <TextArea
          className="input-data input-data-textarea"
          onChange={descriptionChangeHandler}
          value={Description}
          placeholder="설명"
        />
        <br />
        <br />

        {/* <label className="region-title">지역</label> */}
        <select
          onChange={regionChangeHandler}
          value={Region}
          className="select-data"
        >
          {Regions.map((item) => (
            <option key={item.key} value={item.key}>
              {item.value}
            </option>
          ))}
        </select>
        <br />
        <br />
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <input
            type="image"
            className="btn_upload"
            src={btnUpload}
            alt="Submit button"
          />
        </div>
      </Form>
    </div>
  );
}

export default UploadProductPage;
