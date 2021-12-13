#include "door.h"

CDoor::CDoor() {
  state_D0 = CDoor::S_CLOSED;
  doorProximity = RGB_BRIGHTNESS_DEAULT;
  sensorMax = LIGHT_SENSOR_MAX;
  sensorMin = LIGHT_SENSOR_MIN;

  statusStr = "{}";
  resetCmd();
}

void CDoor::cmdProcessing(JSONValue cmdJson) {
  JSONObjectIterator iter(cmdJson);
  while (iter.next()) {
    if (iter.name() == "min") {
      sensorMin = iter.value().toInt();
    } else if (iter.name() == "max") {
      sensorMax = iter.value().toInt();
    } else if (iter.name() == "doorProximity") {
      cmd.DoorProximity = iter.value().toInt();
    } else if (iter.name() == "status") {
      cmd.Status = (int)iter.value().toBool();
    }
  }
}

void CDoor::execute() {

  switch (state_D0) {
    case CDoor::S_CLOSED: {
      readSensorVal();
      int curSensorVal = getSensorVal();
      if (curSensorVal < sensorMin) curSensorVal = sensorMin;
      if (curSensorVal > sensorMax) curSensorVal = sensorMax;
      double amountOfProximity = (double)(curSensorVal-sensorMin) / (double)(sensorMax-sensorMin);
      if (amountOfProximity < 0.5) {
        //RGB.brightness(RGB_BRIGHTNESS_MAX);
        digitalWrite(LED2, HIGH);
        oldTime = Time.now();
        state_D0 = CDoor::S_OPEN;
      } else {
        RGB.brightness(0);
        digitalWrite(LED2, LOW);
      }}
      break;
    case CDoor::S_OPEN: {
      readSensorVal();
      int curSensorVal = getSensorVal();
      if (curSensorVal < sensorMin) curSensorVal = sensorMin;
      if (curSensorVal > sensorMax) curSensorVal = sensorMax;
      double amountOfProximity = (double)(curSensorVal-sensorMin) / (double)(sensorMax-sensorMin);
      doorProximity = amountOfProximity;

      newTime = Time.now();
      if (newTime - oldTime > 10) {
        state_D0 = CDoor::S_ALERT;
      } else {
        //alert = 0;
        state_D0 = CDoor::S_OPEN;
      }
      if (amountOfProximity < 0.5) {
        digitalWrite(LED2, HIGH);
      } else {
        digitalWrite(LED2, LOW);
        oldTime = Time.now();
        state_D0 = CDoor::S_CLOSED;
      }
    }
      break;
    default:
      break;
  }
  resetCmd();
  createStatusStr();
}

void CDoor::readSensorVal() {
  sensorVal = analogRead(DOOR_SENSOR);
}

int CDoor::getSensorVal() {
  return sensorVal;
}

void CDoor::createStatusStr() {
  statusStr = String::format("{\"Close\":%d, \"doorProximity\":%.2f, \"sensorVal\":%d, \"alert\":%d}",
    state_D0, doorProximity, sensorVal, alert
  );
}

void CDoor::resetCmd() {
  cmd.DoorProximity = INVALID_CMD;
  cmd.Status = INVALID_CMD;
}
