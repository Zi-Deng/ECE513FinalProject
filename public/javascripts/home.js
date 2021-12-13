var myInterval = null;
var user = "";

function organizePage(){
    $.ajax({
    url: '/user/page',
    method: 'GET',
    dataType: 'json',
    headers: { 'x-auth' : window.localStorage.getItem("token") }
    }).done(function(data, textStatus, jqXHR){
        $(".centerDiv").hide();
        if("devices" in data){
            //there are devices in the db
            $("#selADev").show()
            $("#temp").hide();
            var dev = 0;
            data.devices.forEach(element => {
                $("#devices").append('<option value='+dev+'>'+element.name+'</option>')
                // var option = document.createElement("option");
                // option.text = element.name
                // option.value = dev
                // if (dev == 0) option.selected = true
                dev+=1
                // $("#devices").appendChild(option)
            });
        }
        else{
            //no devices registered
            $("#selADev").hide()
            $(document.body).append('<div id="temp">Please register a device with the button at the top right of the screen</div>')
        }
    })
}

function clock(){
    var data = {}
    var date = new Date($("#startTime").val());
    data["start"] = (date.getTime()/1000)
    data["timeStep"] = $("#interval").val()
    $("#timeSet").html("Initial time="+data["start"]+" time step= "+ data["timeStep"] + ", try publishing to see it in action")
    $.ajax({
        url: '/particle/clock',
        method: 'POST',
        contentType: 'application/json',
        dataType: 'json',
        data: JSON.stringify(data),
        headers: { 'x-auth' : window.localStorage.getItem("token") }
    })
    .done(function(data, textStatus, errorThrown){
        // $("#timeSet").html("Initial time="+data["start"]+" time step= "+ data["timeStep"] + ", try publishing to see it in action")
    })
}

function devSel(){
    var device = $("#devices option:selected").val()
    console.log(device)
    $.ajax({
        url: '/particle/seldev',
        method: 'POST',
        contentType: 'application/json',
        dataType: 'json',
        data: JSON.stringify({selected: device}),
        headers: { 'x-auth' : window.localStorage.getItem("token") }
    })
    .done(function(data, textStatus, jqXHR){
        $(".centerDiv").show();
        $("#selectedDevice").html("Using device with name: " + JSON.stringify(data.message,null,2).replace(/\"/g, ""))
    })
    .fail(function(jqXHR, textStatus, errorThrown){
        $(".centerDiv").show();
        $("#selectedDevice").html("Using device with name: " + JSON.stringify(jqXHR.responseJSON.message,null,2).replace(/\"/g, ""))
    })
}

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
    dataType: 'json',
    headers: { 'x-auth' : window.localStorage.getItem("token") }
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