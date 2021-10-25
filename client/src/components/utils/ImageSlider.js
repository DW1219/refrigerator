import { Carousel } from 'antd';
import React from 'react';
import './ImageSlider.css';

function ImageSlider(props) {
  //console.log(props)
  return (
    <div>
      <Carousel autoplay className="card-images-layout">
        {props.images.map((image, index) => (
          <div key={index}>
            <img
              className="card-images"
              src={`http://localhost:5000/${image}`}
            />
          </div>
        ))}
      </Carousel>
    </div>
  );
}

export default ImageSlider;
