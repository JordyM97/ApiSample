const e = require('express');
const oracledb = require('oracledb');
const config = require('../config/conect')
const nemo = {
	CAJA: 1 ,
	KIOSKO: 2,
}
var response={
    code: 401,
    success: false,
    message: "Las cedenciales de autenticación no son válidas.",
    Data: []
}

const data={
    secuencia:"",
    codigoE:"",
    codigoU:"",
    activo:'',
    usuarioI: '',
    codigoPre:'',
    nemo:'',
    tipo:'FACTURA',
    codse: null,
    codca:null,
    numPE:null,
}

exports.inicializar= async (req,res) =>{
    if(req.headers!=null){  
        data.usuarioI=new Date()
        if(req.headers['application']=="UEhBTlRPTVhfV0VC" && req.headers['idorganizacion']=="365509c8-9596-4506-a5b3-487782d5876e"){
            
            if(!req.body){                response.code=400;     response.success=false; response.message="El campo no es valido.";    res.status(400).send(response);
            }
            else{
                data.secuencia=req.body.secuenciaUsuario;
                if(!req.body.nemonicoCanalFacturacion)console.log("d")
                else if (req.body.nemonicoCanalFacturacion=='CAJA')   data.nemo=nemo.CAJA
                else if (req.body.nemonicoCanalFacturacion=='KIOSKO')   data.nemo=nemo.KIOSKO
                else{  response.code=400; response.message="El campo no es valido.";  response.data="No Data found"; res.status(400).send(response)      }
                
                try {
                    var connection = await oracledb.getConnection(config);

                    let resp = await connection.execute('select * from latino_owner.Dafx_Usuarios_Sistema where SECUENCIA_USUARIO ='+data.secuencia)
                    //console.log(resp)
                    if(resp.rows.length>0){
                        data.codigoE=resp.rows[0][1]; //metaData
                        data.codigoU=resp.rows[0][4];
                        data.activo=resp.rows[0][27]; 
                        //console.log(data)
                        resp=await connection.execute('select CODIGO_EMPRESA from latino_owner.Daf_Empresas where CODIGO_EMPRESA ='+data.codigoE)
                        data.codigoE=resp.rows[0][0];
                        resp= await connection.execute('select latino_owner.FAC_SEQ_PRE_TRANSACCIONES.Nextval from dual');
                        if(resp.rows.length>0){
                            data.codigoPre=resp.rows[0][0];
                            //console.log(data)
                            if(req.body.caja){
                                console.log('hay caja')
                                if(!req.body.caja.codigoSucursal || !req.body.caja.codigoCaja || !req.body.caja.numeroPuntoEmision){
                                    console.log('no tiene datos')
                                    resp= await connection.execute("INSERT into latino_owner.Fac_Pre_Transacciones(CODIGO_PRE_TRANSACCION,CODIGO_EMPRESA,SECUENCIA_USUARIO,CODIGO_USUARIO,TIPO_PRE_TRANSACCION,CODIGO_CANAL_FACTURACION,ES_ACTIVO,SECUENCIA_USUARIO_INGRESO,USUARIO_INGRESO,FECHA_INGRESO) values "   //(CODIGO_PRE_TRANSACCION,CODIGO_EMPRESA,SECUENCIA_USUARIO,CODIGO_USUARIO,TIPO_PRE_TRANSACCION,CODIGO_CANAL_FACTURACION,ES_ACTIVO,SECUENCIA_USUARIO_INGRESO,USUARIO_INGRESO,FECHA_INGRESO)
                                    +"(:0, :1, :2, :3, :4, :5, :6, :7, :8, :9)",
                                    [data.codigoPre, data.codigoE, data.secuencia, data.codigoU, data.tipo, data.nemo, data.activo, data.secuencia, data.codigoU, data.usuarioI],{ autoCommit: true } ); //values(21,1,968,'ENEVAREZ','FACTURA',1,'S',968,'ENEVAREZ',SYSDATE)');
                                    response.code=200; response.success=true; response.message=resp; response.Data=["idPreTransaccion ="+data.codigoPre]
                                    res.status(200).send(response);
                                    connection.close()
                                }
                                else{
                                    console.log('tiene datos')
                                    console.log(req.body.caja)
                                    resp= await connection.execute("INSERT into latino_owner.Fac_Pre_Transacciones(CODIGO_PRE_TRANSACCION,CODIGO_EMPRESA,CODIGO_SUCURSAL,CODIGO_CAJA,NUMERO_PUNTO_EMISION,SECUENCIA_USUARIO,CODIGO_USUARIO,TIPO_PRE_TRANSACCION,CODIGO_CANAL_FACTURACION,ES_ACTIVO,SECUENCIA_USUARIO_INGRESO,USUARIO_INGRESO,FECHA_INGRESO) values "   //(CODIGO_PRE_TRANSACCION,CODIGO_EMPRESA,SECUENCIA_USUARIO,CODIGO_USUARIO,TIPO_PRE_TRANSACCION,CODIGO_CANAL_FACTURACION,ES_ACTIVO,SECUENCIA_USUARIO_INGRESO,USUARIO_INGRESO,FECHA_INGRESO)
                                    +"(:0, :1, :2, :3, :4, :5, :6, :7, :8, :9, :10, :11, :12)",
                                    [data.codigoPre, data.codigoE,req.body.caja.codigoSucursal,req.body.caja.codigoCaja,req.body.caja.numeroPuntoEmision ,data.secuencia, data.codigoU, data.tipo, data.nemo, data.activo, data.secuencia, data.codigoU, data.usuarioI],{ autoCommit: true } ); //values(21,1,968,'ENEVAREZ','FACTURA',1,'S',968,'ENEVAREZ',SYSDATE)');
                                    res.status(200).send(response);
                                    connection.close()
                                }
                            }
                            ;
                            
                        }
                        else{connection.commit(); connection.close(); response.code=500; response.message="Ha ocurrido un error inesperado.";  resp.data=resp; res.status(500).send(response); }


                    }
                    else{connection.commit(); connection.close(); response.code=500; response.message="Ha ocurrido un error inesperado.";  resp.data="No Data found"; res.status(500).send(response); }
                    
                    
                    

                 } catch (err) {
                     //console.log('not connected to database'); 
                     response.Data=[err.message]
                     //res.send(response)
                 } 
                
                
            }
        }else{
            response.code=401; response.success=false; response.message="Las cedenciales de autenticación no son válidas."
            res.status(401).send(response)
        }
    }


}