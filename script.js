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

async function search(value) {
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
