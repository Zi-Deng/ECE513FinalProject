# ECE513 Final Project

A Particle project named 513 Final Project

### Team 11 Information
Zi Deng - 1st Year PHD ECE - zkdeng@email.arizona.edu
Parker Dattilo - 4th Year Undergraduate ECE - parkerdattilo@email.arizona.edu
Ramon Driesen - 1st Year Masters ECE - edriesen@email.arizona.edu

We are a ECE513 Group.

### AWS Address
http://ec2-18-116-89-134.us-east-2.compute.amazonaws.com:3000/index.html

### Video Demonstration
https://www.youtube.com/watch?v=uYM8ej9cJ70&ab_channel=ParkerD

### Particle Information
We are using an Argon Particle device. Particle ID e00fce6885903bb14139f4eb

### Implementation
Our Particle firmware contains four main classes that implement various features of a Smart Home.

All four classes implement the same form of serial command processing using the following methods:
- cmdProcessing() - Receive data from localhost/web server and populate correct variables.
- createStatusStr() - Creates status string to send to localhost/web server.

**CSmartLight** controls the color, brightness, auto/manual, and sleep/wake times on the smart light.
- SmartLight
  - turnOffLight()
  - updateBrightnessManually()
  - updateBrightnessAutomatically()
  - execute() - Checks if time is the wake or sleep time for the light, sets the color of the light based on red, green, blue values from the GUI, then based on the manual or auto setting will control the brightness.

*Smart light status string variables*: L0(on/off), L1(auto/manual), b(brightness), s(sensor value), M(sensor min), M(sensor max), red, green, blue

**CDoor** controls the open/close status of the door and sends an alert if the door is open too long.
- CDoor
  -

**CThermostat** controls the heating, cooling, and fan simulations as well as its respective power estimation.
- CThermostat
  - execute() - Sets the parameters for heating, cooling, fan and power based on DHT temperature reading.

*Thermostat status string variables*: heatStatus, coolStatus, fanStatus, power, setTemp

Our power estimation uses the heating, cooling, and fan status to determine the overall watt hour (Wh) for the device.
- Our base power consumption with all features turned off is 100 Wh.
- Heating the smart home is costly and requires 3700 Wh to operate.
- Cooling the smart home is less but still requires 3200 Wh to operate.
- Turning on the fan at any point will cause increase of 500 Wh to the cost.

This results in:
- Heat On / Fan Off = 3800 Wh
- Heat On / Fan On = 4400 Wh
- Cool On / Fan Off = 3200 Wh
- Cool On / Fan On = 3700 Wh
- All Off = 100 Wh

AWS
Localhost
-writePort c

### Implementation Description
Our particle firmware uses code from the ECE513 smartLightExample code and the Particle Adafruit DHT library example code. In it, we create a C++ class on the functionality that we want to implement onto our device, then create variables and functions to enable the functionality in mind.

Our localhost features use code from the ParticleDeviceControllerUsingWebGUI example from ECE513. We are using node.js to create a local host server that displays html code stylized by css to control our particle device.

Our AWS features use token based authentication and password hashing in the database. It also uses 4xx response errors for bad requests or other client side errors related to input data.

### How to Use
To use the Particle portion of our repository. Change directories into the Particle firmware directory. From there use VSCode + Particle Workbench to Configure the Particle Project, Compile the project code and the Flash the application.

To use the the localhost features of our repository. Change directories into the WebGUI directory. Use the node package manager to install the serial port package. Then use node to start the JavaScript code to spin up the server.

To use the AWS features, follow the instructions in the video and the links on the website along with our server state diagram. Essentially, you can make an account, login, create your particle device, and then ping it to see whether or not it is online. For right now, the links are hard-coded for our test case because of an issue reading the values in the database (the values ARE there, but for some reason the url string and the access token generated with the variables was not working when concatenating them with the rest of the url and access token strings)
