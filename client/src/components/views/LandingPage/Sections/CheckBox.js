import { Checkbox, Collapse } from 'antd';
import React, { useState } from 'react';
import './CheckBox.css';

const { Panel } = Collapse;

function CheckBox(props) {
  const [Checked, setChecked] = useState([]);

  const handleToggle = (value) => {
    //넘어온 value는 props의 value로 Datas.js 의 regions의 id값이다. 해당 체크박스를 누르면 자기자신의 index와 value를 이용가능

    const currentIndex = Checked.indexOf(value); // 현재 Checked 안에 아무런 값이 없어서 새롭게 선택된 것들은 모두 currnetIndex 가 -1 찍힘을 이용

    const newChecked = [...Checked]; // 선택된 모든 index 통으로 저장할 변수선언  (최초엔 아무값도 없을것)

    if (currentIndex === -1) {
      // 새로운 체크박스가 선택된다면 배열에 저장
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1); // 기존선택된 체크박스를 한번더 누르면 제거함
    }
    setChecked(newChecked); // 선택된 것들만 Checked에 저장
    props.handleCommunication(newChecked); // 이것은 부모쪽에 정보 전달용(id가 전달됨)
    //즉 임시배열에 기존에 없으면 저장, 있으면 삭제 하고  아래 renderCheckboxLists 에서 이렇게 먼저 처리된 배열과 다시 검사를 해서 없으면 UI도 삭제시키는 방법으로 구현

    // console.log("value : " + value + " currentIndex : " + currentIndex + " newChecked : " + newChecked + " Checked : " + Checked)
  };

  const renderCheckboxLists = () =>
    props.list &&
    props.list.map((value, index) => (
      <React.Fragment key={index}>
        <Checkbox
          onChange={() => handleToggle(value._id)}
          checked={Checked.indexOf(value._id) === -1 ? false : true}
        />
        <span>{value.name}</span>
      </React.Fragment>
    ));

  return (
    <div>
      <Collapse defaultActiveKey={['0']}>
        <Panel className="panel_filter_checkbox" header="지역 필터" key="1">
          {renderCheckboxLists()}
        </Panel>
      </Collapse>
    </div>
  );
}

export default CheckBox;
