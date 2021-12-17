const bodyParser = require("body-parser");
const { json } = require("body-parser");
const e = require("express");
const { application } = require("express");

// Function checking if str is a valid integer
function isInt(str) {
    return !isNaN(str) && Number.isInteger(parseFloat(str));
}

// Function checking if str is a valid string 
function isString(x) {
    return Object.prototype.toString.call(x) === "[object String]"
  }

async function getAppointmentList(name) {
    console.log("haha")
    const res = await (await fetch("http://localhost:3000/getAppointmentList/" + name , {
        method: 'GET'
    })).json();
    console.log(res.data);
    let appointments = res.data;
    console.log(appointments);
    if(!appointments) {
        document.getElementById("res_appointment").innerHTML = `Cannot find Appointment`
    }
    let totalCost = 0
    lists = ''
    appointments.forEach(app =>{
        lists += 
            `
            <div class="card mb-3" style="width: 18rem; display:flex;">
                <div class="card-body">
                    <h5 class="card-title">Appointment ID: ${app.apid} </h5>
                    <h6 class="card-subtitle">By ${app.n_doctor}</h6> <br>
                    <h6>Diagnosis: ${app.diagnosis}</h6>
                    <h6>Prescription: ${app.prescription}</h6>
                    <h6>Date: ${new Date(app.date).toDateString()}</h6> <br>
                    Status: ${app.status} <br>
                </div>
            </div>
            `
            totalCost += 20000
        })
        lists += 
        `
        <br>
        <div class="text-center" style="">
        <h3>Total cost: ${totalCost} </h3>
        </div>
        `
    document.getElementById("res_appointment").innerHTML = lists
}


async function checkIn(name, date, time){
    console.log('hehe');
    const obj = {
        username: name,
        date: date,
        time: time + ':00'
    }
    console.log(obj);
    const res = await (await fetch("http://localhost:3000/checkin/", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(obj)
    })).json()
    if (res.error){
        alert('Data incorrect')
    } else{
        alert('Data added successfully.')
    }
    
}

async function checkOut(name, date, time){
    console.log('hoho');
    const obj = {
        username: name,
        date: date,
        time: time + ':00'
    }
    console.log(obj);
    const res = await (await fetch("http://localhost:3000/checkout/", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(obj)
    })).json()
    if (res.error){
        alert('Data incorrect')
    } else{
        alert('Data added successfully.')
    }
    
}

async function createAppointment(doctor, patient, date){
    const obj = {
        doctor: doctor,
        patient: patient,
        date: date
    }
    console.log(obj);
    const res = await (await fetch("http://localhost:3000/makeAppointment/", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(obj)
    })).json()
    if (res.error){
        alert('Data incorrect')
    } else{
        alert('Data added successfully.')
    }

}

async function diagnose(aid, allSymptom, comment, prescription){
    // console.log(allSymptom);
    let symptom
    allSymptom.forEach( sym => {
        if (sym.checked){
            symptom = sym
        }
    })
    // console.log(symptom);
    const obj = {
        aid: aid,
        symptom: symptom.value,
        comment: comment || 'no comment',
        prescription: prescription || 'none'
    }
    console.log(obj);
    const res = await (await fetch("http://localhost:3000/makeDiagnosis/", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(obj)
        })).json()
    if (res.error){
        alert('Data incorrect')
    } else{
        alert('Data added successfully.')
    }
}

async function getAppointment(aid){
    const res = await (await fetch("http://localhost:3000/getAppointment/" +aid, {
        method: 'GET'
    })).json();
    let appointments = res.data;
    console.log(appointments);
    if(!appointments) {
        document.getElementById("res_appointment").innerHTML = `
        <div class="result">
            <h3>Patient Name: Not found</h3><br>
            Doctor: -  <br>
            Date: -  <br>
            Status: -  <br>
        </div>
        `
    }
    else{
        text = 
        `
        <div class="result">
            <h3>Patient Name: ${appointments.patient_name} ${appointments.patient_sname} </h3><br>
            Doctor: ${appointments.doctor_name} ${appointments.doctor_sname}<br>
            Date: ${new Date(appointments.date).toDateString()} <br>
            Status: ${appointments.status} <br>
        </div>
        
        `
    document.getElementById("res_appointment").innerHTML = text
    }  
}

async function register(name, sname, address, email, bdate, phone, allGender){
    let gender
    allGender.forEach( gend => {
        if (gend.checked){
            gender = gend.value
        }
    })
    const obj = {
        fname: name,
        lname: sname,
        address: address,
        email: email,
        bdate: bdate,
        phone: phone,
        gender: gender
    }
    console.log(obj);
    const res = await (await fetch("http://localhost:3000/register/", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(obj)
        })).json()
    if (res.error){
        alert('Data incorrect')
    } else{
        alert('Data added successfully.')
    }
}

async function doPayment(pname, cname, cnum, exp, cvv){
    const req = {
        pname: pname,
        cname: cname,
        cnum: cnum,
        exp: exp,
        cvv: cvv,
    }
    const res = await (await fetch("http://localhost:3000/pay/", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
            },
        body: JSON.stringify(req)
        })).json()
    if (res.error){
        alert('Data incorrect')
    } else{
        alert('Data added successfully.')
    }
}