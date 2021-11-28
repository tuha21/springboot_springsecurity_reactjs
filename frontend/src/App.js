import React, { Component } from 'react'
import { BrowserRouter as Router, Redirect, Route } from 'react-router-dom'
import Cart from './components/guest/Cart'
import CheckOut from './components/guest/CheckOut'
import Collection from './components/guest/Collection'
import Home from './components/guest/Home'
import Login from './components/guest/Login'
import NavBot from './components/guest/NavBot'
import NavTop from './components/guest/NavTop'
import ProductDetail from './components/guest/ProductDetail'
import Dashboard from './components/staff/Dashboard'
import MyOrders from "./components/guest/MyOrders";
import { connect } from "react-redux";
import * as action from "./actions/index"

class App extends Component {

  constructor(props) {
    super(props);
  }

  componentDidMount = () => {
    this.getProfile();
  }

  isAdmin = (roles) => {
    if (roles && roles.includes(1)) {
      return true;
    }
    else return false
  }

  isStaff = (roles) => {
    if (roles && roles.includes(2)) {
      return true;
    }
    else return false
  }


  getProfile = () => {
    if (localStorage.getItem('token')) {
      var myHeaders = new Headers();
      myHeaders.append("Authorization", "Bearer " + localStorage.getItem('token'));
      myHeaders.append("Cookie", "JSESSIONID=C6B69B1366935F0C4E7CCAC8732291BA");

      var requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow'
      };

      fetch("http://localhost:8080/getProfile", requestOptions)
        .then(response => response.text())
        .then(result => {
          console.log(result)
          let user = JSON.parse(result)
          console.log("user", user);
          let auth = {
            id: user.id,
            username: user.username,
            password: user.password,
            fullname: user.fullName,
            email: user.email,
            photo: user.photo,
            roles: user.roles
          }
          this.props.setAuth(auth);
          this.props.setCart([]);
        })
        .catch(error => console.log('error', error));
    }
  }

  render() {

    let { auth } = this.props;
    return (
      <Router>
        <Route path="/mexxi">
          <NavTop isStaff={this.isStaff} isAdmin={this.isAdmin} auth={auth} />
          <Route exact path="/mexxi">
            <Home />
          </Route>
          <Route exact path="/mexxi/collection">
            <Collection />
          </Route>
          <Route exact path="/mexxi/productdetail">
            <ProductDetail />
          </Route>
          <Route exact path="/mexxi/cart">
            <Cart />
          </Route>
          <Route exact path="/mexxi/login">
            <Login setRole={this.setRole} />
          </Route>
          <Route exact path="/mexxi/checkout">
            {
              auth === null ? <Redirect to="/mexxi/login" /> : <CheckOut />
            }
          </Route>
          <Route exact path="/mexxi/myorder">
            {
              auth === null ? <Redirect to="/mexxi/login" /> : <MyOrders />
            }
          </Route>
          <NavBot />
        </Route>
        <Route path="/staff">
          {
            auth !== null && (this.isAdmin(auth.roles) || this.isStaff(auth.roles)) ? <Dashboard auth={this.props.auth} /> : <Redirect to="/mexxi/login" />
          }
        </Route>
      </Router>
    )
  }
}

const mapStateToProps = state => {
  return {
    auth: state.auth
  }
}

const mapDispatchToProps = dispatch => {
  return {
    setAuth: auth => {
      dispatch(action.setAuth(auth))
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(App)