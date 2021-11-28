#include "Adafruit_DHT.h"
#include "common.h"
#include "smartlight.h"
#include "door.h"

SYSTEM_THREAD(ENABLED);
// Example testing sketch for various DHT humidity/temperature sensors
// Written by ladyada, public domain

#define DHTPIN 2     // what pin we're connected to

#define DHTTYPE DHT11		// DHT 11

DHT dht(DHTPIN, DHTTYPE);
CSmartLight smartLight;
CDoor door;
int counter;

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
    }
  }
}



void setup() {
  pinMode(LED, OUTPUT);
  pinMode(LED2, OUTPUT);
  RGB.control(true);
  RGB.color(255, 255, 255);

	Serial.begin();

  dht.begin();

  counter = 0;
}

void loop() {
// Wait a few seconds between measurements.
	//delay(100);

// Reading temperature or humidity takes about 250 milliseconds!
// Sensor readings may also be up to 2 seconds 'old' (its a
// very slow sensor)
	float h = dht.getHumidity();
// Read temperature as Celsius
	float temp = dht.getTempCelcius();
// Read temperature as Farenheit
	float f = dht.getTempFarenheit();

// Check if any reads failed and exit early (to try again).
	if (isnan(h) || isnan(temp) || isnan(f)) {
		//Serial.println("Failed to read from DHT sensor!");
		Serial.printf("{\"Fail\": %d}", true);
		Serial.println();

		return;
	}

// Compute heat index
// Must send in temp in Fahrenheit!
	// float hi = dht.getHeatIndex();
	// float dp = dht.getDewPoint();
	// float k = dht.getTempKelvin();

	Serial.printf("{\"Humid(Percent)\":%.2f, \"Temp(*C)\":%.2f}", h, temp);
	Serial.println();

  unsigned long t = millis();

  serialCmdProcessing();
  smartLight.execute();

  unsigned long period = millis() - t;
  door.execute();
  if (counter % (SERAIL_COMM_FREQUENCY * LOOP_FREQUENCY) == 0) {
    counter = 0;
    Serial.printf("{\"t\":%d,\"light\":%s, \"door\":%s, \"ct\":%ld}",
      (int)Time.now(), smartLight.getStatusStr().c_str(), door.getStatusStr().c_str(),
      period
    );
    Serial.println();
  }
  counter++;

  period = PERIOD - (millis() - t);
  if (period > 0) delay(period);
}

