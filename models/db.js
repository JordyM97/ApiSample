const dbConfig = require("../config/dbconfig.js");
const oracledb = require('oracledb');

async function checkConnection() {
    try {
       connection = await oracledb.getConnection({
          user: dbConfig.USER,
          password: dbConfig.PASSWORD,
          connectString: "(DESCRIPTION=(ADDRESS=(PROTOCOL=TCP)(HOST="+dbConfig.HOST+")(PORT="+dbConfig.PORT+"))(CONNECT_DATA=(SID="+dbConfig.DB+")(SERVER = DEDICATED)(SERVICE_NAME = PRODUCCION)))"    // (SERVER = DEDICATED)(SERVICE_NAME = PRODUCCION) )))
          
      });
      console.log('connected to database');
      //const res = await connection.execute('select * from latino_owner.Dafx_Usuarios_Sistema where ')
      //onsole.log(res);
    } catch (err) {
        console.log('not connected to database'); 
      console.error(err.message);
    } 
  }
  
  checkConnection();
