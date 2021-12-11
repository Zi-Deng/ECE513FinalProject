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

### Implementation Description
Our particle firmware uses code from the ECE513 smartLightExample code and the Particle Adafruit DHT library example code. In it, we create a C++ class on the functionality that we want to implement onto our device, then create variables and functions to enable the functionality in mind.

Our localhost features use code from the ParticleDeviceControllerUsingWebGUI example from ECE513. We are using node.js to create a local host server that displays html code stylized by css to control our particle device.

Our AWS features use token based authentication and password hashing in the database. It also uses 4xx response errors for bad requests or other client side errors related to input data.

### How to Use
To use the Particle portion of our repository. Change directories into the Particle firmware directory. From there use VSCode + Particle Workbench to Configure the Particle Project, Compile the project code and the Flash the application.

To use the the localhost features of our repository. Change directories into the WebGUI directory. Use the node package manager to install the serial port package. Then use node to start the JavaScript code to spin up the server.

To use the AWS features, follow the instructions in the video and the links on the website along with our server state diagram. Essentially, you can make an account, login, create your particle device, and then ping it to see whether or not it is online. For right now, the links are hard-coded for our test case because of an issue reading the values in the database (the values ARE there, but for some reason the url string and the access token generated with the variables was not working when concatenating them with the rest of the url and access token strings)

## General Particle Project Information


Every new Particle project is composed of 3 important elements that you'll see have been created in your project directory for 513FinalProject.

#### ```/src``` folder:
This is the source folder that contains the firmware files for your project. It should *not* be renamed.
Anything that is in this folder when you compile your project will be sent to our compile service and compiled into a firmware binary for the Particle device that you have targeted.

If your application contains multiple files, they should all be included in the `src` folder. If your firmware depends on Particle libraries, those dependencies are specified in the `project.properties` file referenced below.

#### ```.ino``` file:
This file is the firmware that will run as the primary application on your Particle device. It contains a `setup()` and `loop()` function, and can be written in Wiring or C/C++. For more information about using the Particle firmware API to create firmware for your Particle device, refer to the [Firmware Reference](https://docs.particle.io/reference/firmware/) section of the Particle documentation.

#### ```project.properties``` file:
This is the file that specifies the name and version number of the libraries that your project depends on. Dependencies are added automatically to your `project.properties` file when you add a library to a project using the `particle library add` command in the CLI or add a library in the Desktop IDE.

## Adding additional files to your project

#### Projects with multiple sources
If you would like add additional files to your application, they should be added to the `/src` folder. All files in the `/src` folder will be sent to the Particle Cloud to produce a compiled binary.

#### Projects with external libraries
If your project includes a library that has not been registered in the Particle libraries system, you should create a new folder named `/lib/<libraryname>/src` under `/<project dir>` and add the `.h`, `.cpp` & `library.properties` files for your library there. Read the [Firmware Libraries guide](https://docs.particle.io/guide/tools-and-features/libraries/) for more details on how to develop libraries. Note that all contents of the `/lib` folder and subfolders will also be sent to the Cloud for compilation.

## Compiling your project

When you're ready to compile your project, make sure you have the correct Particle device target selected and run `particle compile <platform>` in the CLI or click the Compile button in the Desktop IDE. The following files in your project folder will be sent to the compile service:

- Everything in the `/src` folder, including your `.ino` application file
- The `project.properties` file for your project
- Any libraries stored under `lib/<libraryname>/src`
