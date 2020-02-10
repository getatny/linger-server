import React, { useState, useEffect } from 'react'
import LayoutComponent from "../components/layout"
import { PageHeader, Button, Popconfirm, Spin, Table, Tag, Typography, Form, Input, Row, Col, message, Modal } from 'antd'
import http from '../utils/http'
import config from '../config'
import defaultCover from '../static/default-cover.png'
import CKEditor from '@ckeditor/ckeditor5-react'
import ClassicEditor from '@ckeditor/ckeditor5-build-classic'

const { Item } = Form
const { Paragraph } = Typography

const ArticleInfoForm = Form.create({ name: 'article-info' })((props) => {

    const { getFieldDecorator } = props.form

    const [ articleCover, setArticleCover ] = useState(null)
    const [ articleContent, setArticleContent ] = useState('')

    const onFormSubmit = e => {
        e.preventDefault()
        props.form.validateFields((err, values) => {
            if (!err) {
                const { id } = props.info
                const { title, description, author, tag, cover } = values

                let response = null
                let isEdit = false
                
                if (id) {
                    response = http.put(`${config.server}/rest/admin/article`, { id, title, description, author, tag, cover, content: articleContent })
                    isEdit = true
                } else {
                    response = http.post(`${config.server}/rest/admin/article`, { title, description, author, tag, cover, content: articleContent })
                }

                response.then(res => {
                    isEdit ? props.onUpdateSuccess({ ...values, id, content: articleContent }) : props.onUpdateSuccess({ ...res, content: articleContent })
                }).catch(err => {
                    console.log(err)
                    props.onUpdateFailed()
                })
            }
        })
    }

    let timer = null

    const onArticleCoverChanged = e => {
        if (timer) {
            clearTimeout(timer)
        }

        const cover = e.target.value
        timer = setTimeout(() => {
            setArticleCover(cover)
        }, 500)
    }

    useEffect(() => {
        const { title, description, author, tag, cover, content } = props.info

        props.form.setFieldsValue({ title, description, author, tag, cover })
        setArticleContent(content)
    }, [props.info])

    return <Form className='article-info-form' onSubmit={onFormSubmit}>
        <Row gutter={24}>
            <Col lg={4}>
                <img src={articleCover || props.info.cover || defaultCover} alt='cover' style={{ width: '100%' }} />
            </Col>
            <Col lg={20}>
                <Item label='文章标题'>
                    {getFieldDecorator('title', {
                        rules: [{ required: true, message: '文章标题不能为空！' }]
                    })(
                        <Input />
                    )}
                </Item>
                <Item label='文章封面'>
                    {getFieldDecorator('cover', {
                        rules: [{ required: true, message: '文章封面不能为空！' }]
                    })(
                        <Input onChange={onArticleCoverChanged} />
                    )}
                </Item>
                <Item label='文章作者'>
                    {getFieldDecorator('author', {
                        rules: [{ required: true, message: '文章作者不能为空！' }]
                    })(
                        <Input />
                    )}
                </Item>
                <Item label='标签'>
                    {getFieldDecorator('tag', {
                        rules: [{ required: true, message: '标签不能为空！' }]
                    })(
                        <Input />
                    )}
                </Item>
                <Item label='文章描述'>
                    {getFieldDecorator('description')(
                        <Input />
                    )}
                </Item>
                <Item label='内容'>
                    <CKEditor editor={ClassicEditor} data={articleContent} onBlur={ ( event, editor ) => setArticleContent(editor.getData()) } />
                </Item>
            </Col>
        </Row>
        <div className='btns' style={{ display: 'flow-root' }}>
            <Button style={{ float: 'right' }} onClick={props.onCancel}>取消</Button>
            <Button type='primary' style={{ marginRight: 10, float: 'right' }} htmlType='submit'>提交</Button>
        </div>
    </Form>

})

const Article = () => {

    const [ articleData, setArticleData ] = useState(null)
    const [ selectedData, setSelectedData ] = useState([])
    const [ editObject, setEditObject ] = useState({})
    const [ addingRecord, setAddingRecordStatus ] = useState(false)
    const [ edittingRecord, setedittingRecordStatus ] = useState(false)

    const onDeleteConfirm = (id) => {
        http.post(`${config.server}/rest/admin/articles/delete`, {
            list: [id]
        }).then(() => {
            message.success('删除文章成功！')
            setArticleData(articleData.filter(item => item.id !== id))
        }).catch(err => {
            console.log(err)
            message.error('删除文章失败！')
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
            message.success('添加文章成功！')
            articleData.unshift(res)
            setArticleData(articleData)
        } else if (edittingRecord) {
            message.success('修改文章内容成功！')
            setArticleData(articleData.map(item => {
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
            message.error('添加文章失败！')
        } else if (edittingRecord) {
            message.error('修改文章内容失败！')
        }
    }

    const onArticleEdit = (record) => {
        setEditObject(record)
        setedittingRecordStatus(true)
    }

    const columns = [
        { title: 'id', dataIndex: 'id', key: 'id' },
        { title: '封面', dataIndex: 'cover', key: 'cover', render: (text, record) => (
            <img src={text} alt={`${record.title} - cover`} style={{ width: 60, height: 60, overflow: 'hidden' }} />
        ) },
        { title: '文章标题', dataIndex: 'title', key: 'title' },
        { title: '作者', dataIndex: 'author', key: 'author' },
        { title: '标签', dataIndex: 'tag', key: 'tag', render: tag => (<Tag color='#2db7f5'>{tag}</Tag>) },
        { title: '文章描述', dataIndex: 'description', key: 'description', render: description => (<Paragraph ellipsis>{description}</Paragraph>) },
        { title: '操作', key: 'actions', render: (t, record) => (
            <>
                <Button type="primary" icon="edit" style={{ marginRight: 10 }} onClick={() => onArticleEdit(record)}>编辑</Button>
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
        http.get(`${config.server}/rest/admin/articles/1/15`).then(res => {
            setArticleData(res.articles)
        }).catch(err => {
            console.log(err)
            message.error('获取文章数据失败！')
        })
    }, [])

    return <LayoutComponent>
        <div id="article-page">
            <PageHeader style={{
                border: '1px solid rgb(235, 237, 240)',
                backgroundColor: '#fff',
                marginBottom: '24px'
            }} title="文章列表" subTitle="文章推荐列表" />

            <div className="main-content">
                <Button type='primary' icon='plus' style={{ marginRight: 10, marginBottom: 20 }} onClick={() => setAddingRecordStatus(true)}>新增文章</Button>
                {selectedData.length > 0 ? <Popconfirm placement='top' title='确定删除所选文章？' onConfirm={() => onDeleteConfirm(1)} okText='确定' cancelText='取消'>
                    <Button type="danger" icon="delete">批量删除</Button>
                </Popconfirm> : null}
                <Spin spinning={articleData === null}>
                    <Table columns={columns} dataSource={articleData} rowSelection={rowSelection} rowKey='id' />
                </Spin>
            </div>
        </div>

        <Modal title={addingRecord ? '新增文章' : edittingRecord ? '编辑文章' : ''} visible={addingRecord || edittingRecord} width='90%' footer={null} onCancel={closeModal}>
            <ArticleInfoForm info={editObject} onCancel={closeModal} onUpdateSuccess={onUpdateSuccess} onUpdateFailed={onUpdateFailed} />
        </Modal>
    </LayoutComponent>

}

export default Article
