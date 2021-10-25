import React from 'react';
import './HistoryPage.css';

function HistoryPage(props) {
  return (
    <div className="history-page-container">
      {/* <div style={{ display: 'flex', justifyContent: 'center' }}>
                <h1>History</h1>
            </div>
            <br /> */}
      <div className="history-page-main">
        <div>
          <table width="70%" align="center">
            <thead className="history-page-main-head">
              <tr>
                <th>구매 상품</th>
                <th>가격</th>
                <th>수량</th>
                <th>구매 날짜</th>
              </tr>
            </thead>
            <tbody className="history-page-main-body">
              {props.user.userData &&
                props.user.userData.history.map((item) => (
                  <tr key={item.id}>
                    <td>{item.name}</td>
                    <td>{item.price}원</td>
                    <td>{item.quantity}</td>
                    <td>{item.dateOfPurchase}</td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default HistoryPage;
