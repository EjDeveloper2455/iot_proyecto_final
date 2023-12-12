const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const mysql =  require('promise-mysql');
const config = require('./config');

const SECRET_KEY = 'proyectofinalIoT';



const conf = config.config;

const connection = mysql.createConnection({
    host: conf.host,
    database: conf.database,
    user: conf.user,
    password: conf.password,
    port: 3306,
    timeout: 60000
});

const getConnection = ()=>{
    return connection;
};

exports.authenticate = async (req, res, next) => {
    //Se verifica que se llegue un token de autenticacion
    const authHeader = req.headers.authorization;
    if(!authHeader){
        res.status(401).send('El Token es necesario para esta operación');
        return;
    }
    //Se verifica que el token que llega sea del tipo Bearer Token
    const [type, token] = authHeader.split(' ');
    if(type !== 'Bearer'){
        res.status(401).send('Tipo de Autorizacion no valida');
        return;
    }
    
    try{
        //Se decodifica el token
        const decoded = jwt.verify(token, SECRET_KEY);
        
        const {user} = decoded;

        /*Se establece la conexion y consulta para verificar que el usuario 
        que se llega exista en la base de datos*/
        const connection = await getConnection();
        var userData = await connection.query("SELECT * FROM v_usuario where email = ?;",[user.Email]);

        if(userData.length>0){
            next();
        }else{
            res.status(401).send('No tienes permiso para realizar esta operación');
            return;
        }
    }catch(err){
        res.status(401).send('Token Inválido');
        return;
    }
}

exports.signUp = async (req,res) =>{
    try{
        var {email,nombre,password,rol} = req.body;
        const connection = await getConnection();
        const result = await connection.query("INSERT INTO `tbl_usuario` (`usuario_email`,`usuario_nombre_completo`, `usuario_password`, `usuario_rol`) VALUES (?, ?, ?, ?); ",[email,nombre,password,rol]);
        if(result){
            const payload = {email: email.email,role: rol};
            
            const token = jwt.sign(payload, SECRET_KEY);
            res.json({email,rol,token});
        }
    }catch(err){
        console.log(err);
        res.status(500).send(err.message);
    }
};


exports.login = async(req, res) =>{
    try{
        const {email,password} = req.body;
        const connection = await getConnection();
        const result = await connection.query("SELECT * FROM v_usuario where email = ?;",[email]);
        if(result.length == 0){
            res.status(401).send('Credenciales incorrecta');
            return;
        }
        if(password != result[0].password){
            res.status(401).send('Credenciales incorrecta');
        }else{
            const user = {"Email": result[0].email,"Rol": result[0].rol,"Nombre": result[0].nombre,};
            const payload = {user};
            
            const token = jwt.sign(payload, SECRET_KEY);
            res.json({user, token});
        }
    }catch(err){
        console.log(err);
        res.status(500).send("login: Hubo un error: " + err);
    }
};

exports.verificar = async(req, res) =>{
    try{
        const {campus,carrera, anio,periodo} = req.body;
        const connection = await getConnection();
        const result = await connection.query("Select registro_id as id from tbl_registro where campus_id = ? and carrera_id = ? and registro_anio = ? and periodo_id = ?;",[campus,carrera, anio,periodo]);
        
        if(result.length == 0){
            res.send("-1");
        }else {
            res.send(result[0].id+"");
        }
        
    }catch(err){
        console.log(err);
        res.send(" Hubo un error: " + err);
    }
};