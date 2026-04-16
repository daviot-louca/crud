module.exports = {
  HOST: process.env.HOST,
  USER: process.env.USER,
  PASSWORD: process.env.PASSWORD,
  DB: process.env.DB,
  PORT: process.env.DB_PORT,
  dialect: "mssql",
  dialectOptions: {
    options: {
      trustServerCertificate: true,
      encrypt: false
    }
  },
  pool: { max: 5, min: 0, acquire: 30000, idle: 10000 }
};

console.log({
  HOST: process.env.HOST,
  USER: process.env.USER,
  PASSWORD: process.env.PASSWORD,
  DB: process.env.DB
});