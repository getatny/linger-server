import React, { useState, useEffect } from 'react'
import LayoutComponent from "../components/layout"
import { PageHeader, Table, Button, Popconfirm, message, Modal, Form, Row, Col, Input, Spin, Tabs, Tag, Typography } from 'antd'
import http from '../utils/http'
import config from '../config'
import defaultCover from '../static/default-cover.png'
import MusicListGenerator from '../components/musicListGenerator'

const { Item } = Form
const { TabPane } = Tabs
const { Paragraph } = Typography

const MusicListInfoForm = Form.create({ name: 'music-list-info' })((props) => {

    const { getFieldDecorator } = props.form

    const [ musicListCover, setMusicListCover ] = useState(null)
    const [ musicList, setMusicList ] = useState([])

    const onFormSubmit = e => {
        e.preventDefault()
        props.form.validateFields((err, values) => {
            if (!err) {
                const { id } = props.info
                const { title, description, author, tag, cover } = values

                let response = null
                let isEdit = false
                
                if (id) {
                    response = http.put(`${config.server}/rest/admin/musicList`, { id, title, description, author, tag, cover, list: musicList })
                    isEdit = true
                } else {
                    response = http.post(`${config.server}/rest/admin/musicList`, { title, description, author, tag, cover, list: musicList })
                }

                response.then(res => {
                    const list = musicList.map(music => {
                        if (music.action) {
                            delete music.action
                        }
                        return music
                    })
                    isEdit ? props.onUpdateSuccess({ ...values, id, music: list }) : props.onUpdateSuccess(res)
                }).catch(err => {
                    console.log(err)
                    props.onUpdateFailed()
                })
            }
        })
    }

    let timer = null

    const onMusicListCoverChanged = e => {
        if (timer) {
            clearTimeout(timer)
        }

        const cover = e.target.value
        timer = setTimeout(() => {
            setMusicListCover(cover)
        }, 500)
    }

    const onMusicListChanged = (list) => {
        setMusicList(list)
    }

    useEffect(() => {
        const { title, description, author, tag, cover, music } = props.info

        props.form.setFieldsValue({ title, description, author, tag, cover })
        music ? setMusicList(music) : setMusicList([])
    }, [props.info])

    return <Form className='music-list-info-form' onSubmit={onFormSubmit}>
        <Tabs type='card'>
            <TabPane tab='歌单信息' key='music-list-info'>
                <Row gutter={24}>
                    <Col lg={8}>
                        <img src={musicListCover || props.info.cover || defaultCover} alt='cover' style={{ width: '100%' }} />
                    </Col>
                    <Col lg={16}>
                        <Item label='歌单名称'>
                            {getFieldDecorator('title', {
                                rules: [{ required: true, message: '歌单名称不能为空！' }]
                            })(
                                <Input />
                            )}
                        </Item>
                        <Item label='歌单封面'>
                            {getFieldDecorator('cover', {
                                rules: [{ required: true, message: '歌单封面不能为空！' }]
                            })(
                                <Input onChange={onMusicListCoverChanged} />
                            )}
                        </Item>
                        <Item label='歌单作者'>
                            {getFieldDecorator('author', {
                                rules: [{ required: true, message: '作者不能为空！' }]
                            })(
                                <Input />
                            )}
                        </Item>
                        <Item label='歌单标签'>
                            {getFieldDecorator('tag', {
                                rules: [{ required: true, message: '标签不能为空！' }]
                            })(
                                <Input />
                            )}
                        </Item>
                        <Item label='歌单描述'>
                            {getFieldDecorator('description', {
                                rules: [{ required: true, message: '歌单描述不能为空！' }]
                            })(
                                <Input.TextArea />
                            )}
                        </Item>
                    </Col>
                </Row>
            </TabPane>
            <TabPane tab='歌单歌曲' key="music-list-detail">
                <MusicListGenerator musics={musicList} onMusicListChanged={onMusicListChanged} />
            </TabPane>
        </Tabs>
        <div className='btns' style={{ display: 'flow-root' }}>
            <Button style={{ float: 'right' }} onClick={props.onCancel}>取消</Button>
            <Button type='primary' style={{ marginRight: 10, float: 'right' }} htmlType='submit'>提交</Button>
        </div>
    </Form>

})

const MusicList = () => {

    const [ musicListData, setMusicListData ] = useState(null)
    const [ musicListDataCount, setMusicListDataCount ] = useState(0)
    const [ editObject, setEditObject ] = useState({})
    const [ addingRecord, setAddingRecordStatus ] = useState(false)
    const [ edittingRecord, setedittingRecordStatus ] = useState(false)
    const [ selectedData, setSelectedData ] = useState([])

    const closeModal = () => {
        setedittingRecordStatus(false)
        setAddingRecordStatus(false)
    }

    const onMusicListEdit = (record) => {
        setEditObject(record)
        setedittingRecordStatus(true)
    }

    const onDeleteConfirm = (id) => {
        http.post(`${config.server}/rest/admin/musicList/delete`, {
            list: [id]
        }).then(() => {
            message.success('删除歌单成功！')
            setMusicListData(musicListData.filter(item => item.id !== id))
        }).catch(err => {
            console.log(err)
            message.error('删除歌单失败！')
        })
    }

    const onUpdateSuccess = (res) => {
        setAddingRecordStatus(false)
        setedittingRecordStatus(false)

        if (addingRecord) {
            message.success('添加歌单成功！')
            musicListData.unshift(res)
            setMusicListData(musicListData)
        } else if (edittingRecord) {
            message.success('修改歌单内容成功！')
            setMusicListData(musicListData.map(item => {
                if (item.id === res.id) {
                    return {
                        ...item,
                        ...res
                    }
                } else {
                    return item
                }
            }))
        }
    }

    const onUpdateFailed = () => {
        if (addingRecord) {
            message.error('添加歌单失败！')
        } else if (edittingRecord) {
            message.error('修改歌单内容失败！')
        }
    }

    const columns = [
        { title: 'id', dataIndex: 'id', key: 'id', width: 50 },
        { title: '封面', dataIndex: 'cover', key: 'cover', render: (text, record) => (
            <img src={text} alt={`${record.title} - cover`} style={{ width: 60 }} />
        ), width: 120 },
        { title: '歌单名称', dataIndex: 'title', key: 'title', width: 200 },
        { title: '作者', dataIndex: 'author', key: 'author', width: 120 },
        { title: '标签', dataIndex: 'tag', key: 'tag', render: tag => (<Tag color='#2db7f5'>{tag}</Tag>), width: 80 },
        { title: '文章描述', dataIndex: 'description', key: 'description', ellipsis: true },
        { title: '操作', key: 'actions', render: (t, record) => (
            <>
                <Button type="primary" icon="edit" style={{ marginRight: 10 }} onClick={() => onMusicListEdit(record)}>编辑</Button>
                <Popconfirm placement='top' title='确定删除？' onConfirm={() => onDeleteConfirm(record.id)} okText='确定' cancelText='取消'>
                    <Button type="danger" icon="delete">删除</Button>
                </Popconfirm>
            </>
        ), width: 250 }
    ]

    const rowSelection = {
        onChange: (selectedRowKeys) => {
            setSelectedData(selectedRowKeys)
        }
    }

    useEffect(() => {
        http.get(`${config.server}/rest/admin/musicLists/1/15`).then(res => {
            setMusicListData(res.musicLists)
            setMusicListDataCount(res.count)
        })
    }, [])
    
    return <LayoutComponent>
        <div id="music-list-page">
            <PageHeader style={{
                border: '1px solid rgb(235, 237, 240)',
                backgroundColor: '#fff',
                marginBottom: '24px'
            }} title="歌单列表" subTitle="新增、编辑歌单" />

            <div className="main-content">
                <Button type='primary' icon='plus' style={{ marginRight: 10, marginBottom: 20 }} onClick={() => { setAddingRecordStatus(true); setEditObject({}) }}>新增歌单</Button>
                {selectedData.length > 0 ? <Popconfirm placement='top' title='确定删除所选歌单？' onConfirm={() => onDeleteConfirm(1)} okText='确定' cancelText='取消'>
                    <Button type="danger" icon="delete">批量删除</Button>
                </Popconfirm> : null}
                <Spin spinning={musicListData === null}>
                    <Table columns={columns} dataSource={musicListData} rowSelection={rowSelection} rowKey='id' pagination={{ pageSize: 15, total: musicListDataCount, hideOnSinglePage: true }} />
                </Spin>
            </div>
        </div>

        <Modal title={addingRecord ? '新增歌单' : edittingRecord ? '编辑歌单' : ''} visible={addingRecord || edittingRecord} width='70%' footer={null} onCancel={closeModal}>
            <MusicListInfoForm info={editObject} onCancel={closeModal} onUpdateSuccess={onUpdateSuccess} onUpdateFailed={onUpdateFailed} />
        </Modal>
    </LayoutComponent>
}

export default MusicList
