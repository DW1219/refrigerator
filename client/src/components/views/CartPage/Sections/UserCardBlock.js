import React from 'react'
import "./UserCardBlock.css"
import { Button } from "@material-ui/core"

function UserCardBlock(props) {
    //console.log(props)
    //console.log(props.products)

    const renderCartImage = (images) => {
        if (images.length > 0) {
            let image = images[0]
            return `http://localhost:5000/${image}`
        }
    }

    //신기하게도 props 찍어보면 products 안에 정보가 다들어가있음
    const renderItems = () => (
        props.products && props.products.map((product, index) => (
            <tr key={index}>
                <td>
                    <img style={{ width: '70px' }} alt="product"
                        src={renderCartImage(product.images)} />
                    <span>&nbsp;&nbsp;{product.title}</span>
                </td>
                <td>
                    {product.quantity} EA
                </td>
                <td>
                    {product.price}원
                </td>
                <td>
                    <Button variant="contained" color="primary" onClick={() => props.removeItem(product._id)}>
                        Remove
                    </Button>
                </td>
            </tr>
        ))
    )

    return (
        <div>
            <div>
                <table>
                    <thead>
                        <tr>
                            <th>상품</th>
                            <th>상품 수량</th>
                            <th>상품 가격</th>
                            <th>비고</th>
                        </tr>
                    </thead>
                    <tbody>
                        {renderItems()}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default UserCardBlock
