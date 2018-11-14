var express = require('express');
var router = express.Router();

const md5 = require('blueimp-md5');
const {UserModel, ChatModel} = require('../db/models');
const filter = {password: 0, __v: 0};  // 指定过滤的属性

/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('index', {title: 'Express'});
});


// 注册的路由
router.post('/register', (req, res) => {
    const {username, password, type} = req.body;
    UserModel.findOne({username}, (err, user) => {
        if (user) {
            res.send({code: 1, msg: '该用户名已存在'});
        } else {
            const userModel = new UserModel({
                username,
                password: md5(password),
                type
            });
            userModel.save((err, user) => {
                const data = {username, type, _id: user._id};
                res.cookie('userid', user._id, {maxAge: 1000 * 60 * 60 * 24 * 7});
                res.send({code: 0, data});
            })
        }
    })
});


// 登陆的路由
router.post('/login', (req, res) => {
    const {username, password} = req.body;

    UserModel.findOne({username, password: md5(password)}, filter, (err, user) => {
        if (user) {
            res.cookie('userid', user._id, {maxAge: 1000 * 60 * 60 * 24 * 7});
            res.send({code: 0, data: user});
        } else {
            res.send({code: 1, msg: '用户名或密码不正确'})
        }
    })
});


// 更新用户信息的路由
router.post('/update', (req, res) => {
    //从cookie中获取userid
    const user_id = req.cookies.userid;
    if (!user_id) {
        return res.send({code: 1, msg: '请先登录'});
    }

    const user = req.body;
    UserModel.findByIdAndUpdate({_id: user_id}, user, (err, oldUser) => {
            if (!oldUser) {  //数据库中没有找到该用户
                res.clearCookie('userid');
                res.send({code: 1, msg: '请先登录'});
            } else {
                const {_id, username, type} = oldUser;
                res.send({
                    code: 0,
                    data: Object.assign({}, {_id, username, type}, user)
                });
            }
        }
    )
});


// 获取用户信息的路由(根据cookie中的userid)


// 获取用户列表(根据类型)


//获取当前用户所有相关聊天信息列表


//修改指定消息为已读

module.exports = router;
