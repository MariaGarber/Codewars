const router = require('express').Router();
const User = require('../models/User');
const Test = require('../models/Test');
const UserData = require('../models/UserData');
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const { google } = require('googleapis');
const OAuth2 = google.auth.OAuth2;
const dotenv = require('dotenv');
dotenv.config();
const jwt = require('jsonwebtoken');
const {
  registerValidation,
  loginValidation,
  updateValidation,
  passValidation,
  contactValidation,
  stringValidation,
} = require('../validation');
const verify = require('./verifyToken');

const oauth2Client = new OAuth2(
  '721582423556-4ei037cl7pqdkt28bhl217vmas5dg4gn.apps.googleusercontent.com',
  '0StoOWKQ-M5XQye2Q_iSInL4',
  'https://developers.google.com/oauthplayground'
);
oauth2Client.setCredentials({
  refresh_token:
    '1//04RY8WCb9RvJsCgYIARAAGAQSNwF-L9IrUP65m52hvsbDn0E8sURk0oF8F344a6W2IVRHikqTfx0NXVgjuE9uP5lNcAb2GQnvAE0',
});
const accessToken = oauth2Client.getAccessToken();

router.post('/register', async (req, res) => {
  const { error } = registerValidation(req.body);
  if (error) return res.send(error.details[0].message);

  const userExists = await User.find({ email: req.body.email });
  if (userExists[0]) return res.send('The user already exists');

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(req.body.password, salt);
  let profileImg;
  if (req.body.gender === 'Male' || req.body.gender === 'Other') {
    profileImg = 'male';
  } else {
    profileImg = 'female';
  }
  const user = new User({
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email,
    password: hashedPassword,
    startDate: req.body.startDate,
    country: req.body.country,
    gender: req.body.gender,
    profileImg,
  });
  try {
    await user.save();
    const newUser = await User.find({ email: req.body.email });
    const data = new Test({
      pid: newUser[0]._id,
      pre_level: req.body.level,
      institute: req.body.learn,
    });
    await data.save();
    await registerEmail(req.body.email, req.body.firstName);
    res.send({
      id: newUser[0]._id,
      name: newUser[0].firstName,
      pic: newUser[0].profileImg,
    });
  } catch (err) {
    res.json('Error: ' + err);
  }
});

router.post('/login', async (req, res) => {
  const { error } = loginValidation(req.body);
  if (error) return res.send(error.details[0].message);

  const user = await User.find({ email: req.body.email });
  if (!user[0]) return res.send('User is not found');

  const validPass = await bcrypt.compare(req.body.password, user[0].password);
  if (!validPass) return res.send('The password is wrong');

  let exp = 0;
  let level = 0;
  const data = await UserData.find({ pid: user[0]._id });
  if (data[0]) {
    exp = data[0].exp;
    level = data[0].level;
  }
  user[0].lastSeen = req.body.lastSeen;
  try {
    await user[0].save();
    res.json({
      id: user[0]._id,
      name: user[0].firstName,
      exp,
      level,
      pic: user[0].profileImg,
    });
  } catch (err) {
    res.status(400).send(err);
  }
});

router.put('/update', async (req, res) => {
  const { error } = updateValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  const user = await User.find({ _id: req.body.id });
  if (!user[0]) return res.status(400).send('User is not found');
  if (req.body.firstName !== '') user[0].firstName = req.body.firstName;
  if (req.body.lastName !== '') user[0].lastName = req.body.lastName;
  if (req.body.birthday !== '') user[0].startDate = req.body.birthday;
  if (req.body.pic !== '') user[0].profileImg = req.body.pic;
  if (req.body.country !== '') user[0].country = req.body.country;
  if (req.body.gender !== '') user[0].gender = req.body.gender;
  if (req.body.newPassword !== '') {
    const validPass = await bcrypt.compare(
      req.body.currentPassword,
      user[0].password
    );
    if (!validPass)
      return res.status(400).send('Your current password is wrong');
    else {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(req.body.newPassword, salt);
      user[0].password = hashedPassword;
    }
  }
  try {
    await user[0].save();
    res.send('Your data updated successfully!');
  } catch (err) {
    res.status(400).send(err);
  }
});

router.post('/userTests', async (req, res) => {
  const test = await Test.find({ pid: req.body.cookie });
  if (!test[0]) return res.send({ data: null });
  else res.json({ data: test[0].data });
});

router.get('/getstats', async (req, res) => {
  const userData = await UserData.find({ pid: req.query.cookie });
  if (!userData[0]) return res.status(404).send('Error');
  else
    res.send({
      total_games: userData[0].total_games,
      losses: userData[0].losses,
      wins: userData[0].wins,
      grades: userData[0].grades,
      medals: userData[0].medals,
      times: userData[0].warTimes,
    });
});

router.get('/getwarhistory', async (req, res) => {
  const userData = await UserData.find({ pid: req.query.cookie });
  if (!userData[0]) return res.status(404).send('Error');
  else
    res.send({
      warHistory: userData[0].warHistory,
    });
});

router.get('/getprofiledata', async (req, res) => {
  const user = await User.find({ _id: req.query.cookie });
  if (!user[0]) return res.status(404).send('Error');
  else
    res.send({
      firstName: user[0].firstName,
      lastName: user[0].lastName,
      email: user[0].email,
      birthday: user[0].startDate,
      country: user[0].country,
      gender: user[0].gender,
      memberSince: user[0].memberSince,
      lastSeen: user[0].lastSeen,
      tier: user[0].tier,
      profileImg: user[0].profileImg,
      friends: user[0].friends,
    });
});

router.get('/getfriendslist', async (req, res) => {
  const userData = await User.find({ _id: req.query.cookie });
  const potentialFriend = await User.find();
  const level = await UserData.find();

  if (!userData[0]) return res.status(404).send('Error');
  else {
    let tmpArr = [];
    for (let i = 0; i < userData[0].friends.length; i++) {
      if (userData[0].friends[i].status === 'friends') {
        let friend = potentialFriend.filter(
          (obj) => obj._id == userData[0].friends[i].id
        );
        let lvl = level.filter((obj) => obj.pid === userData[0].friends[i].id);
        tmpArr.push({
          id: userData[0].friends[i].id,
          name: friend[0].firstName + ' ' + friend[0].lastName,
          img: friend[0].profileImg,
          level: lvl[0].level,
          programingLevel:
            friend[0].tier === 'easy'
              ? 'Beginner'
              : friend[0].tier === 'medium'
              ? 'Intermediate'
              : friend[0].tier === 'hard'
              ? 'Expert'
              : 'none',
          lastSeen: friend[0].lastSeen,
        });
      }
    }
    res.send({ friends: tmpArr });
  }
});

router.get('/forgetpassword', async (req, res) => {
  const user = await User.find({ email: req.query.email });

  if (!user[0]) {
    console.log('not found');
    return res.status(404).send('Error');
  } else {
    let ans = await forgetPass(req.query.email, user[0].firstName, user[0]._id);
  }
});

router.get('/getcontactdata', async (req, res) => {
  const user = await User.find({ _id: req.query.cookie });

  if (!user[0]) {
    console.log('not found');
    return res.status(404).send('Error');
  } else {
    res.send({
      name: user[0].firstName + ' ' + user[0].lastName,
      email: user[0].email,
    });
  }
});

router.post('/updatepassword', async (req, res) => {
  const { error } = passValidation(req.body);
  if (error) return res.send(error.details[0].message);

  const user = await User.find({ _id: req.body.id });
  if (!user[0]) return res.status(404).send('Error');
  else {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);
    user[0].password = hashedPassword;
    try {
      await user[0].save();
      res.send(true);
    } catch (err) {
      res.json('Error: ' + err);
    }
  }
});

router.post('/sendContactForm', async (req, res) => {
  const { error } = contactValidation(req.body);
  if (error) return res.send(error.details[0].message);
  try {
    let ans = await contact(
      req.body.name,
      req.body.email,
      req.body.description
    );
    res.send(true);
  } catch (err) {
    res.json('Error: ' + err);
  }
});

router.post('/leveldata', async (req, res) => {
  const userData = await UserData.find({ pid: req.body.cookie });
  const user = await User.find({ _id: req.body.cookie });

  if (!userData[0] || !user[0]) return res.send(null);
  else
    res.json({
      exp: userData[0].exp,
      level: userData[0].level,
      name: user[0].firstName + ' ' + user[0].lastName,
    });
});

router.delete('/deleteaccount', async (req, res) => {
  try {
    await Test.deleteOne({ pid: req.body.cookie });
    await UserData.deleteOne({ pid: req.body.cookie });
    await User.deleteOne({ _id: req.body.cookie });
    res.send('Your Account Deleted Succsefully!');
  } catch (err) {
    res.status(400).send('Error' + err);
  }
});

router.get('/searchuser', async (req, res) => {
  const { error } = stringValidation(req.query);
  if (error) return res.status(400).send('No results');
  let users = [];
  const user = await User.search(req.query.search, async function (err, data) {
    if (!data[0]) return res.status(400).send('No results');
    for (let i = 0; i < data.length; i++) {
      let tmp = {};
      tmp.id = data[i]._id;
      tmp.name = data[i].firstName + ' ' + data[i].lastName;
      tmp.programingLevel = data[i].tier;
      tmp.country = data[i].country;
      tmp.memberSince = data[i].memberSince;
      tmp.lastSeen = data[i].lastSeen;
      tmp.img = data[i].profileImg;
      users.push(tmp);
    }
    const friends = await User.find({ _id: req.query.id });
    if (!friends[0]) return res.send({ users, friends: [] });
    return res.send({ users, friends: friends[0].friends });
  });
});

router.get('/getalerts', async (req, res) => {
  const user = await User.find({ _id: req.query.id });
  if (user[0]) res.send({ alerts: user[0].alerts });
});

router.get('/setalertstatus', async (req, res) => {
  const user = await User.find({ _id: req.query.id });
  let tmpArr = [];
  let tmpObj = {};
  if (user[0]) {
    for (let i = 0; i < user[0].alerts.length; i++) {
      if (user[0].alerts[i].type === 'friend-request') {
        tmpObj = {
          type: user[0].alerts[i].type,
          status: 'old',
          id: user[0].alerts[i].id,
          img: user[0].alerts[i].img,
          name: user[0].alerts[i].name,
        };
        tmpArr.push(tmpObj);
      } else if (user[0].alerts[i].type === 'friendship-accepted') {
        if (user[0].alerts[i].counter < 5) {
          tmpObj = {
            type: user[0].alerts[i].type,
            status: 'old',
            counter: user[0].alerts[i].counter + 1,
            name: user[0].alerts[i].name,
            img: user[0].alerts[i].img,
            id: user[0].alerts[i].id,
          };
          tmpArr.push(tmpObj);
        }
      }
    }
    user[0].alerts = tmpArr;
    try {
      await user[0].save();
    } catch {}
  }
});

router.post('/declinefriend', async (req, res) => {
  const user = await User.find({ _id: req.body.id });
  const declinedFriend = await User.find({ _id: req.body.friendId });
  if (user[0] && declinedFriend[0]) {
    user[0].alerts = user[0].alerts.filter(
      (obj) => obj.id !== req.body.friendId
    );
    declinedFriend[0].alerts = declinedFriend[0].alerts.filter(
      (obj) => obj.id !== req.body.id
    );
    user[0].friends = user[0].friends.filter(
      (obj) => obj.id !== req.body.friendId
    );
    declinedFriend[0].friends = declinedFriend[0].friends.filter(
      (obj) => obj.id !== req.body.id
    );
    try {
      await user[0].save();
      await declinedFriend[0].save();
      res.send({ res: user[0].alerts });
    } catch {}
  }
});

router.post('/deletefriend', async (req, res) => {
  const user = await User.find({ _id: req.body.id });
  const deletedFriend = await User.find({ _id: req.body.friendId });
  if (user[0] && deletedFriend[0]) {
    user[0].alerts = user[0].alerts.filter(
      (obj) => obj.id !== req.body.friendId
    );
    deletedFriend[0].alerts = deletedFriend[0].alerts.filter(
      (obj) => obj.id !== req.body.id
    );
    user[0].friends = user[0].friends.filter(
      (obj) => obj.id !== req.body.friendId
    );
    deletedFriend[0].friends = deletedFriend[0].friends.filter(
      (obj) => obj.id !== req.body.id
    );
    try {
      await user[0].save();
      await deletedFriend[0].save();
      res.send(true);
    } catch {}
  }
});

router.get('/getendtest', async (req, res) => {
  const test = await Test.find({ pid: req.query.pid });
  if (test[0]) res.send({ status: test[0].data.length === 3 });
});

module.exports = router;

const smtpTransport = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    type: 'OAuth2',
    user: 'codewarsproject@gmail.com',
    clientId:
      '721582423556-4ei037cl7pqdkt28bhl217vmas5dg4gn.apps.googleusercontent.com',
    clientSecret: '0StoOWKQ-M5XQye2Q_iSInL4',
    refreshToken:
      '1//04RY8WCb9RvJsCgYIARAAGAQSNwF-L9IrUP65m52hvsbDn0E8sURk0oF8F344a6W2IVRHikqTfx0NXVgjuE9uP5lNcAb2GQnvAE0',
    accessToken: accessToken,
  },
  tls: {
    rejectUnauthorized: false,
  },
});

async function registerEmail(newUserEmail, newUserName) {
  let mailOptions = {
    from: '"Codewars" <codewarsproject@gmail.com>',
    to: newUserEmail,
    subject: 'Thank you for registaration!',
    generateTextFromHTML: true,
    html: '<b>Hello ' + newUserName + '!</b> Thank you for registration<p>',
  };

  smtpTransport.sendMail(mailOptions, (error, response) => {
    error ? console.log(error) : console.log(response);
    smtpTransport.close();
  });
}

async function forgetPass(email, name, id) {
  let mailOptions = {
    from: '"Codewars" <codewarsproject@gmail.com>',
    to: email,
    subject: 'Change Password',
    generateTextFromHTML: true,
    html:
      '<b>Hello ' +
      name +
      '!</b><p> here is your link to change your password</p> <a href="https://codewars-project.netlify.app/changepass?id=' +
      id +
      '">https://codewars-project.netlify.app/changepass?id=' +
      id +
      '</a>',
  };

  smtpTransport.sendMail(mailOptions, (error, response) => {
    error ? console.log(error) : console.log(response);
    smtpTransport.close();
  });
}

async function contact(name, email, content) {
  let mailOptions = {
    from: '"Codewars" <codewarsproject@gmail.com>',
    to: 'codewarsproject@gmail.com',
    subject: 'Contact Form',
    generateTextFromHTML: true,
    html:
      '<p>The user ' +
      name +
      ' email: ' +
      email +
      '</p>' +
      '<p>send us a message:</p>' +
      '<p>' +
      content +
      '</p>',
  };

  smtpTransport.sendMail(mailOptions, (error, response) => {
    error ? console.log(error) : console.log(response);
    smtpTransport.close();
  });
}
