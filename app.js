const express = require("express");
const router = express.Router();
const mysql = require("mysql2");
const bp = require("body-parser");
const dotenv = require("dotenv");
dotenv.config();
const cors = require("cors");
router.use(cors());
const app = express();

app.use("/",router);
router.use(bp.json());

var dbConn = mysql.createConnection({
    host: process.env.RDS_HOSTNAME,
    user: process.env.RDS_USERNAME,
    password: process.env.RDS_PASSWORD,
    database: process.env.RDS_DB_NAME
});

dbConn.connect((err) => {
    if(err) throw err;
    console.log(`Connect DB: ${process.env.RDS_DB_NAME}`);
});

// Search appointment for each doctor
router.get('/appointment_of_doctor/:name', (req,res) => {
    let doctor_name = req.params.name;
    console.log(doctor_name)
    let doc_id
    if(!doctor_name) {
        return res.status(400).send({error: true, message:'Please provide doctor name.'});
    }

    dbConn.query('SELECT * FROM doctor WHERE (dfname=? OR dlname=?)', [doctor_name, doctor_name],(error,results) => {
        if(error) {
            throw error;
        }
        doc_id = results[0].did
        // console.log(doc_id);
        // res.send({error:false,data:results,message:'Name retrieved'});
        dbConn.query('select * from appointment where a_did=?', [doc_id], (error, results) => {
            if (error){
                throw error
            }
            res.send({error:false,data:results,message:'Appointment retrieved'});
        })
    });

    // console.log(doc_id);
    
});

router.get('')

var port = process.env.RDS_PORT || 3000

app.listen(port, () => {
    console.log(`Server listening at Port ${port}`);
})
