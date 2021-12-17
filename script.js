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

async function searchAppointment(value) {
    console.log("haha")
    const res = await (await fetch("http://localhost:3000/appointment_of_doctor/" +value, {
        method: 'GET'
    })).json();
    let appointments = res.data;
    console.log(appointments);
    if(!appointments) {
        document.getElementById("res_appointment").innerHTML = `Cannot found`
    }
    lists = ''
    appointments.forEach(app =>{
        lists += 
        `
        <link rel="stylesheet" type="text/css" href="appointment.css">
        <div class="result">
            <h3>Patient ID: ${app.a_pid} </h3><br>
            Name: ${app.n_patient} <br>
            Date: ${new Date(app.date).toDateString()} <br>
            Time: ${app.time} <br>
            Status: ${app.status} <br><br>
        </div>
        
        `

    })

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