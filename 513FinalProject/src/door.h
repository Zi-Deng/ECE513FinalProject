#ifndef _DOOR_H_
#define _DOOR_H_

#include "common.h"

struct DoorCmdStruct {
  int Status; // false: closed, true: on;
  int DoorProximity; //photoresistor
};

class CDoor {
  enum STATE_D0 { S_OPEN, S_CLOSED, S_ALERT };

  public:
    CDoor();

    void cmdProcessing(JSONValue cmdJSON);

    void execute();

    int getSensorVal();
    void readSensorVal();
    String getStatusStr() {return statusStr;};

  private:
    void resetCmd();
    void monitorDoor();
    void sendAlert();
    void createStatusStr();

    STATE_D0 state_D0;
    int doorProximity;
    int sensorVal;
    int sensorMax;
    int sensorMin;
    int oldTime;
    int newTime;
    DoorCmdStruct cmd;
    int alert;
    String statusStr;

};

#endif
