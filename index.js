const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const expressSession = require('express-session');
const dotenv = require('dotenv');

const db = require('./models');
const postAPIRouter = require('./routes/post');

dotenv.config();
const app = express();
db.sequelize.sync()
  .then(() => {
    console.log('db 연결 성공 db 연결 성공 db 연결 성공 db 연결 성공 db 연결 성공 db 연결 성공 db 연결 성공 ');
  })
  .catch(console.error);
  
// 미들웨어
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
  origin: process.env.NODE_ENV === 'production' ? 'https://campaign-viewer.herokuapp.com' : 'http://localhost:3060',
  // origin: 'https://campaign-viewer.herokuapp.com',
  // origin: 'http://localhost:3060',
  // origin: true,
  credentials: true,
}));
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(expressSession({
  resave: false,
  saveUninitialized: false,
  secret: 'secretidhere', // secret문제로 500 에러.
  // secret: process.env.COOKIE_SECRET,
  cookie: {
    httpOnly: true,
    secure: false, // https를 쓸 때 true
  },
  name: 'campaign-viewer',
}));

// routes 폴더로 분리: 라우터
app.use('/post', postAPIRouter);

// 서버 실행
// app.listen(3065, () => {
//   console.log('server is running on localhost:3065]')
// });

app.listen(process.env.PORT || 3065, function(){
  console.log("Express server listening on port %d in %s mode", this.address().port, app.settings.env);
});