/*
测试使用mongoose操作mongodb数据库
1. 连接数据库
  1.1. 引入mongoose
  1.2. 连接指定数据库(URL只有数据库是变化的)
  1.3. 获取连接对象
  1.4. 绑定连接完成的监听(用来提示连接成功)
2. 得到对应特定集合的Model
  2.1. 字义Schema(描述文档结构)
  2.2. 定义Model(与集合对应, 可以操作集合)
3. 通过Model或其实例对集合数据进行CRUD操作
  3.1. 通过Model实例的save()添加数据
  3.2. 通过Model的find()/findOne()查询多个或一个数据
  3.3. 通过Model的findByIdAndUpdate()更新某个数据
  3.4. 通过Model的remove()删除匹配的数据
 */
const md5 = require('blueimp-md5');

const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/gzhipin_test');
const conn = mongoose.connection;
conn.on('connected', () => {  //连接成功后回调
    console.log('数据库连接成功')
});


const userSchema = mongoose.Schema({
    username: {type: String, required: true},
    password: {type: String, required: true},
    type: {type: String, required: true},  //用户类型：dashen/laoban
    header: {type: String}
});

const UserModel = mongoose.model('user', userSchema);  //集合的名称为users

/***** 保存数据 *****/
function testSave() {
    const userModel = new UserModel({
        username: 'Bob',
        password: md5('123'),
        type: 'laoban'
    });
    userModel.save((err, userDoc) => {
        console.log(userDoc);
    })
}

// testSave();
/***** 保存数据 *****/


/***** 查询数据 *****/
function testFind() {
    UserModel.find((err, users) => {  //查询多个,返回数组
        console.log(users);
    });
    UserModel.findOne({_id: '5be106afc330841dd414ca56'}, (err, user) => {  //查询一个，返回对象
        console.log(user);
    })
}

// testFind();
/***** 查询数据 *****/


/***** 更新数据 *****/
function testUpdate() {
    UserModel.findByIdAndUpdate({_id: '5be106afc330841dd414ca56'}, {username: 'Jack'}, (err, oldUser) => {
            console.log(oldUser);
        }
    )
}

// testUpdate();
/***** 更新数据 *****/


/***** 删除数据 *****/
function testDelete() {
    UserModel.remove({_id: '5be106afc330841dd414ca56'}, (err, doc) => {
        console.log(doc);  //{n:1, ok:1}
    })
}

testDelete();
/***** 删除数据 *****/