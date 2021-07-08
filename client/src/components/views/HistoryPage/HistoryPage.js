import React from 'react'


function HistoryPage(props) {

    return (
        <div style={{ width: '80%', margin: '3rem auto' }}>
            <div style={{ display: 'flex', justifyContent: 'center' }}>
                <h1>History</h1>
            </div>
            <br />
            <div style={{ display: 'flex', justifyContent: 'center' }}>
                <div>
                    <table width="70%" align="center">
                        <thead>
                            <tr>
                                <th>구매번호</th>
                                <th>가격</th>
                                <th>수량</th>
                                <th>구매날짜</th>
                            </tr>
                        </thead>
                        <tbody>
                            {props.user.userData && props.user.userData.history.map(item => (
                                <tr key={item.id}>
                                    <td>{item.id}</td>
                                    <td>{item.price}원</td>
                                    <td>{item.quantity}</td>
                                    <td>{item.dateOfPurchase}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div >
    )
}

export default HistoryPage
