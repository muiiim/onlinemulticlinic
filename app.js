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
router.get('/getAppointmentList/:name', (req,res) => {
    let patient_name = req.params.name;
    let pat_id
    if(!patient_name) {
        return res.status(400).send({error: true, message:'Please provide patient name.'});
    }
    dbConn.query('SELECT * FROM patient WHERE (pfname=? OR plname=?)', [patient_name, patient_name],(error,patients) => {
        if(error) {
            throw error;
        }
        pat_id = patients[0].pid
        dbConn.query('select * from appointment where (a_pid=? and status=?)', [pat_id, 'received treatment'], (error, appointments) => {
            if (error){
                throw error
            }
            res.send({error:false,data:appointments,message:'Appointment retrieved'});
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
            return res.status(400).send({error: true, message:'Patient not found.'});
        }
        patient_name = `${results[0].pfname} ${results[0].plname}`
        patient_id = results[0].pid
        dbConn.query('select * from doctor where (dfname=? or dlname=?)',[data.doctor, data.doctor], (error, doctors) =>{
            if (error){
                throw error
            }
            if (!doctors){
                return res.status(400).send({error: true, message:'Doctor not found.'});
            }
            doctor_id = doctors[0].did
            dbConn.query('insert into appointment (a_did, a_pid, date, n_patient, n_doctor, status) value (?, ?, ?, ?, ?, ?)', [doctor_id, patient_id, data.date, patient_name, `${doctors[0].dfname} ${doctors[0].dlname}`,'did not recieved treatment'], (error, results) => {
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

router.get('/getAppointment/:aid', (req,res) => {
    let aid = req.params.aid;
    let doctor_id
    let doctor_name
    let a_date
    if(!aid) {
        return res.status(400).send({error: true, message:'Please provide appointment ID.'});
    }

    dbConn.query('SELECT * FROM appointment WHERE apid=?', aid,(error,results) => {
        if(error) {
            throw error;
        }
        if (results.length === 0){
            return res.status(400).send({error: true, message:'Patient not found.'});
        }
        patient_name = results[0].n_patient.split(' ')
        doctor_id = results[0].a_did
        a_date = results[0].date
        dbConn.query('select * from doctor where did=?', [doctor_id], (error, doc_results) => {
            if (error){
                throw error
            }
            if (doc_results.length === 0){
                return res.status(400).send({error: true, message:'Doctor not found.'});
            }
            const obj = {
                patient_name: patient_name[0],
                patient_sname: patient_name[1],
                doctor_name: doc_results[0].dfname,
                doctor_sname: doc_results[0].dlname,
                date: a_date,
                status: results[0].status
            }
            res.send({error:false,data: obj, message:'Data retreived'});
        })
    });

    
});

router.post('/makeDiagnosis/', (req, res) =>{
    let inp = req.body
    if (!inp){
        return res.status(400).send({error: true, message:'Please provide appointment ID.'});
    }
    dbConn.query('select * from clinic.disease_symptoms where sid=?', [inp.symptom], (error, sym) =>{
        if (error){
            throw error
        }
        if (!sym){
            return res.status(400).send({error: true, message:'Symptom not found'});
        }
        dbConn.query('select * from appointment where apid=?', [inp.aid], (error, appointment) => {
            if (error){
                throw error
            }
            if (!appointment){
                return res.status(400).send({error: true, message:'Appointment not found'});
            }
            dbConn.query('select * from clinic.check where (c_pid=? and checkio=?) order by checkid desc', [appointment[0].a_pid, 'IN'], (error, check) => {
                if (error){
                    throw error
                }
                if (!check){
                    return res.status(400).send({error: true, message:'Timestamp not found'});
                }
                console.log(check);
                dbConn.query('update clinic.appointment set a_sid=?, symptom=?, diagnosis=?, comments=?, status=?, time=?, prescription=? where apid=?', [inp.symptom, sym[0].symptoms, sym[0].disease, inp.comment, 'received treatment', check[0].time, inp.prescription, inp.aid], (error, results) =>{
                    if (error){
                        throw error
                    }
                    dbConn.query('replace into payment set p_pid=?, name=?, totalcost=?, p_apid=?, is_check=?', [appointment[0].a_pid, appointment[0].n_patient, 20000, appointment[0].apid, 0], (error, resutl) => {
                        if (error){
                            throw error
                        }
                        res.send({error:false,message:'Appointment updated'});
                    })
                })
            })
            
        })
        
    })
    
})

router.post('/register/', (req, res) => {
    let data = req.body
    if (!data){
        return res.status(400).send({error: true, message:'Please provide data.'});
    }
    dbConn.query('replace into patient set pfname=?, plname=?, paddress=?, pemail=?, pbd=?, pphone=?, pgender=?', [data.fname, data.lname, data.address, data.email, data.bdate, data.phone, data.gender], (error, results) => {
        if (error){
            throw error
        }
        res.send({error:false,message:'Patient added'});
    })
})

router.post('/pay/', (req, res) => {
    let patient_name = req.body.pname
    let data = req.body
    let patient_id
    console.log(data);
    if(!patient_name){
        return res.status(400).send({error: true, message:'Please provide patient name.'});
    }
    dbConn.query('select * from patient where (pfname=? or plname=?)',[data.pname, data.pname], (error, patients) =>{
        if (error){
            throw error
        }
        if (!patients){
            return res.status(400).send({error: true, message:'Patient not found.'});
        }
        dbConn.query('select * from appointment where (a_pid=? and status=?)', [patients[0].pid, 'received treatment'], (error, appointments) => {
            appointments.forEach(app => {
                console.log(app);
                dbConn.query('update payment set creditcard=?, name=?, exp=?, cvv=?, totalcost=?, is_check=? where (p_apid=? and is_check=?)', [data.cnum, data.cname, `01/${data.exp}`, data.cvv, 20000, 1, app.apid, 0], (err, res) => {
                    if (err){
                        throw err
                    }
                })
            })
        })
        
    })
    res.send({error:false,message:'Payment successful'});
})

var port = process.env.RDS_PORT || 3000

app.listen(port, () => {
    console.log(`Server listening at Port ${port}`);
})
