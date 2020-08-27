const request = require("request");
const url = "https://uslugi.mosreg.ru/zdrav/doctor_appointment/api/doctors?lpuCode=0601011&departmentId=25&doctorId=&days=14";

function makeRequest(callback) {
  request(url, { json: true }, (err, res) => {
    if (err) {
      callback(err, null);
    }

    console.log('Check!')

    callback(null, res.body.items);
  })
}

module.exports = makeRequest;
