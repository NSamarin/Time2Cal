var exportArray;
var formattedDateStart;
var formattedDateEnd;

function generateFile(startYear, startMonth, startDay, items, isCSVRequest){
    exportArray = [];
    //create export array and populate the headers iff isCSVRequest
    if (isCSVRequest) {
        exportArray = [{
            subject: "Subject",
            startDate: "Start Date",
            startTime: "Start Time",
            endDate: "End Date",
            endTime: "End Time",
            allDayEvent: "All Day Event",
            location: "Location",
            private: "Private"
        }];
    }

    //Filter "items" array so that only lecture events are created
    var lectures = items.filter(function (item) {
        return item.type == "Lecture";
    });

    //loop through lectures
    for (var i = 0; i < lectures.length; i++) {
        var currentItem = lectures[i];
        //get the weeks property
        var weeks = currentItem["weeks"];
        //extract correctly formatted start and end times
        var times = extractTime(currentItem["times"], isCSVRequest);
        //get day offsets for the current item
        var dayOffset = getDayOffset(currentItem["day"]);
        //loop the weeks array to create events for one item corresponding to all weeks
        for (var k = 0; k < weeks.length; k++) {
            //get the week offset - that is how many days need to be added to the initial date
            var weekOffset = (parseInt(weeks[k]) - 1) * 7;
            //create the date object for all the events for a particular item
            var date = new Date(startYear, startMonth, (startDay + dayOffset + weekOffset));
            //varies depending on request
            if (isCSVRequest) {
                formattedDateStart = date.getMonth() + 1 + '/' + date.getDate() + '/' + date.getFullYear();
                formattedDateEnd = formattedDateStart; //no difference in CSV
            } else {
                var month = (date.getMonth() + 1).toString();
                var day = date.getDate().toString();
                if (month.length == 1) month = "0" + month;
                if (day.length == 1) day = "0" + day;

                formattedDateStart = date.getFullYear().toString() + month + day + 'T' +
                    times["startTime"] + "Z";
                formattedDateEnd = date.getFullYear().toString() + month + day + 'T' +
                    times["endTime"] + "Z";
            }

            //push events to the export array
            exportArray.push({
                subject: currentItem["course"],
                startDate: formattedDateStart,
                startTime: times["startTime"],
                endDate: formattedDateEnd,
                endTime: times["endTime"],
                allDayEvent: false,
                location: '\"' + currentItem["location"]  + '\"',
                private: true
            });
        }
    }
    return exportArray;
}


function getDayOffset(day) {
    var dayOffset;
    switch (day) {
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
    return dayOffset;
}

function extractTime(timeProperty, isCSVRequest) {
    var times = timeProperty.split(",");
    var start = times[0].substr(6);
    var end = times[1].substr(4);
    if (isCSVRequest) return {startTime: formatTimeCSV(start), endTime: formatTimeCSV(end)};
    return {startTime: formatTimeICS(start), endTime: formatTimeICS(end)};
}

function formatTimeCSV(time) {
    var hour = parseInt(time.substr(0, 2));
    if (hour <= 12) time += " AM";
    else time = (hour - 12) + time.substr(2) + " PM";
    return time;
}

function formatTimeICS(time) {
    var hour = time.substr(0, 2);
    var minutes = time.substr(3, 5);
    return hour + minutes + "00";
}

module.exports = generateFile;