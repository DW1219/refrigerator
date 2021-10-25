import { Carousel } from 'antd';
import React from 'react';
import './ImageSlider.css';

function ImageSlider(props) {
<<<<<<< HEAD
    //console.log(props)
    return (
        <div>
            <Carousel autoplay>
                {props.images.map((image, index) => (
                    <div key={index}>
                        <img className="card-images" src={`http://localhost:9020/${image}`} />
                    </div>
                ))}
            </Carousel>
        </div>
    )
=======
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
>>>>>>> 6dc85ce1763761a256216d004c6cd72e70a9c0bb
}

export default ImageSlider;
