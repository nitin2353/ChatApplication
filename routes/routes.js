const express = require('express');
const routes = express.Router();
const multer = require('multer');
const path = require('path');
const connection = require('../database/database');
const session = require('express-session');
const { brotliDecompress } = require('zlib');



routes.use(session({
    secret: process.env.secret,
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 365
    }
}))


routes.get("/chat", (req, res) => {

    if (req.session.isAuth) {
        res.render('chatting');
    } else {
        res.redirect('/')
    }
})


routes.get('/groupDetail',(req, res) => {
    if(req.session.isAuth){
            res.render('groupCretation');
    }else{
           res.redirect('/');
    }
})


// let isAuth;

routes.get("/", (req, res) => {

    console.log(req.session.isAuth)
    if (req.session.isAuth) {
        res.redirect('/select');
    }
    else {
        res.render('login');
    }
})





routes.get('/allUsers', (req, res) => {
    let mynumber = req.query.mynumber;
    console.log(mynumber);
    const query = 'SELECT * FROM users';

    connection.query(query, (err, users) => {
        if (users.length) {
            
            res.json(users);
        }
    })
})



routes.get('/groupUsers', (req, res) => {

    const query = 'SELECT * FROM user_group';

    connection.query(query, (err, result) => {
            if(result.length>0){
                
                res.send(result);

            }
    })


})




routes.get("/select", (req, res) => {
    if (req.session.isAuth) {
        res.render('selection');
    } else {
        res.redirect('/')
    }

})

routes.get('/profile', (req, res) => {
    if (!req.session.isAuth) {
        res.redirect('/');
    }
    else {
        res.render('myProfile');
    }
})


routes.get('/chat/:name/:number', (req, res) => {
    const name = req.params.name;
    const number = req.params.number;
    if (!req.session.isAuth) {
        res.redirect('/');
    } else {

        const query = 'SELECT * FROM users WHERE Mobile = (?)';
        connection.query(query, [number], (err, result) => {
            if (err) {
                console.error('Error fetching user data:', err);
                res.status(500).send('Error fetching user data');
                return;
            }
            if (result.length > 0) {
                const Name = result[0].Name;
                const Number = result[0].Mobile;
                const Dp = path.join(__dirname, '../' + result[0].DP);
                const About = result[0].about;
                res.render('userProfile', { name: Name, number: Number, dp: Dp, about: About });
            } else {
                res.status(404).send('User not found');
            }
        });

    }
})





routes.post('/block', (req, res) => {

    const status = req.body.status;
    const mymobile = req.body.mymobile;
    const mobile = req.body.mobile;
    // const status = req.body.status;
    const query = 'SELECT * FROM users WHERE Mobile = ?';

    connection.query(query, [mobile], (err, result) => {

        console.log('blocked user :' + result[0].Mobile);

        if (result.length > 0) {

            // console.log(result[0].Id);

            const query = 'select * from users where Mobile = ?';
            connection.query(query, [mymobile], (err, my_result) => {
                if (my_result.length > 0) {

                    if (my_result[0].Block_Id != null && my_result[0].Block_Id != 0) {
                        var blocks = my_result[0].Block_Id + "," + result[0].Mobile;
                    } else {
                        var blocks = result[0].Mobile;
                    }
                    console.log(blocks);

                    if (status == "true") {

                        const query = 'UPDATE users SET Block_Id = ? WHERE Mobile = ?'

                        connection.query(query, [blocks, mymobile], (err) => {
                            if (!err) {
                                console.log(result[0].Name + " blocked in " + " Account");
                            }
                        })

                    }
                    else {


                        var unblock = [];
                        var unblockedArr = [];
                        my_result.forEach((e) => {
                            var tamp = e.Block_Id;
                            if (tamp) {
                                unblock = tamp.split(',');
                            }
                        })

                        unblock.forEach((e) => {
                            if (e && e != result[0].Mobile) {
                                unblockedArr.push(e);
                            }
                        })
                        var unblocked = unblockedArr.join(',');



                        const query = 'UPDATE users SET Block_Id = ? WHERE Mobile = ?'

                        connection.query(query, [unblocked, mymobile], (err) => {
                            if (!err) {
                                console.log(result[0].Name + " blocked in " + " Account");
                            }
                        })


                    }
                }
            })

        }
    })


})



routes.get('/unblock', (req, res) => {

})






routes.get('/userprofile', (req, res) => {
    const query = 'SELECT * FROM users';

    connection.query(query, (err, result) => {
        if (result.length > 0) {
            result.forEach(data => {
                if (req.session.mobile == data.Mobile) {
                    console.log(data.Mobile)
                    console.log(data);
                    let userdata = data;
                    res.json(userdata);
                }
            })
        }

    })
})



routes.post('/login', (req, res) => {

    const Mobile = req.body.mobile;

    const query = 'SELECT * FROM users where Mobile = ?';

    connection.query(query, [Mobile], (err, result) => {
        if (result.length > 0) {
            req.session.isAuth = true;
            req.session.mobile = Mobile;
            res.redirect('/select');
        } else {
            req.session.mobile = Mobile;
            res.render('signup');

        }

    })

})



var img = "";

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, '../images'));
    },
    filename: (req, file, cb) => {
        img = file.originalname;
        cb(null, file.originalname);
    }
})


const upload = multer({ storage: storage });

routes.post('/signup', upload.single('photo'), (req, res) => {
    const Name = req.body.name;
    const Mobile = req.session.mobile;
    const DP = `./images/${img}`;

    const query = 'INSERT INTO users (Name, Mobile, DP) VALUES (?, ?, ?)';

    connection.query(query, [Name, Mobile, DP], (err) => {
        if (!err) {
            req.session.isAuth = true;
            req.session.mobile = Mobile;
            res.redirect('/select');
        } else {
            req.session.mobile = Mobile;
            res.redirect('/');
        }
    })

})


routes.post('/userupdate', upload.single('photo'), (req, res) => {
    const Name = req.body.Name;
    const Mobile = req.body.Mobile;
    const about = req.body.about;
    const dp = `./images/${img}`;
    const query = 'UPDATE users SET Name = ?, DP = ?, about = ? WHERE Mobile = ?';

    connection.query(query, [Name, dp, about, Mobile], (err, result) => {
        if (!err) {
            console.log('Successfully updated')
            req.session.mobile = Mobile;
            res.redirect('/select');
        }
    })

})



routes.post('/allChets', (req, res) => {

    // const { user_id }= req.body; 
    var { user_id, message } = req.body;

    const query = 'select user_id from user_chat where user_id = (?)';

    connection.query(query, [user_id], (err, result) => {

        if (!result.length) {

            const query = 'INSERT INTO user_chat( user_id, message) values (?,?)';


            connection.query(query, [user_id, message], (err) => {

                if (!err) {
                    console.log("Successfully insert Data");
                } else {
                    console.log("Data not inserted" + err);
                }

            })

        }
        else {
            const query = 'UPDATE user_chat SET message = (?) WHERE user_id = (?)';

            connection.query(query, [message, user_id], (err) => {
                if (!err) {
                    console.log('updated successfully')
                } else {
                    console.log('Not updated')
                }
            })


        }

    })
})


routes.post('/fetchChats', (req, res) => {

    const query = 'SELECT message FROM user_chat WHERE user_id = ?';
    const user_id = req.body.user_id;

    connection.query(query, [user_id], (err, result) => {
        if (err) {
            console.error('Error fetching chats:', err);
            res.status(500).send('Error fetching chats');
            return;
        }
        const chats = JSON.stringify(result);
        res.send(chats);
    })

})



routes.post('/group',upload.single('photo'), (req, res) => {
  
        const usergroupUsers = req.body.groupUsers;
        const groupName = req.body.Name;
        const groupAbout = req.body.about;
        const dp = `./images/${img}`;
        let data = usergroupUsers.toString();

        const query = 'INSERT INTO user_group(Mobiles) VALUES (?)';


        if(!usergroupUsers || !groupName || !groupAbout || !dp){
                console.log('Complete data is Missing')
                return;
        }



        connection.query(query, [data],(err, result) => {
                if(!err){
                    let groupId = result.insertId;

                    const query = 'INSERT INTO users (Name, Mobile, DP, about) VALUES (?, ?, ?, ?)';

                    connection.query(query, [groupName ,groupId, dp, groupAbout], (err, result) => {
                        if(!err){
                            console.log("Group is creteaed Successfully");
                            res.redirect('/select')
                        }else{
                            console.log('group is not creted')
                            console.log(err.message);
                        }
                    })
                }
        })
})


//--------------------------------Report Routes-------------------------------- 


routes.post('/reportPost', (req, res) => {
        const mynumber = req.body.mynumber;
        const report = req.body.report;
        var alreport = null;
        const query = "select Report from users Where Mobile = ?";

        connection.query(query, [report], (err, result) => {

            if(result[0].Report != null){

                    alreport = result[0].Report;
                    // alreport = mynumber+","+alreport;
                    
                    
                    const query = 'UPDATE users SET Report = ? WHERE Mobile = ?'; 
                    connection.query(query, [alreport, report], (err, result) => {
                        if(!err){
                                console.log('user Reported');
                        }
                    })
            }
            else{
                    const query = 'UPDATE users SET Report = ? WHERE Mobile = ?'; 
                    connection.query(query, [mynumber, report], (err, result) => {
                        if(!err){
                                console.log('user Reported');
                            }
                    })
            }
        })

})



routes.get('/getReport', (req, res) => {

    const query = 'SELECT * FROM users';
    connection.query(query, (err, result) => {
        if(result.length > 0){
            res.json(result);
        }
    })
})















// ----------------------------------It is for sending all kind of files----------------------------------

// var files = [];
// var i = 0;
// const filestorage = multer.diskStorage({
//     destination: (req, file, cb) => {
//         cb(null,path.resolve(__dirname, '../sendFiles'));
//     },
//     filename: (req, file, cb) => {
//         file[i++] = path.resolve(__dirname, '../sendFiles')/file.originalname;
//         cb(null, file.originalname);
//     }
// })

// const uploadFiles = multer({storage: filestorage});



// routes.post('/sendFile', uploadFiles.array('files', 100), (req, res) => {
   


//     res.redirect('/chat')

//     connection.query()

// });
















routes.get('/signout', (req, res) => {

    req.session.destroy(err => {
        if (!err)
            res.redirect('/');

    })

})




module.exports = routes;
