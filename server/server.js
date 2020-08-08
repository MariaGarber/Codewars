const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const http = require('http');
const Question = require('./models/Question');
const User = require('./models/User');
const Room = require('./models/Room');
const UserData = require('./models/UserData');
const Test = require('./models/Test');
const socketio = require('socket.io');
const { python } = require('compile-run');
const authRoute = require('./routes/auth');
const app = express();
const server = http.createServer(app);
const io = socketio(server);

app.use(cors());
app.use(express.json());
dotenv.config();

rooms = [];
let numberOfRooms = 0;
let socketsID = [];
results = {};
roomRes = [];
let onlineUsers = [];

app.use('/', authRoute);

io.on('connection', (socket) => {
  console.log(`Connection has been made!! id:${socket.id}`);

  socket.on('newRoom', async (id) => {
    let exist = await checkRoom(id);
    if (!exist) {
      numberOfRooms = numberOfRooms + 1;
      let room = 'room' + numberOfRooms;
      let add = await addRoom(id, room);
      if (add) {
        socket.join(room);
        socket.emit('roomName', room);
        offlineUser(id);
      }
    } else socket.emit('alreadyExist');
  });

  socket.on('join', async ({ id, room, roomLevel }) => {
    let exist = await checkRoom(id);
    if (exist) socket.emit('alreadyExist');
    else {
      io.in(room).clients(async (err, clients) => {
        if (clients.length < 2) {
          let permission = await joinRoom(id, room, roomLevel);
          if (permission) {
            socket.join(room);
            offlineUser(id);
            console.log(`in room: ${room} num of users are: ${clients.length}`);
            if (clients.length === 1) {
              let questions = await findQuestion(roomLevel);
              socket.emit('joined', room);
              io.in(room).emit('startGame', {
                question: questions.question,
                example: questions.example,
                constraints: questions.constraints,
                signature: questions.signature,
                index: questions.index,
              });
            }
          } else {
            socket.emit('levelNotMatch');
          }
        }
      });
    }
  });

  socket.on('userOnline', async ({ id }) => {
    let user = await User.find({ _id: id });
    if (user[0]) {
      if (!alredyOnline(id)) {
        onlineUsers.push({
          id: user[0]._id,
          name: user[0].firstName + ' ' + user[0].lastName,
          country: user[0].country,
          img: user[0].profileImg,
        });
      }
      io.emit('onlineUsersUpdate', onlineUsers);
    }
  });

  const offlineUser = (id) => {
    onlineUsers = onlineUsers.filter((user) => user.id != id);
    io.emit('onlineUsersUpdate', onlineUsers);
  };

  socket.on('userOffline', ({ id }) => {
    offlineUser(id);
  });

  socket.on('update', async () => {
    const rooms = await getRooms();
    io.emit('updatedRooms', rooms);
  });

  socket.on('endGame', ({ room, indexOfQuestion }) => {
    io.in(room).emit('submiting', { room, indexOfQuestion, first: socket.id });
  });

  socket.on('timeout', ({ room, indexOfQuestion }) => {
    socket.emit('submiting', { room, indexOfQuestion, first: -1 });
  });

  socket.on('submit', async ({ room, indexOfQuestion, first, code, time }) => {
    if (!socketsID.includes(socket.id)) {
      socketsID.push(socket.id);
    }
    let c = await calculateGrade(indexOfQuestion, code);
    createNestedObject(results, ['rooms', room, socket.id, 'grade'], c.g);
    createNestedObject(results, ['rooms', room, socket.id, 'output'], c.output);
    console.log(socketsID);

    let WINNER;
    try {
      if (
        results.rooms[room][socketsID[0]].grade > -1 &&
        results.rooms[room][socketsID[1]].grade > -1
      ) {
        if (
          results.rooms[room][socketsID[0]].grade >
          results.rooms[room][socketsID[1]].grade
        ) {
          WINNER = socketsID[0];
        } else if (
          results.rooms[room][socketsID[0]].grade ===
          results.rooms[room][socketsID[1]].grade
        )
          WINNER = first;
        else {
          WINNER = socketsID[1];
        }
        let pid = await findPid(room);
        let players_id;
        if (pid[0][1] === socketsID[0]) players_id = [pid[0][0], pid[1][0]];
        else players_id = [pid[1][0], pid[0][0]];
        if (WINNER === -1) {
          await updateResults(
            players_id[0],
            true,
            results.rooms[room][socketsID[0]].grade,
            time,
            indexOfQuestion
          );
          await updateResults(
            players_id[1],
            true,
            results.rooms[room][socketsID[1]].grade,
            time,
            indexOfQuestion
          );
        } else {
          await updateResults(
            players_id[0],
            socketsID[0] === WINNER,
            results.rooms[room][socketsID[0]].grade,
            time,
            indexOfQuestion
          );
          await updateResults(
            players_id[1],
            socketsID[1] === WINNER,
            results.rooms[room][socketsID[1]].grade,
            time,
            indexOfQuestion
          );
        }
        await deleteRoom(room);
        io.in(room).emit('goToResults', {
          room,
          infoAboutRoom: results,
          WINNER: WINNER,
        });
      } else {
        console.log('some grade value missing!');
      }
      socketsID = [];
    } catch (err) {
      console.log(err);
    }
  });

  socket.on('leave-room', (room) => {
    socket.leave(room);
  });

  socket.on('disconnect', async () => {
    let tmp = await Room.find();
    for (let i = 0; i < tmp.length; i++) {
      if (
        tmp[i].first_player.sid === socket.id ||
        tmp[i].second_player.sid === socket.id
      ) {
        if (tmp[i].progress === 'waiting') {
          await deleteRoom(tmp[i].name);
          const rooms = await getRooms();
          io.emit('updatedRooms', rooms);
        } else {
          if (tmp[i].progress === 'inGame') {
            let win = [false, false];
            let grade = [0, 0];
            if (tmp[i].first_player.sid !== socket.id) {
              win[0] = true;
              grade[0] = 100;
            } else {
              win[1] = true;
              grade[1] = 100;
            }
            await updateResults(
              tmp[i].first_player.pid,
              win[0],
              grade[0],
              -1,
              -1
            );
            await updateResults(
              tmp[i].second_player.pid,
              win[1],
              grade[1],
              -1,
              -1
            );
            await deleteRoom(tmp[i].name);
            io.in(tmp[i].name).emit('opponentLeft');
          }
        }
      }
    }
    console.log('User are disconnected...' + socket.id);
  });

  socket.on('compileCode', (code) => {
    console.log('i in compile code func');
    let resultPromise = python.runSource(code);
    resultPromise
      .then((result) => {
        console.log('result is: ', result);
        let temp = {};

        if (result.stderr === '') temp.res = result.stdout;
        else temp.res = result.stderr;
        temp.res = temp.res.split('\r\n');
        temp.code = code;
        socket.emit('result', temp);
      })
      .catch((err) => {
        console.log(err);
      });
  });

  // level test events

  socket.on('getTestQuestion', async (id) => {
    const test = await Test.find({ pid: id });
    let questions = await findTestQuestion(test[0].indexes);
    socket.emit('startTest', {
      question: questions.question,
      example: questions.example,
      constraints: questions.constraints,
      signature: questions.signature,
      index: questions.index,
    });
  });

  socket.on(
    'submitTestCode',
    async ({ id, time, tname, indexOfQuestion, code }) => {
      let c = await calculateGrade(indexOfQuestion, code);
      let tier = await saveTest(id, tname, c.g, time, indexOfQuestion);
      socket.emit('goToTestResults', {
        testGrade: c.g,
        testResults: c.output,
        tier
      });
    }
  );

  socket.on('testTimeout', () => {
    socket.emit('submitingTest');
  });

  // friends alerts
  socket.on('addFriend', async ({ myId, friendId }) => {
    let user = await User.find({ _id: myId });
    let friend = await User.find({ _id: friendId });
    if (user[0] && friend[0]) {
      let tmp = {
        type: 'friend-request',
        status: 'new',
        id: myId,
        img: user[0].profileImg,
        name: user[0].firstName + ' ' + user[0].lastName,
      };
      friend[0].alerts.push(tmp);
      user[0].friends.push({
        id: friendId,
        status: 'sent',
      });
      friend[0].friends.push({
        id: myId,
        status: 'waiting',
      });
      try {
        await friend[0].save();
        await user[0].save();
      } catch {}
    }
    io.emit('newAlert', friendId);
  });

  socket.on('getMyAlerts', async (id) => {
    let user = await User.find({ _id: id });
    if (user[0]) socket.emit('userAlerts', user[0].alerts);
  });

  socket.on('acceptFriend', async ({ id, friendId }) => {
    let user = await User.find({ _id: id });
    let friend = await User.find({ _id: friendId });
    if (user[0] && friend[0]) {
      user[0].alerts = user[0].alerts.filter((obj) => obj.id !== friendId);
      friend[0].alerts = friend[0].alerts.filter((obj) => obj.id !== id);
      user[0].friends = user[0].friends.filter((obj) => obj.id !== friendId);
      friend[0].friends = friend[0].friends.filter((obj) => obj.id !== id);
      friend[0].friends.push({
        id,
        status: 'friends',
      });
      user[0].friends.push({
        id: friendId,
        status: 'friends',
      });
      friend[0].alerts.push({
        type: 'friendship-accepted',
        status: 'new',
        counter: 0,
        name: user[0].firstName + ' ' + user[0].lastName,
        img: user[0].profileImg,
        id: user[0]._id,
      });

      try {
        await friend[0].save();
        await user[0].save();
      } catch {}
    }
    socket.emit('userAlerts', user[0].alerts);
    io.emit('newAlert', friendId);
  });

  //functions
  const addRoom = async function (id, name) {
    const user = await User.find({ _id: id });
    if (!user[0]) return false;

    const room = new Room({
      name: name,
      level: user[0].tier,
      first_player: { pid: id, sid: socket.id },
      second_player: '',
      progress: 'waiting',
    });
    try {
      await room.save();
      return true;
    } catch (err) {
      console.log(err);
    }
  };

  const joinRoom = async function (id, name, roomLevel) {
    const user = await User.find({ _id: id });
    if (!user[0]) return false;
    console.log('user[0].tier: ', user[0].tier);
    console.log('roomLevel: ', roomLevel);
    console.log('user[0].tier !== roomLevel: ', user[0].tier !== roomLevel);
    if (user[0].tier !== roomLevel) return false;

    const room = await Room.find({ name: name });
    if (!room[0]) return false;
    room[0].second_player = { pid: id, sid: socket.id };
    room[0].progress = 'inGame';
    try {
      await room[0].save();
      return true;
    } catch (err) {
      return false;
    }
  };

  const getRooms = async function () {
    let tmp = await Room.find();
    let room = [];

    let j = 0;
    for (let i = 0; i < tmp.length; i++) {
      let nameAndTier = {};
      if (tmp[i].progress === 'waiting') {
        nameAndTier.name = tmp[i].name;
        nameAndTier.tier = tmp[i].level;
        nameAndTier.planguage = tmp[i].planguage;
        room.push(nameAndTier);
      }
    }
    return room;
  };

  const deleteRoom = async function (name) {
    try {
      await Room.deleteOne({ name: name });
      return true;
    } catch (err) {
      console.log(error.response.data.error);
    }
  };

  const checkRoom = async function (id) {
    const tmp = await Room.find();
    for (let i = 0; i < tmp.length; i++) {
      if (tmp[i].first_player.pid === id || tmp[i].second_player.pid === id)
        return true;
    }
    return false;
  };

  const findPid = async function (room) {
    const tmp = await Room.find({ name: room });
    if (!tmp[0]) return [];
    else
      return [
        [tmp[0].first_player.pid, tmp[0].first_player.sid],
        [tmp[0].second_player.pid, tmp[0].second_player.sid],
      ];
  };

  const updateResults = async (id, winner, grade, time, indexOfQuestion) => {
    const user = await UserData.find({ pid: id });
    const userLevel = await User.find({ _id: id });
    let tmp = {};
    let warTimesTmp = [];
    let tmpHistory = {};
    let index = -1;
    if (user[0]) {
      tmp = {
        gold: user[0].medals.gold,
        silver: user[0].medals.silver,
        bronze: user[0].medals.bronze,
      };
      warTimesTmp = [
        {
          longestWin: user[0].warTimes[0].longestWin,
          fastestWin: user[0].warTimes[0].fastestWin,
          avgWin: user[0].warTimes[0].avgWin,
          wins: user[0].warTimes[0].wins,
          losses: user[0].warTimes[0].losses,
        },
        {
          longestWin: user[0].warTimes[1].longestWin,
          fastestWin: user[0].warTimes[1].fastestWin,
          avgWin: user[0].warTimes[1].avgWin,
          wins: user[0].warTimes[1].wins,
          losses: user[0].warTimes[1].losses,
        },
        {
          longestWin: user[0].warTimes[2].longestWin,
          fastestWin: user[0].warTimes[2].fastestWin,
          avgWin: user[0].warTimes[2].avgWin,
          wins: user[0].warTimes[2].wins,
          losses: user[0].warTimes[2].losses,
        },
      ];
      if (winner) user[0].tier_points = user[0].tier_points + 50;
      else {
        if (user[0].tier_points - 30 >= 0)
          user[0].tier_points = user[0].tier_points - 30;
        else user[0].tier_points = 0;
      }

      switch (userLevel[0].tier) {
        case 'easy':
          index = 0;
          if (user[0].tier_points > 500) userLevel[0].tier = 'medium';
          break;
        case 'medium':
          index = 1;
          if (user[0].tier_points <= 500) userLevel[0].tier = 'easy';
          else if (user[0].tier_points > 1000) userLevel[0].tier = 'hard';
          break;
        case 'hard':
          index = 2;
          if (user[0].tier_points < 1000) userLevel[0].tier = 'medium';
          break;
      }
      if (winner) {
        user[0].wins = user[0].wins + 1;
        warTimesTmp[index].wins = warTimesTmp[index].wins + 1;
        if (grade >= 90) tmp.gold = tmp.gold + 1;
        else if (grade <= 70) tmp.bronze = tmp.bronze + 1;
        else tmp.silver = tmp.silver + 1;
      } else {
        user[0].losses = user[0].losses + 1;
        warTimesTmp[index].losses = warTimesTmp[index].losses + 1;
      }

      if (winner && time !== -1) {
        if (warTimesTmp[index].longestWin < time)
          warTimesTmp[index].longestWin = time;
        if (warTimesTmp[index].fastestWin > time)
          warTimesTmp[index].fastestWin = time;
        else if (warTimesTmp[index].fastestWin === 0)
          warTimesTmp[index].fastestWin = time;
        warTimesTmp[index].avgWin = warTimesTmp[index].avgWin + time;
      }
      if (indexOfQuestion !== -1) {
        const questionName = await Question.find({ index: indexOfQuestion });
        tmpHistory = {
          chLevel: questionName[0].level,
          chName: questionName[0].question.title,
          status: winner ? 'Win' : 'Lose',
          score: grade,
          time,
        };
        user[0].warHistory.push(tmpHistory);
        if (user[0].warHistory.length > 5)
          user[0].warHistory = user[0].warHistory.slice(1);
      }

      user[0].total_games = user[0].total_games + 1;
      user[0].grades.push(grade);
      user[0].exp = user[0].exp + 40 + (winner ? 20 : 0);
      if ((user[0].level + 1) * 100 <= user[0].exp) {
        user[0].exp = user[0].exp - (user[0].level + 1) * 100;
        user[0].level = user[0].level + 1;
      }
      user[0].medals = tmp;
      user[0].warTimes = warTimesTmp;

      try {
        await user[0].save();
        await userLevel[0].save();
      } catch (err) {
        console.log('Error: ' + err);
      }
    }
  };

  const saveTest = async function (id, tname, g, time, indexOfQuestion) {
    const user = await Test.find({ pid: id });
    const mainUser = await User.find({ _id: id });
    const userdata = await UserData.find({ pid: id });
    let temp = { test_name: tname, score: g, time: time };
    if (!userdata[0]) {
      const udata = new UserData({
        pid: id,
        exp: 70,
      });
      user[0].data.push(temp);
      user[0].indexes.push(indexOfQuestion);
      try {
        await udata.save();
        await user[0].save();
      } catch (err) {
        console.log('Error: ' + err);
      }
    } else {
      userdata[0].exp = userdata[0].exp + 70;
      if ((userdata[0].level + 1) * 100 <= userdata[0].exp) {
        userdata[0].exp = userdata[0].exp - (userdata[0].level + 1) * 100;
        userdata[0].level = userdata[0].level + 1;
      }
      user[0].data.push(temp);
      user[0].indexes.push(indexOfQuestion);

      if (user[0].indexes.length === 3) {
        let sumAvg = 0;
        let preLevel = user[0].pre_level;
        let institute = user[0].institute;
        let totalRegPoints = 0;
        switch (preLevel) {
          case 'Beginner':
            totalRegPoints = 0;
            break;
          case 'Intermediate':
            totalRegPoints = 5;
            break;
          case 'Expert':
            totalRegPoints = 10;
            break;
        }
        switch (institute) {
          case 'Alone':
            totalRegPoints = totalRegPoints + 2;
            break;
          case 'School':
            totalRegPoints = totalRegPoints + 5;
            break;
          case 'Academia':
            totalRegPoints = totalRegPoints + 7;
            break;
          case 'Work':
            totalRegPoints = totalRegPoints + 9;
            break;
        }
        for (let i = 0; i < 3; i++) {
          sumAvg = sumAvg + user[0].data[i].score;
        }
        sumAvg = parseInt(sumAvg / 3);
        if (sumAvg + totalRegPoints >= 80) {
          mainUser[0].tier = 'medium';
          userdata[0].tier_points = 500;
        } else mainUser[0].tier = 'easy';
      }
      try {
        await userdata[0].save();
        await user[0].save();
        await mainUser[0].save();
      } catch (err) {
        console.log('Error: ' + err);
      }
    }
    return mainUser[0].tier;
  };

  const calculateGrade = async function (indexOfQuestion, code) {
    let success = 0;
    let testCase, answer;
    let tmp = await findTestCases(indexOfQuestion);
    let questionTestCases = tmp.test;
    let type = tmp.type;
    let output = [];
    for (let i in questionTestCases) {
      testCase = questionTestCases[i][0];
      answer = questionTestCases[i][1];
      let temp = {};
      let codeAndTestCase = code + '\n' + 'print(' + testCase + ')';
      let resultPromise = await python.runSource(codeAndTestCase);
      if (resultPromise.stderr === '') {
        if (resultPromise.stdout === 'error\r\n' && answer === 'error') {
          // לטפל באותיות גדולות וקטנות
          success = success + 1;
          output[i] = [testCase, answer, answer, 'true'];
        } else {
          if (type === 'arr') {
            try {
              temp.res = resultPromise.stdout.replace('/r/n', '').trim();
              temp.res = JSON.parse('[' + temp.res + ']');
              let res = compareArrays(temp.res, answer);
              if (res === false)
                output[i] = [testCase, `[${temp.res}]`, `[${answer}]`, 'false'];
              else {
                success = success + 1;
                output[i] = [testCase, `[${temp.res}]`, `[${answer}]`, 'true'];
              }
            } catch {
              output[i] = [
                testCase,
                resultPromise.stdout,
                `[${answer}]`,
                'false',
              ];
            }
          } else {
            try {
              switch (type) {
                case 'int':
                  temp.res = parseInt(resultPromise.stdout);
                  break;
                case 'double':
                  temp.res = parseFloat(resultPromise.stdout);
                  break;
                default:
                  temp.res = resultPromise.stdout.replace('/r/n', '').trim();

                  // temp.res = resultPromise.stdout.slice(0, -2);
              }
            } catch {
              output[i] = [testCase, resultPromise.stdout, answer, 'false'];
            }
            if (temp.res === answer) {
              success = success + 1;
              output[i] = [testCase, temp.res, answer, 'true'];
              console.log('success1: ', success);
            } else output[i] = [testCase, temp.res, answer, 'false'];
          }
        }
      } else output[i] = [testCase, resultPromise.stderr, answer, 'false'];
    }
    console.log('success: ', success);
    let g = parseInt((success * 100) / questionTestCases.length);
    return { output, g };
  };

  let createNestedObject = function (base, names, value) {
    var lastName = arguments.length === 3 ? names.pop() : false;

    for (var i = 0; i < names.length; i++) {
      base = base[names[i]] = base[names[i]] || {};
    }

    if (lastName) base = base[lastName] = value;

    return base;
  };

  const compareArrays = (a, b) => {
    if (a.length !== b.length) return false;
    for (let i = 0; i < b.length; i++) if (a[i] !== b[i]) return false;
    return true;
  };
});

const findQuestion = async function (level) {
  const tmp = await Question.find({ level: level });
  let randomNum = Math.floor(Math.random() * tmp.length);
  return {
    question: tmp[randomNum].question,
    example: tmp[randomNum].example,
    constraints: tmp[randomNum].constraints,
    signature: tmp[randomNum].signature,
    index: tmp[randomNum].index,
  };
};

const findTestQuestion = async function (existingIndexes) {
  const tmp = await Question.find({ level: 'test' });
  let randomNum = Math.floor(Math.random() * tmp.length);
  while (existingIndexes.includes(tmp[randomNum].index)) {
    randomNum = Math.floor(Math.random() * tmp.length);
  }
  return {
    question: tmp[randomNum].question,
    example: tmp[randomNum].example,
    constraints: tmp[randomNum].constraints,
    signature: tmp[randomNum].signature,
    index: tmp[randomNum].index,
  };
};

const findTestCases = async function (index) {
  const tmp = await Question.find({ index: index });
  return { type: tmp[0].type, test: tmp[0].test_cases };
};

const alredyOnline = (id) => {
  for (let i = 0; i < onlineUsers.length; i++) {
    if (onlineUsers[i].id == id) return true;
  }
  return false;
};

mongoose.connect(process.env.DB_CONNECT, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
});
const connection = mongoose.connection;
connection.once('open', () => {
  console.log('MongoDB database connection established successfully');
});

server.listen(process.env.PORT || 4000, () =>
  console.log(`Server has started.`)
);
