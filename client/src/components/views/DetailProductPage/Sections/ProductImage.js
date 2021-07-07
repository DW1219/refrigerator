import React, { useEffect, useState } from 'react'
import ImageGallery from 'react-image-gallery';

function ProductImage(props) {    //  props 에 들어올 데이터는 <ProductImage detail={Product} />

    const [Images, setImages] = useState([])

    useEffect(() => {
        if (props.detail.images && props.detail.images.length > 0) {   //image 안에 데이터가 하나라도 있으면
            let images = []                                  //임시배열

            props.detail.images.map(item => {               //map을 이용하여 역시 아이템들을 임시배열에 push해서 저장한다.
                images.push({
                    original: `https://safe-anchorage-40147.herokuapp.com/${item}`,
                    thumbnail: `https://safe-anchorage-40147.herokuapp.com/${item}`
                })
            })
            setImages(images)                             //Images 전역 변수(useState)에 저장
        }
        console.log("useEffect Lifecycle load 횟수 체크중")
    }, [props.detail])                                   //[] 안에 값이 업데이트 될때 한번더 useEffect Hook(lifecycle)을 실행되게 하려면 이렇게


    return (
        <div>
            <ImageGallery items={Images} />
        </div>
    )
}

export default ProductImage
