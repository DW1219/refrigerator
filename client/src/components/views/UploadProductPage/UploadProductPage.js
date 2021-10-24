import React, { useState } from 'react'
import { Typography, Form, Input } from 'antd';
import FileUpload from '../../utils/FileUpload';
import Axios from 'axios';
import { Button } from "@material-ui/core"
import { Col, Row } from 'antd';
import './UploadProductPage.css'
import btnUpload from '../../../images/btn_upload.png'

const { Title } = Typography;
const { TextArea } = Input;

function UploadProductPage(props) {

    const [TitleName, setTitleName] = useState("")
    const [Description, setDescription] = useState("")
    const [Price, setPrice] = useState(0)
    const [Images, setImages] = useState([])

    const titleNameChangeHandler = (event) => {    //람다식 표현, 함수하나 만들어준거
        setTitleName(event.currentTarget.value)
    }
    const descriptionChangeHandler = (event) => {    //설명
        setDescription(event.currentTarget.value)
    }
    const priceChangeHandler = (event) => {    //가격
        setPrice(event.currentTarget.value)
    }

    const updateImages = (newImages) => {
        console.log("넘어온 이미지 : " + newImages)
        setImages(newImages)
    }

    const submitHandler = (event) => {
        console.log("정상동작중");
        event.preventDefault();                 // 확인버튼 눌렀을때 자동적으로 page가 refresh 되지 않게 막아줌

        if (!TitleName || !Description || !Price || !Images) {    // 모든 입력칸 중 단 하나라도 채워지지 않았을 경우엔 방지
            return alert(" 모든 정보를 입력해 주세요")
        }

        const body = {
            //로그인 된 사람의 ID
            writer: props.user.userData._id,
            title: TitleName,
            description: Description,
            price: Price,
            images: Images,
        }

        //서버에 채운 값들을 request로 보낸다.
        Axios.post("/api/product", body)
            .then(response => {
                if (response.data.success) {
                    alert('상품 업로드 성공')
                    // 이 이후에 최초 메인페이지로 이동하게 하고 싶을때
                    props.history.push('/')
                } else {
                    alert('상품 업로드 실패')
                }
            })

    }


    return (
        <div className="wrap__totalUploadPage">
            <div className="wrap__titleUploadPage">
                <Title level={1}>음식 올리기</Title>
            </div>
            <br />
            <br />
            <Form onSubmit={submitHandler}>
                {/* DropZone */}
                <FileUpload refreshFunction={updateImages} />
                <br />
                <br />
                <label className="label_format">식품명</label>
                <Input onChange={titleNameChangeHandler} value={TitleName} />
                <br />
                <br />
                <label>설명</label>
                <TextArea onChange={descriptionChangeHandler} value={Description} />
                <br />
                <br />
                <label>가격(원)</label>
                <Input type="number" onChange={priceChangeHandler} value={Price} />
                <br />
                <br />
                <br />
                <br />
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                  <input type="image" className="btn_upload" src={btnUpload} alt="Submit button"/>
                 
                    
                </div>
            </Form>
        </div>
    )
}

export default UploadProductPage
