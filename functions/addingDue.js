const {onCall, HttpsError} = require("firebase-functions/https");
const {logger} = require("firebase-functions");
const {getDatabase} = require("firebase-admin/database");
const sanitizer = require("./sanitizer");
const { log } = require("firebase-functions/logger");

exports.addDue = onCall((data,context) => {
    const {  amount } = data;
    // console.log("request data is ");
    return "method is working okdsf"
    
  // ...
});
