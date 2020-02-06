import React from 'react';
import ReactDOM from 'react-dom';
import { HashRouter, Route, Redirect, Switch } from 'react-router-dom'
import { Provider, useDispatch, useSelector } from 'react-redux'
import Store from './store'
import { login } from "./store/actions"
import * as serviceWorker from './serviceWorker';
import Music from './pages/music'
import Login from './pages/login'

const PrivateRoute = ({ component: Component, isLogin, ...rest }) => {
    return (
        <Route {...rest} render={props => (
            isLogin ? (<Component {...props} />) : (<Redirect to={{
                pathname: '/login',
                state: { from: props.location }
            }} />)
        )} />
    )
}

const HideRoute = ({ component: Component, isLogin, ...rest }) => {
    return (
        <Route {...rest} render={props => (
            isLogin ? (<Redirect to={{
                pathname: '/',
                state: { from: props.location }
            }} />) : (<Component {...props} />)
        )} />
    )
}

function App() {
    let isLogin = useSelector(state => state.Auth.isLogin)
    const localLoginInfo = JSON.parse(localStorage.getItem('linger-admin-user'))
    const sessionLoginInfo = JSON.parse(sessionStorage.getItem('linger-admin-user'))
    const tokenExpire = localStorage.getItem('linger-admin-token-exp') || sessionStorage.getItem('cota_admin_token_exp')

    const dispatch = useDispatch()

    if (!isLogin) {
        const nowTime = new Date().getTime()
        if ((localLoginInfo && ((nowTime - tokenExpire) <= 60000 * 60 * 24 * 7)) || (sessionLoginInfo && ((nowTime - tokenExpire) <= 60000 * 60 * 24))) {
            dispatch(login(localLoginInfo || sessionLoginInfo))
            isLogin = true
        }
    }

    return (
        <HashRouter>
            <Switch>
                <PrivateRoute exact path='/' component={Music} isLogin={isLogin} />
                <HideRoute exact path='/login' component={Login} isLogin={isLogin} />
            </Switch>
        </HashRouter>
    )
}

ReactDOM.render(
    <Provider store={Store}>
        <App />
    </Provider>,
    document.getElementById('root')
)

serviceWorker.unregister();
