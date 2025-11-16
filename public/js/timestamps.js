
/**
 * Some code adapted from: https://github.com/Dot32Dev/discord-timestamp-generator
 */

const dateTimeInput = document.getElementById("datetime");
const intervalInput = document.getElementById("setInterval");
const slotCountInput = document.getElementById("slotCount");
const previewText = document.getElementById("datePreview");
const timezoneSelect = document.getElementById("timezone");
const timestampTypeSelect = document.getElementById("type");
const copyButton = document.getElementById("copyTimestampsBtn");
const timestampsText = document.getElementById("timestamps");

document.addEventListener("DOMContentLoaded", ()=>{
    dateTimeInput.valueAsDate = roundTimeQuarterHour(convertTz(dayjs(), timezoneSelect.value));
    intervalInput.value = 30;
    slotCountInput.value = 5;
    parseTimestamp();
})

let dateString = "";

let getTimestampType = () => {
    switch (document.getElementById("type").value) {
        case "coutdown": return "R>"
        case "hour-short": return "t>"
        case "hour-long": return "T>"
        case "date-short": return "d>"
        case "date-long": return "D>"
        case "date-time": return "f>"
        case "date-week": return "F>"
      }
      return "R>"
};

copyButton.addEventListener("click", () => {
    navigator.clipboard.writeText(timestampsText.innerText);
});

[dateTimeInput, intervalInput, slotCountInput, timezoneSelect, timestampTypeSelect].forEach((e) =>{
    e.addEventListener("change", () =>{
        parseTimestamp(); 
    })
})


let parseTimestamp = () => {
    let date = dateTimeInput.valueAsDate;
    let adjustedTzDate = convertTz(date, timezoneSelect.value);
    console.log(adjustedTzDate)
    updateTimestamps(adjustedTzDate)

    previewText.innerHTML = adjustedTzDate
}

let updateTimestamps = (input) => {
    let slotCount = slotCountInput.value;
    let inner = "";

    for (let i = 0; i < slotCount; i++) {
        inner += `${i+1}: &lt;t:${parseInt(input.getTime()/1000)}:${getTimestampType()}<br/>`
        input = new Date(input.getTime()+intervalInput.value*60000);
    }

    timestampsText.innerHTML = inner;
}

// https://stackoverflow.com/questions/10087819/convert-date-to-another-timezone-in-javascript
let convertTz = (date, tzString) => {
    if (tzString === "") return;
    return new Date((typeof date === "string" ? new Date(date) : date)
    .toLocaleString("en-US", {timeZone: tzString}));  
}

// https://stackoverflow.com/questions/4968250/how-to-round-time-to-the-nearest-quarter-hour-in-javascript
let roundTimeQuarterHour = (time) => {
    var timeToReturn = new Date(time);

    timeToReturn.setMilliseconds(Math.round(timeToReturn.getMilliseconds() / 1000) * 1000);
    timeToReturn.setSeconds(Math.round(timeToReturn.getSeconds() / 60) * 60);
    timeToReturn.setMinutes(Math.round(timeToReturn.getMinutes() / 15) * 15);
    return timeToReturn;
}