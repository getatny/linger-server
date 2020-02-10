import React, { useState, useEffect } from 'react'
import { Row, Col, Card, Icon, Form, Input, Button, message, Modal } from 'antd'
import '../styles/musicListGenerator.less'

const { Item } = Form

const MusicListGeneratorForm = Form.create({ name: 'music-list-generator-info' })((props) => {

    const { getFieldDecorator } = props.form

    const onFormSubmit = e => {
        e.preventDefault()
        e.stopPropagation()
        props.form.validateFields((err, values) => {
            if (!err) {
                const { id } = props.info

                let isEdit = false
                
                if (id) {
                    isEdit = true
                }

                isEdit ? props.onUpdateSuccess({ ...values, id, action: 'update' }) : props.onUpdateSuccess({ ...values, action: 'add' })
            }
        })
    }

    useEffect(() => {
        const { title, singer, cover, playUrl } = props.info

        props.form.setFieldsValue({ title, singer, cover, playUrl })
    }, [props.info])

    return <Form className='music-info-form' onSubmit={onFormSubmit}>
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
                <Input />
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
        <div className='btns' style={{ display: 'flow-root' }}>
            <Button style={{ float: 'right' }} onClick={props.onCancel}>取消</Button>
            <Button type='primary' style={{ marginRight: 10, float: 'right' }} htmlType='submit'>提交</Button>
        </div>
    </Form>

})

const MusicListGenerator = (props) => {

    const [ musicList, setMusicList ] = useState(props.musics)
    const [ editObject, setEditObject ] = useState({})
    const [ addingRecord, setAddingRecordStatus ] = useState(false)
    const [ edittingRecord, setedittingRecordStatus ] = useState(false)

    const closeModal = () => {
        setedittingRecordStatus(false)
        setAddingRecordStatus(false)
    }

    const onUpdateSuccess = async (res) => {
        if (addingRecord) {
            message.success('添加歌曲成功！')
            musicList.push(res)
            setMusicList(musicList)
        } else if (edittingRecord) {
            message.success('修改歌曲成功！')
            setMusicList(musicList.map(item => {
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

        setAddingRecordStatus(false)
        setedittingRecordStatus(false)
    }

    const addMusic = () => {
        setAddingRecordStatus(true)
    }

    const onMusicEdit = (record) => {
        setEditObject(record)
        setedittingRecordStatus(true)
    }

    useEffect(() => {
         props.onMusicListChanged(musicList)
    }, [musicList])

    return <>
        <Row gutter={16}>
            <Col lg={6} style={{ marginBottom: 20 }}>
                <Card onClick={addMusic} actions={[ <Icon type="edit" key="edit" />, <Icon type="delete" key="delete" /> ]} cover={<img alt='cover' src='https://p4.music.126.net/W0vYrzN6QjWu7m1O6OMA2w==/109951164503089699.jpg?param=200y200' />}>
                    <Card.Meta title='deafult' description='default' />
                    <div className='add-music-button'>
                        <Icon type="plus" />
                    </div>
                </Card>
            </Col>
            {musicList.map(music => (
                <Col lg={6} key={music.title} style={{ marginBottom: 20 }}>
                    <Card actions={[ <Icon type="edit" key="edit" onClick={() => onMusicEdit(music)} />, <Icon type="delete" key="delete" /> ]} cover={<img alt={`${music.title} - cover`} src={music.cover} />}>
                        <Card.Meta title={music.title} description={music.singer} />
                    </Card>
                </Col>
            ))}
        </Row>

        <Modal title={addingRecord ? '新增歌单' : edittingRecord ? '编辑歌单' : ''} visible={addingRecord || edittingRecord} width={700} footer={null} onCancel={closeModal}>
            <MusicListGeneratorForm info={editObject} onCancel={closeModal} onUpdateSuccess={onUpdateSuccess} />
        </Modal>
    </>

}

export default MusicListGenerator
