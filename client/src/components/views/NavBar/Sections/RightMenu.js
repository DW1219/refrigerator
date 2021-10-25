/* eslint-disable jsx-a11y/anchor-is-valid */
import { Badge, Icon, Menu } from 'antd';
import axios from 'axios';
import React from 'react';
import { useSelector } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { USER_SERVER } from '../../../Config';
import './Navbar.css';

function RightMenu(props) {
  const user = useSelector((state) => state.user);

  const logoutHandler = () => {
    axios.get(`${USER_SERVER}/logout`).then((response) => {
      if (response.status === 200) {
        props.history.push('/login');
      } else {
        alert('Log Out Failed');
      }
    });
  };

<<<<<<< HEAD
  if (user.userData && !user.userData.isAuth) { // login 하기전 유저들에게 보여지는 화면
    console.log("user.userData : ",user.userData)
    console.log("user.userData.isAuth : ",user.userData.isAuth)
=======
  if (user.userData && !user.userData.isAuth) {
    // login 하기전 유저들에게 보여지는 화면
>>>>>>> 6dc85ce1763761a256216d004c6cd72e70a9c0bb
    return (
      <Menu className="menu__beforeLogin" mode={props.mode}>
        <Menu.Item key="mail">
          <a href="/login">로그인</a>
        </Menu.Item>
        <Menu.Item key="app">
          <a href="/register">회원가입</a>
        </Menu.Item>
      </Menu>
<<<<<<< HEAD
    )
  } else {   // login 이후에 유저들에게 보여지는 화면
    console.log("user.userData : ",user.userData)
=======
    );
  } else {
    // login 이후에 유저들에게 보여지는 화면
>>>>>>> 6dc85ce1763761a256216d004c6cd72e70a9c0bb
    return (
      <Menu mode={props.mode}>
        <Menu.Item key="history">
          <a href="/history">구매이력</a>
        </Menu.Item>

        <Menu.Item key="upload">
          <a href="/product/upload">음식올리기</a>
        </Menu.Item>

        <Menu.Item key="cart">
          <Badge
            className="cartBadge"
            count={user.userData && user.userData.cart.length}
            style={{ marginRight: 30, marginTop: 5 }}
          >
            <a
              href="/user/cart"
              className="head-example"
              style={{ marginRight: -10, color: '#667777' }}
            >
              <Icon
                type="shopping-cart"
                style={{ fontSize: 35, marginBottom: 1, color: '#6e2050' }}
              />
            </a>
          </Badge>
        </Menu.Item>

        <Menu.Item key="logout">
          <a onClick={logoutHandler}>Logout</a>
        </Menu.Item>
      </Menu>
    );
  }
}

export default withRouter(RightMenu);
