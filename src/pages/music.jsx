import React, { useState, useEffect, useRef } from 'react'
import LayoutComponent from "../components/layout"
import { PageHeader, Table, Button, Popconfirm, message, Modal, Form, Row, Col, Input, Spin } from 'antd'
import http from '../utils/http'
import config from '../config'
import defaultCover from '../static/default-cover.png'

const { Item } = Form

const MusicInfoForm = Form.create({ name: 'music-info' })((props) => {

    const { getFieldDecorator } = props.form

    const [ musicCover, setMusicCover ] = useState(null)

    const onFormSubmit = e => {
        e.preventDefault()
        props.form.validateFields((err, values) => {
            if (!err) {
                const { id } = props.info
                const { title, singer, cover, playUrl } = values

                let response = null
                let isEdit = false
                
                if (id) {
                    response = http.put(`${config.server}/rest/admin/music`, { id, title, singer, cover, playUrl })
                    isEdit = true
                } else {
                    response = http.post(`${config.server}/rest/admin/music`, { title, singer, cover, playUrl })
                }

                response.then(res => {
                    isEdit ? props.onUpdateSuccess({ ...values, id }) : props.onUpdateSuccess(res)
                }).catch(err => {
                    console.log(err)
                    props.onUpdateFailed()
                })
            }
        })
    }

    let timer = null

    const onMusicCoverChanged = e => {
        if (timer) {
            clearTimeout(timer)
        }

        const cover = e.target.value
        timer = setTimeout(() => {
            setMusicCover(cover)
        }, 500)
    }

    useEffect(() => {
        const { title, singer, cover, playUrl } = props.info

        props.form.setFieldsValue({ title, singer, cover, playUrl })
    }, [props.info])

    return <Form className='music-info-form' onSubmit={onFormSubmit}>
        <Row gutter={24}>
            <Col lg={8}>
                <img src={musicCover || props.info.cover || defaultCover} alt='cover' style={{ width: '100%' }} />
            </Col>
            <Col lg={16}>
                <Item label='歌曲名'>
                    {getFieldDecorator('title', {
                        rules: [{ required: true, message: '歌曲名称不能为空！' }]
                    })(
                        <Input />
                    )}
                </Item>
                <Item label='歌曲封面'>
                    {getFieldDecorator('cover', {
                        rules: [{ required: true, message: '歌曲封面不能为空！' }]
                    })(
                        <Input onChange={onMusicCoverChanged} />
                    )}
                </Item>
                <Item label='歌手'>
                    {getFieldDecorator('singer', {
                        rules: [{ required: true, message: '歌手不能为空！' }]
                    })(
                        <Input />
                    )}
                </Item>
                <Item label='播放地址'>
                    {getFieldDecorator('playUrl', {
                        rules: [{ required: true, message: '播放地址不能为空！' }]
                    })(
                        <Input />
                    )}
                </Item>
            </Col>
        </Row>
        <div className='btns' style={{ display: 'flow-root' }}>
            <Button style={{ float: 'right' }} onClick={props.onCancel}>取消</Button>
            <Button type='primary' style={{ marginRight: 10, float: 'right' }} htmlType='submit'>提交</Button>
        </div>
    </Form>

})

const Music = () => {

    const [ musicData, setMusicData ] = useState(null)
    const [ editObject, setEditObject ] = useState({})
    const [ addingRecord, setAddingRecordStatus ] = useState(false)
    const [ edittingRecord, setedittingRecordStatus ] = useState(false)
    const [ selectedData, setSelectedData ] = useState([])
    const [ musicPlayerInfo, setMusicPlayerInfo ] = useState({ key: 0, status: false })

    const musicPlayer = useRef()

    const onDeleteConfirm = (id) => {
        http.post(`${config.server}/rest/admin/musics/delete`, {
            list: [id]
        }).then(() => {
            message.success('删除单曲成功！')
            setMusicData(musicData.filter(item => item.id !== id))
        }).catch(err => {
            console.log(err)
            message.error('删除单曲失败！')
        })
    }

    const closeModal = () => {
        setedittingRecordStatus(false)
        setAddingRecordStatus(false)
    }

    const onUpdateSuccess = (res) => {
        setAddingRecordStatus(false)
        setedittingRecordStatus(false)

        if (addingRecord) {
            message.success('添加单曲成功！')
            setMusicData(musicData.unshift(res))
        } else if (edittingRecord) {
            message.success('修改歌曲信息成功！')
            setMusicData(musicData.map(item => {
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
            message.error('添加单曲失败！')
        } else if (edittingRecord) {
            message.error('修改歌曲信息失败！')
        }
    }

    const onMusicEdit = (record) => {
        setEditObject(record)
        setedittingRecordStatus(true)
    }

    const onPlayButtonClicked = (url, key) => {
        if (musicPlayerInfo.key === key) {
            if (musicPlayerInfo.status) {
                // 暂停音乐
                musicPlayer.current.pause()
                setMusicPlayerInfo({ ...musicPlayerInfo, status: false })
            } else {
                musicPlayer.current.pause()
                musicPlayer.current.src = url
                musicPlayer.current.play()
                setMusicPlayerInfo({ key, status: true })
            }
        } else {
            musicPlayer.current.pause()
            musicPlayer.current.src = url
            musicPlayer.current.play()
            setMusicPlayerInfo({ key, status: true })
        }
    }

    const columns = [
        { title: 'id', dataIndex: 'id', key: 'id' },
        { title: '封面', dataIndex: 'cover', key: 'cover', render: (text, record) => (
            <img src={text} alt={`${record.title} - cover`} style={{ width: 60 }} />
        ) },
        { title: '歌曲名', dataIndex: 'title', key: 'title' },
        { title: '歌手', dataIndex: 'singer', key: 'singer' },
        { title: '播放地址', dataIndex: 'playUrl', key: 'playUrl', render: (url, record) => <Button icon={musicPlayerInfo.key === record.id && musicPlayerInfo.status ? 'pause-circle' : 'play-circle'} onClick={() => onPlayButtonClicked(url, record.id)}>{musicPlayerInfo.key === record.id && musicPlayerInfo.status ? '暂停' : '播放'}</Button> },
        { title: '操作', key: 'actions', render: (t, record) => (
            <>
                <Button type="primary" icon="edit" style={{ marginRight: 10 }} onClick={() => onMusicEdit(record)}>编辑</Button>
                <Popconfirm placement='top' title='确定删除？' onConfirm={() => onDeleteConfirm(record.id)} okText='确定' cancelText='取消'>
                    <Button type="danger" icon="delete">删除</Button>
                </Popconfirm>
            </>
        ) }
    ]

    const rowSelection = {
        onChange: (selectedRowKeys) => {
            setSelectedData(selectedRowKeys)
        }
    }

    useEffect(() => {
        http.get(`${config.server}/rest/admin/musics/1/15`).then(res => {
            setMusicData(res.musics)
        })
    }, [])

    return <LayoutComponent>
        <div id="music-page">
            <PageHeader style={{
                border: '1px solid rgb(235, 237, 240)',
                backgroundColor: '#fff',
                marginBottom: '24px'
            }} title="音乐列表" subTitle="单曲推荐列表，歌单包含的单曲不会显示在这里" />

            <div className="main-content">
                <Button type='primary' icon='plus' style={{ marginRight: 10, marginBottom: 20 }} onClick={() => setAddingRecordStatus(true)}>新增推荐单曲</Button>
                {selectedData.length > 0 ? <Popconfirm placement='top' title='确定删除所选单曲？' onConfirm={() => onDeleteConfirm(1)} okText='确定' cancelText='取消'>
                    <Button type="danger" icon="delete">批量删除</Button>
                </Popconfirm> : null}
                <Spin spinning={musicData === null}>
                    <Table columns={columns} dataSource={musicData} rowSelection={rowSelection} rowKey='id' />
                </Spin>
                <audio ref={musicPlayer} />
            </div>
        </div>

        <Modal title={addingRecord ? '新增单曲' : edittingRecord ? '编辑单曲' : ''} visible={addingRecord || edittingRecord} width={700} footer={null} onCancel={closeModal}>
            <MusicInfoForm info={editObject} onCancel={closeModal} onUpdateSuccess={onUpdateSuccess} onUpdateFailed={onUpdateFailed} />
        </Modal>
    </LayoutComponent>

}

export default Music
