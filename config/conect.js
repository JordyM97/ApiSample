const dbConfig= require('../config/dbconfig')
module.exports = {
     
    user: dbConfig.USER,
    password: dbConfig.PASSWORD,
    connectString: "(DESCRIPTION=(ADDRESS=(PROTOCOL=TCP)(HOST="+dbConfig.HOST+")(PORT="+dbConfig.PORT+"))(CONNECT_DATA=(SID="+dbConfig.DB+")(SERVER = DEDICATED)(SERVICE_NAME = PRODUCCION)))"    // (SERVER = DEDICATED)(SERVICE_NAME = PRODUCCION) )))
        
    
}