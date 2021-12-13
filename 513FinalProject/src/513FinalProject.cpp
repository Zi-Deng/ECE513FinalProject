/******************************************************/
//       THIS IS A GENERATED FILE - DO NOT EDIT       //
/******************************************************/

#include "Particle.h"
#line 1 "/Users/zi/Documents/UofA/ECE513FinalProject/513FinalProject/src/513FinalProject.ino"
#include "Adafruit_DHT.h"
#include "common.h"
#include "smartlight.h"
#include "door.h"
#include "thermostat.h"


void serialCmdProcessing();
void setup();
void loop();
#line 8 "/Users/zi/Documents/UofA/ECE513FinalProject/513FinalProject/src/513FinalProject.ino"
SYSTEM_THREAD(ENABLED);
#define DHTPIN 2     // what pin we're connected to
#define DHTTYPE DHT11		// DHT 11

DHT dht(DHTPIN, DHTTYPE);
CSmartLight smartLight;
CDoor door;
CThermostat thermostat;
int counter;
String finalStatusStr;
int timeInt;
// bool bPublish;
// String rxCloudCmdStr;


// int updateRxCmd(String cmdStr) {
//   rxCloudCmdStr = cmdStr;
//   return 0;
// }

// void cloudCmdProcessing() {
//   if (rxCloudCmdStr == "") return;
//   JSONValue cmdJson = JSONValue::parseCopy(rxCloudCmdStr);
//   JSONObjectIterator iter(cmdJson);
//   while (iter.next()) {
//     if (iter.name() == "publish") {
//       bPublish = iter.value().toBool();
//     } else if (iter.name() == "smartlight") {
//       smartLight.cmdProcessing(iter.value());
//     } else if (iter.name() == "door") {
//       door.cmdProcessing(iter.value());
//     } else if (iter.name() == "systemControl") {
//       thermostat.cmdProcessing(iter.value());
//     }
//   }
//   rxCloudCmdStr = "";
// }

void serialCmdProcessing() {
  if (Serial.available() <= 0) return;
  String cmdStr = "";
  while (Serial.available()) {
      char c = Serial.read();
      cmdStr += String(c);
  }
  JSONValue cmdJson = JSONValue::parseCopy(cmdStr.c_str());
  JSONObjectIterator iter(cmdJson);
  while (iter.next()) {
    if (iter.name() == "smartlight") {
      smartLight.cmdProcessing(iter.value());
    } else if (iter.name() == "door") {
      door.cmdProcessing(iter.value());
    } else if (iter.name() == "systemControl") {
      thermostat.cmdProcessing(iter.value());
    }
  }
}

// void myWebhookHandler(const char *event, const char *data) {
//   String output = String::format("Response: %s", data);
//   Serial.println(output);
// }

void setup() {
  pinMode(LED, OUTPUT);
  pinMode(LED2, OUTPUT);
  RGB.control(true);
  RGB.color(255, 255, 255);

	Serial.begin();

  dht.begin();

  counter = 0;

  // bPublish = false;
  // rxCloudCmdStr = "";
  // finalStatusStr = "";

  // Particle.function("cloudcmd", updateRxCmd);
  // Particle.subscribe("hook-response/smarthome", myWebhookHandler);
}

void loop() {
  unsigned long t = millis();
  //cloudCmdProcessing();


	float h = dht.getHumidity();
	float temp = dht.getTempCelcius();
	float f = dht.getTempFarenheit();

  serialCmdProcessing();
  smartLight.execute();
  thermostat.execute(temp);
  door.execute();

  unsigned long period = millis() - t;


  if (counter % (SERAIL_COMM_FREQUENCY * LOOP_FREQUENCY) == 0) {
    counter = 0;
    if (isnan(h) || isnan(temp) || isnan(f)) {
      Serial.printf("{\"Fail\": %d}", true);
      Serial.println();

      return;
    }
    timeInt = (int)(Time.now() % 1440);
    //timeInt = timeInt % 24;
    finalStatusStr = String::format("{\"t\":%d,\"light\":%s, \"door\":%s, \"thermostat\":%s, \"Humid\":%.2f, \"Temp\":%.2f, \"ct\":%ld, \"minute\":%d}",
      Time.now(), smartLight.getStatusStr().c_str(), door.getStatusStr().c_str(), thermostat.getStatusStr().c_str(), h, temp,
      period, timeInt);
    Serial.printf(finalStatusStr);
    Serial.println();

    // if (bPublish) {
    //   Particle.publish("smarthome", finalStatusStr, PRIVATE);
    // }
  }
  counter++;

  period = PERIOD - (millis() - t);
  if (period > 0) delay(period);
}

