import React from 'react'
import { Icon, Col, Card, Row, Carousel } from 'antd';
import './ImageSlider.css'

function ImageSlider(props) {
    //console.log(props)
    return (
        <div>
            <Carousel autoplay>
                {props.images.map((image, index) => (
                    <div key={index}>
                        <img className="card-images" src={`http://localhost:5000/${image}`} />
                    </div>
                ))}
            </Carousel>
        </div>
    )
}

export default ImageSlider
