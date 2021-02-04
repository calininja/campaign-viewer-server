const dotenv = require('dotenv');
dotenv.config();
const product = process.env.NODE_ENV === 'production';

module.exports = {
  development: {
    username: product ? "bf07d567eef332" : "root",
    password: process.env.DB_PASSWORD,
    database: product ? "heroku_38f4529c4bfc288" : "campaign-viewer-server",
    host: product ? "us-cdbr-east-03.cleardb.com" : "127.0.0.1",
    dialect: "mysql",
    timezone: "+09:00",
  },
  test: {
    username: product ? "bf07d567eef332" : "root",
    password: process.env.DB_PASSWORD,
    database: product ? "heroku_38f4529c4bfc288" : "campaign-viewer-server",
    host: product ? "us-cdbr-east-03.cleardb.com" : "127.0.0.1",
    dialect: "mysql"
  },
  production: {
    username: product ? "bf07d567eef332" : "root",
    password: process.env.DB_PASSWORD,
    database: product ? "heroku_38f4529c4bfc288" : "campaign-viewer-server",
    host: product ? "us-cdbr-east-03.cleardb.com" : "127.0.0.1",
    dialect: "mysql"
  }
}
// module.exports = {
//   development: {
//     username: "root",
//     password: process.env.DB_PASSWORD,
//     database: "campaign-viewer-server",
//     host: "127.0.0.1",
//     dialect: "mysql",
//     timezone: "+09:00",
//   },
//   test: {
//     username: "root",
//     password: process.env.DB_PASSWORD,
//     database: "campaign-viewer-server",
//     host: "127.0.0.1",
//     dialect: "mysql"
//   },
//   production: {
//     username: "root",
//     password: process.env.DB_PASSWORD,
//     database: "campaign-viewer-server",
//     host: "127.0.0.1",
//     dialect: "mysql"
//   }
// }

// module.exports = {
//   development: {
//     username: "bf07d567eef332",
//     password: process.env.DB_PASSWORD,
//     database: "heroku_38f4529c4bfc288",
//     host: "us-cdbr-east-03.cleardb.com",
//     dialect: "mysql",
//     timezone: "+09:00",
//   },
//   test: {
//     username: "bf07d567eef332",
//     password: process.env.DB_PASSWORD,
//     database: "heroku_38f4529c4bfc288",
//     host: "us-cdbr-east-03.cleardb.com",
//     dialect: "mysql"
//   },
//   production: {
//     username: "bf07d567eef332",
//     password: process.env.DB_PASSWORD,
//     database: "heroku_38f4529c4bfc288",
//     host: "us-cdbr-east-03.cleardb.com",
//     dialect: "mysql"
//   }
// }
