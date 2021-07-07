import React, { useState } from 'react'
import { Collapse, Radio } from 'antd';
const { Panel } = Collapse;

function RadioBox(props) {

    const [Value, setValue] = useState(0)

    //const renderRadioboxLists = () => props.list && props.list.map((value, index) => (    checkbox와 동일하게 해도되지만 이번엔 다른방식
    const renderRadioboxLists = () =>
        props.list && props.list.map(value => (
            <Radio key={value._id} value={value._id}> {value.name} </Radio>
        ))



    const handleChange = (event) => {
        setValue(event.target.value)                             //클릭된 자기자신의 값을 표현하는 문법은 event.target.value (tag생성시 위에서 value에는 id를 넣어줬음)
        props.handleCommunication(event.target.value)            //마찬가지 부모쪽으로 넘겨줌(id값)
    }

    return (
        <div>
            <Collapse defaultActiveKey={['0']} >
                <Panel header="가격 필터" key="1">

                    <Radio.Group onChange={handleChange} value={Value}>
                        {renderRadioboxLists()}
                    </Radio.Group>

                </Panel>
            </Collapse>
        </div>
    )
}

export default RadioBox
