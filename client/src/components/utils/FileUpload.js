import { Icon } from 'antd';
import axios from 'axios';
import React, { useState } from 'react';
import Dropzone from 'react-dropzone';
import './FileUpload.css';

function FileUpload(props) {
  const [Images, setImages] = useState([]);
  // const [Images, setImages] = useState(['cap1', 'shoes2', 'set3'])  이미지 3개 초기화로 넣은것

  const dropHandler = (files) => {
    let formData = new FormData();

    const config = {
      header: { 'content-type': 'multipart/form-data' },
    };
    formData.append('file', files[0]);

    axios
      .post('/api/product/image', formData, config) // 서버쪽으로 데이터를 post 요청하는거
      .then((response) => {
        // 서버쪽갔다가 다시 client쪽으로 response 오는거 받는부분.
        if (response.data.success) {
          // 파일업로드 후 정상적으로 서버쪽에 요청되었다가 서버로부터 다시 받은 데이터가 출력되어야함.
          let newImages = [...Images, response.data.filePath]; //useState 상에 images들을 모두 Images에 저장한다는 문법. 그리고 2번째 인자와도 합침
          setImages(newImages); // 최종 합쳐진 데이터들을 Images에 저장
          //console.log("넘기기직전 이미지:" + Images + "합친 newImages : " + newImages)
          props.refreshFunction(newImages); //부모쪽(UploadProductPage)에 전달. 향후 취합 위함
        } else {
          alert('파일을 저장하는데 실패했습니다');
        }
      });
  };

  const deleteHandler = (image) => {
    const currentIndex = Images.indexOf(image); //현재 눌러진 image 자기자신의 인덱스를 찾아 저장하고
    console.log('currentIndex', currentIndex);

    let newImages = [...Images]; //지금까지 이미지들을 newImages에 다시 저장한후(temp용도)
    console.log('삭제하기전 배열상태 :' + newImages);
    newImages.splice(currentIndex, 1); // =>   newImages array 에서 첫번째 인자(눌러진 이미지)에서부터 두번째 인자 개수만큼 지워준다.
    setImages(newImages);

    props.refreshFunction(newImages); //부모쪽(UploadProductPage)에 전달. 향후 취합 위함
  };

  return (
    <div className="wrap__dropzone">
      <Dropzone onDrop={dropHandler}>
        {({ getRootProps, getInputProps }) => (
          <div className="dropzone_control" {...getRootProps()}>
            <input {...getInputProps()} />
            <Icon className="icon-plus" type="plus"></Icon>
          </div>
        )}
      </Dropzone>

      <div className="dropzone-img-section">
        {Images.map((image, index) => (
          <div onClick={() => deleteHandler(image)} key={index}>
            <img
              className="dropzone-img-control"
              src={`http://localhost:9020/${image}`}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export default FileUpload;
