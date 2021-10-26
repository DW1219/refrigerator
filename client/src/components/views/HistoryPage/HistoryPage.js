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
          <table>
            <thead className="history-page-main-head">
              <tr>
                <th className="history-page-main-head-title">주문 음식</th>
                <th className="history-page-main-head-title">가격</th>
                <th className="history-page-main-head-title">수량</th>
                <th className="history-page-main-head-title">주문 날짜</th>
              </tr>
            </thead>
            <tbody className="history-page-main-body">
              {props.user.userData &&
                props.user.userData.history.map((item) => (
                  <tr key={item.id}>
                    <td className="history-page-main-body-name">{item.name}</td>
                    <td className="history-page-main-body-price">
                      {item.price}원
                    </td>
                    <td className="history-page-main-body-quantity">
                      {item.quantity}
                    </td>
                    <td className="history-page-main-body-dateOfPurchase">
                      {item.dateOfPurchase}
                    </td>
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
