#include "thermostat.h"

CThermostat::CThermostat() {
  sys_state = CThermostat::S_OFF;
  fan_state = CThermostat::S_ON;

  statusStr = "{}";
  //resetCmd();
}

void CThermostat::cmdProcessing(JSONValue cmdJson) {
  JSONObjectIterator iter(cmdJson);
  while (iter.next()) {
    if (iter.name() == "heat") {
      sys_state = CThermostat::S_HEAT;
    } else if (iter.name() == "cool") {
      sys_state = CThermostat::S_COOL;
    } else if (iter.name() == "off") {
      sys_state = CThermostat::S_OFF;
    } else if (iter.name() == "fan") {
      thermoStruct.fanMode = iter.value().toInt();
    } else if (iter.name() == "temp") {
      thermoStruct.assignedTemp = iter.value().toInt();
    }
  }
}

void CThermostat::execute(float currTemp) {
  //thermoStruct.assignedTemp = 30;

  switch (sys_state) {
    case CThermostat::S_HEAT:
      if (currTemp > thermoStruct.assignedTemp) {
        thermoStruct.heat = 0;
        if (thermoStruct.fanMode == 1) {
          thermoStruct.fanStatus = 1;
          thermoStruct.powerConsumption = 600;
        } else {
          thermoStruct.fanStatus = 0;
          thermoStruct.powerConsumption = 0;
        }
      } else if (currTemp < thermoStruct.assignedTemp) {
        thermoStruct.heat = 1;
        if (thermoStruct.fanMode == 1) {
          thermoStruct.fanStatus = 1;
          thermoStruct.powerConsumption = 4400;
        } else {
          thermoStruct.fanStatus = 100;
          thermoStruct.powerConsumption = 3800;
        }
      }
      break;
    case CThermostat::S_COOL:
      if (currTemp > thermoStruct.assignedTemp) {
        thermoStruct.cool = 1;
        if (thermoStruct.fanMode == 1) {
          thermoStruct.fanStatus = 1;
          thermoStruct.powerConsumption = 3700;
        } else {
          thermoStruct.fanStatus = 1;
          thermoStruct.powerConsumption =3700;
        }
      } else if (currTemp < thermoStruct.assignedTemp) {
        thermoStruct.cool = 0;
        if (thermoStruct.fanMode == 1) {
          thermoStruct.fanStatus = 1;
          thermoStruct.powerConsumption = 3100;
        } else {
          thermoStruct.fanStatus = 0;
          thermoStruct.powerConsumption = 600;
        }
      }
      break;
    case CThermostat::S_OFF:
      thermoStruct.cool = 0;
      thermoStruct.heat = 0;
      thermoStruct.fanStatus = 0;
      thermoStruct.powerConsumption = 100;
      break;
    default:
      break;
  }
  createStatusStr();
  //resetCmd();
}

void CThermostat::resetCmd() {
  thermoStruct.heat = INVALID_CMD;
  thermoStruct.fanStatus = INVALID_CMD;
  thermoStruct.cool = INVALID_CMD;
  thermoStruct.assignedTemp = INVALID_CMD;
  thermoStruct.fanMode = INVALID_CMD;
}

void CThermostat::createStatusStr() {
    statusStr = String::format("{\"heatStatus\":%d,\"coolStatus\":%d,\"fanStatus\":%d, \"power\":%d, \"setTemp\":%d}",
      thermoStruct.heat, thermoStruct.cool, thermoStruct.fanMode, thermoStruct.powerConsumption, thermoStruct.assignedTemp);
}
