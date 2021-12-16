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

    
});

router.post('/checkin/', (req, res) => {
    let patient = req.body
    console.log(patient);
    let patient_name
    let patient_id
    if(!patient.username || !patient.date){
        return res.status(400).send({error: true, message:'Please provide Data.'});
    }
    // console.log(patient.username); [patient.username, patient.username] (pfname=? or plname=?)
    dbConn.query('select * from patient where (pfname=? or plname=?)',[patient.username, patient.username], (error, results) =>{
        if (error){
            throw error
        }
        console.log(results);
        if (!results){
            return res.status(400).send({error: true, message:'User not found.'});
        }
        patient_name = results[0].pfname
        patient_id = results[0].pid
        console.log(patient.time);
        dbConn.query('insert into clinic.check (c_pid, c_pname, date, time, checkio) value (?, ?, ?, ?, ?)', [patient_id, patient_name, patient.date, patient.time, 'IN'], (error, results) => {
            if (error){
                throw error
            }
            res.send({error:false,message:'Data added'});
        })
    })
})

router.post('/checkout/', (req, res) => {
    let patient = req.body
    console.log(patient);
    let patient_name
    let patient_id
    if(!patient.username || !patient.date){
        return res.status(400).send({error: true, message:'Please provide Data.'});
    }
    // console.log(patient.username); [patient.username, patient.username] (pfname=? or plname=?)
    dbConn.query('select * from patient where (pfname=? or plname=?)',[patient.username, patient.username], (error, results) =>{
        if (error){
            throw error
        }
        console.log(results);
        if (!results){
            return res.status(400).send({error: true, message:'User not found.'});
        }
        patient_name = results[0].pfname
        patient_id = results[0].pid
        console.log(patient.time);
        dbConn.query('insert into clinic.check (c_pid, c_pname, date, time, checkio) value (?, ?, ?, ?, ?)', [patient_id, patient_name, patient.date, patient.time, 'OUT'], (error, results) => {
            if (error){
                throw error
            }
            res.send({error:false,message:'Data added'});
        })
    })
})

router.post('/makeAppointment/', (req, res) => {
    let data = req.body
    let patient_name
    let patient_id
    let doctor_name
    let doctor_id
    console.log(data);
    if (!data.doctor || !data.patient || !data.date){
        return res.status(400).send({error: true, message:'Please provide Data.'});
    }
    dbConn.query('select * from patient where (pfname=? or plname=?)',[data.patient, data.patient], (error, results) =>{
        if (error){
            throw error
        }
        if (!results){
            return res.status(400).send({error: true, message:'User not found.'});
        }
        patient_name = `${results[0].pfname} ${results[0].plname}`
        patient_id = results[0].pid
        dbConn.query('select * from doctor where (dfname=? or dlname=?)',[data.doctor, data.doctor], (error, results) =>{
            if (error){
                throw error
            }
            if (!results){
                return res.status(400).send({error: true, message:'User not found.'});
            }
            doctor_id = results[0].did
            dbConn.query('insert into appointment (a_did, a_pid, date, n_patient, status) value (?, ?, ?, ?, ?)', [doctor_id, patient_id, data.date, patient_name, 'did not recieved treatment'], (error, results) => {
                if (error){
                    throw error
                }
                if (!results){
                    return res.status(400).send({error: true, message:'User not found.'});
                }
                res.send({error:false,message:'Data added'});
            })
        })
    })
})

var port = process.env.RDS_PORT || 3000

app.listen(port, () => {
    console.log(`Server listening at Port ${port}`);
})
