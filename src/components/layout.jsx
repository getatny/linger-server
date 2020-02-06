import React from 'react'
import { Layout, Menu } from 'antd'
import { withRouter } from 'react-router'
import { useHistory } from 'react-router-dom'
import '../styles/layout.less'

const { Header, Content, Footer } = Layout

const menus = [
    { id: 'music', label: '单曲', link: '/music' },
    { id: 'musicList', label: '歌单', link: '/music-list' }
]

const LayoutComponent = (props) => {
    const history = useHistory()
    const selectedMenu = menus.filter(item => props.location.pathname === item.link).map(item => item.id)

    const pushPathToHistory = (key) => {
        const item = menus.find(item => item.id === key)
        history.push(item.link)
    }

    return (
        <Layout id='main-layout'>
            <Header>
                <div className="logo" />
                <Menu theme='dark' mode='horizontal' style={{ lineHeight: '64px' }} selectedKeys={selectedMenu} onClick={({key}) => pushPathToHistory(key)}>
                    {menus.map(menu => (
                        <Menu.Item key={menu.id} title={menu.label}>{menu.label}</Menu.Item>
                    ))}
                </Menu>
            </Header>

            <Content style={{ padding: '24px 50px', minHeight: 'calc(100vh - 64px)' }}>
                {props.children}
                <Footer style={{ textAlign: 'center' }}>Linger ©2020 Created by Matthew Wang</Footer>
            </Content>
        </Layout>
    )
}

export default withRouter(LayoutComponent)
