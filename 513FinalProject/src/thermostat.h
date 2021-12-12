#ifndef _THERMOSTAT_H_
#define _THERMOSTAT_H_

#include "common.h"

struct ThermostatStruct {
  int heat = 0; //0: off, 1: on
  int cool = 0; //0: off. 1: on
  int fanMode = 0; //0: auto, 1: on
  int fanStatus = 0; //0: off 1: on
  int assignedTemp = 0;
};

class CThermostat {
  enum SYS_STATE {S_OFF, S_HEAT, S_COOL};
  enum FAN_STATE {S_ON, S_AUTO};

  public:
    CThermostat();
    void cmdProcessing(JSONValue cmdJson);
    void execute(float currTemp);
    void createStatusStr();
    String getStatusStr() {return statusStr;};

  private:
    void resetCmd();
    String fanStatus;
    String climateStatus;
    SYS_STATE sys_state;
    FAN_STATE fan_state;
    String statusStr;
    ThermostatStruct thermoStruct;
};

#endif
