var myInterval = null;
var user = "";

function pingTest() {
$.ajax({
    url: '/particle/ping',
    method: 'GET',
    dataType: 'json',
    headers: { 'x-auth' : window.localStorage.getItem("token") }
}).done(particleSuccess).fail(particleFailure);
}

function readData() {
$.ajax({
    url: '/particle/read',
    method: 'GET',
    dataType: 'json',
    headers: { 'x-auth' : window.localStorage.getItem("token") }
}).done(particleSuccess).fail(particleFailure);
}

function enableDisablePublish() {
let bPublish;
if ($('#btnEnablePublish').html() == 'Enable publish') bPublish = true;
else bPublish = false;
let cmd = {
    publish: bPublish
};
console.log(JSON.stringify(cmd));
$.ajax({
    url: '/particle/publish',
    method: 'POST',
    contentType: 'application/json',
    data: JSON.stringify(cmd),
    dataType: 'json'
}).done(particleSuccess).fail(particleFailure);
}

function particleSuccess(data, textStatus, jqXHR) {
$('#cmdStatusData').html(JSON.stringify(data, null, 2));
if ("cmd" in data) {
    if (data.cmd === "ping") {
    if ("online" in data.data) {
        if (data.data.online) {
        $('#ping_status').val('Online');
        }
        else $('#ping_status').val('Offline');
    }
    }
    else if (data.cmd === "read") {
    if ("simclock" in data.data) $('#curTime').html(data.data.simclock);
    }
    else if ((data.cmd === "publish") && (data.success)){
    if ($('#btnEnablePublish').html() == 'Enable publish') {
        $('#btnEnablePublish').html('Disable publish'); 
        myInterval = setInterval(readData, 1000);
    }
    else {
        $('#btnEnablePublish').html('Enable publish');
        if (myInterval != null) {
        clearInterval(myInterval);
        myInterval = null;
        }
    }
    }          
}
}

function particleFailure(jqXHR, textStatus, errorThrown) {
$('#cmdStatusData').html(JSON.stringify(jqXHR, null, 2));
}