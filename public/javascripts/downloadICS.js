var fs = require('fs');
var generateICS = require('./generate');

function downloadICS(items) {

    var data = generateICS(2015, 8, 22, items);
    var csvData = [];

    csvData.push("BEGIN:VCALENDAR\rVERSION:2.0\rPRODID:-//Timetable2Calendar//EN\rCALSCALE:GREGORIAN\rX-WR-CALNAME;VALUE=TEXT:timetable");

    data.forEach(function (item, index, array) {

        csvData.push("BEGIN:VEVENT\rSUMMARY:" + item.subject + "\rDESCRIPTION:\rDTSTAMP:" + item.startDate + "\rDTSTART:" + item.startDate + "\rDTEND:" + item.endDate + "\rLOCATION:" + item.location + "\rEND:VEVENT\r");
    });

    csvData.push("END:VCALENDAR");
    // download stuff
    var buffer = csvData.join("\n");
    var uri = "data:text/csv;charset=utf8," + encodeURIComponent(buffer);
    var fileName = "timetable.ics";
    fs.writeFile(fileName, buffer, function (err) {
        console.log('File successfully written! - Check your project directory for the timetable.ics file');
    });
}

module.exports = downloadICS;