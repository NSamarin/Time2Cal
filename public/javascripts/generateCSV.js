function generateCSV(startYear, startMonth, startDay, items) {

    var exportArray = [];
    var headersArray = ["Subject", "Start Date", "Start Time", "End Date", "End Time", "All Day Event", "Location", "Private"];

    var n = 0;

    exportArray[n] = {
        subject: headersArray[0],
        startDate: headersArray[1],
        startTime: headersArray[2],
        endDate: headersArray[3],
        endTime: headersArray[4],
        allDayEvent: headersArray[5],
        location: headersArray[6],
        private: headersArray[7]
    };

    n++;

    var numberOfEvents = items.length;
    var numberOfHeaders = headersArray.length;

    for (i = 0; i < numberOfEvents; i++) {
        if (items[i].type.indexOf("Lecture") !== -1) {

            var numberOfWeeks = items[i].weeks.length;

            var weekNumber;
            var dayOffset;

            switch (items[i].day) {
                case "Monday":
                    dayOffset = 0;
                    break;
                case "Tuesday":
                    dayOffset = 1;
                    break;
                case "Wednesday":
                    dayOffset = 2;
                    break;
                case "Thursday":
                    dayOffset = 3;
                    break;
                case "Friday":
                    dayOffset = 4;
                    break;
                case "Saturday":
                    dayOffset = 5;
                    break;
                case "Sunday":
                    dayOffset = 6;
                    break;
            }


            var newEvent = new Array(numberOfWeeks);
            for (var j = 0; j < numberOfWeeks; j++) {
                newEvent[j] = new Array(8);
            }

            for (j = 0; j < numberOfWeeks; j++) {

                var date = new Date(startYear, startMonth, startDay);

                if (items[i].weeks[j] <= 5) {
                    weekNumber = items[i].weeks[j];
                } else {
                    weekNumber = parseInt(items[i].weeks[j]) + 1;
                }

                date.setDate(date.getDate() + (weekNumber - 1) * 7 + dayOffset);


                var time = items[i].times.split(",");

                newEvent[j][0] = items[i].course + " (" + items[i].type + ")";
                newEvent[j][1] = date.getDate() + '/' + (date.getMonth() + 1) + '/' + date.getFullYear();
                newEvent[j][2] = time[0].substring(6) + ":00";
                newEvent[j][3] = date.getDate() + '/' + (date.getMonth() + 1) + '/' + date.getFullYear()
                newEvent[j][4] = time[1].substring(4) + ":00";
                newEvent[j][5] = "False";
                newEvent[j][6] = '"' + items[i].location + '"';
                newEvent[j][7] = "True";

                exportArray[n + j] = {
                    subject: newEvent[j][0],
                    startDate: newEvent[j][1],
                    startTime: newEvent[j][2],
                    endDate: newEvent[j][3],
                    endTime: newEvent[j][4],
                    allDayEvent: newEvent[j][5],
                    location: newEvent[j][6],
                    private: newEvent[j][7]
                };

            }

            n += numberOfWeeks;
        }
    }

    return exportArray;

}

module.exports = generateCSV;