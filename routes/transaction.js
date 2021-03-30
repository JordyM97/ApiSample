module.exports = app => {
    const transaccion= require("../controllers/transactionController")
    var router = require("express").Router();
    router.post("/pre_transacciones/inicializar",transaccion.inicializar)
    router.get("/pre_transacciones/inicializar", (req,res)=>{
        res.json({"message":"Only POST method allowed"})
    })
    app.use('/facturacion/v1/', router);
}