import React, { useState } from 'react';
import { Form, Icon, Input, Checkbox, Button, message } from 'antd';
import { useDispatch } from "react-redux";
import { login as loginEvent } from '../store/actions'
import http from '../utils/http'
import Config from '../config'
import '../styles/login.less'
import Logo from '../static/logo-black.png'

const Password = Input.Password

const Login = (props) => {
    const dispatch = useDispatch()
    const [ logining, setLogining ] = useState(false)
    const { getFieldDecorator } = props.form

    const login = ({ username, password, remember }) => {
        return http.post(`${Config.server}/rest/admin/login`, { username, password, remember })
    }

    // handle the event of submit.
    const handleSubmit = e => {
        e.preventDefault()
        props.form.validateFields((err, values) => {
            if (!err) {
                setLogining(true)
                login(values).then(res => {
                    if (values.remember) {
                        localStorage.setItem('linger-admin-user', JSON.stringify({
                            id: res.user.id,
                            username: res.user.username,
                            nickname: res.user.nickname,
                            token: res.token
                        }))
                        localStorage.setItem('linger-admin-token-exp', String(new Date().getTime()))
                    } else {
                        sessionStorage.setItem('linger-admin-user', JSON.stringify({
                            id: res.id,
                            username: res.username,
                            token: res.token
                        }))
                        sessionStorage.setItem('linger-admin-token-exp', String(new Date().getTime()))
                    }

                    dispatch(loginEvent({ username: res.username, nickname: res.nickname, email: res.email }))
                    props.history.push('/')
                }).catch(e => {
                    console.log(e)
                    setLogining(false)
                    message.error('Login failed.')
                })
            }
        })
    }

    return (
        <div className="login-page">
            <div className="login-form">
                <div className="logo">
                    <img src={Logo} alt='logo' />
                </div>
                <Form className="login-form-input" onSubmit={handleSubmit}>
                    <Form.Item>
                        {getFieldDecorator('username', {
                            rules: [{ required: true, message: '用户名不能为空！' }],
                        })(<Input size='large' prefix={<Icon type="user" />} placeholder='请输入用户名' />)}
                    </Form.Item>
                    <Form.Item>
                        {getFieldDecorator('password', {
                            rules: [{ required: true, message: '密码不能为空！' }],
                        })(<Password size='large' prefix={<Icon type="lock" />} placeholder='请输入密码' />)}
                    </Form.Item>
                    <Form.Item>
                        {getFieldDecorator('remember', {
                            valuePropName: 'checked',
                            initialValue: true,
                        })(<Checkbox>7天内免登陆</Checkbox>)}
                    </Form.Item>
                    <Form.Item>
                        <Button loading={logining} size='large' type="primary" htmlType="submit" className="login-form-button">
                          登录
                        </Button>
                    </Form.Item>
                </Form>
            </div>
        </div>
    )
}

export default Form.create({ name: 'loginForm' })(Login);
