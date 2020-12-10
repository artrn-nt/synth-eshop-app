import React from 'react'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import Layout from './components/Layout'
import ProductsScreen from './screens/ProductsScreen'
import ProductScreen from './screens/ProductScreen'
import InfoScreen from './screens/InfoScreen'
import LoginScreen from './screens/LoginScreen'
import RegisterScreen from './screens/RegisterScreen'
import UsersListScreen from './screens/UsersListScreen'
import UserEditScreen from './screens/UserEditScreen'
import ProfileScreen from './screens/ProfileScreen'
import CartScreen from './screens/CartScreen'
import ShippingInfoScreen from './screens/ShippingInfoScreen'
import PaymentMethodScreen from './screens/PaymentMethodScreen'
import PlaceOrderScreen from './screens/PlaceOrderScreen'
import OrderStatusScreen from './screens/OrderStatusScreen'
import NotFoundScreen from './screens/NotFoundScreen'
// import ContactScreen from './screens/ContactScreen'

const App = () => {

  return (
    <Router>
      <Layout>
        <Switch>
          <Route path='/login' component={LoginScreen} />
          <Route path='/register' component={RegisterScreen} />
          <Route path='/profile' component={ProfileScreen} />
          <Route path='/admin/userslist' component={UsersListScreen} />
          <Route path='/admin/user/:id/edit' component={UserEditScreen} />
          <Route path='/info' component={InfoScreen} />
          <Route path='/product/:id' component={ProductScreen} />
          <Route path='/cart/:id?' component={CartScreen} />
          <Route path='/shipping' component={ShippingInfoScreen} />
          <Route path='/payment' component={PaymentMethodScreen} />
          <Route path='/placeorder' component={PlaceOrderScreen} />
          <Route path='/orders/:id' component={OrderStatusScreen} />
          <Route path='/' component={ProductsScreen} exact />
          <Route path='*' component={NotFoundScreen} exact={true} />
        </Switch>
      </Layout>
    </Router>
  )
}

export default App