-README for the SmartHomeApp-

Software required to run:
- Java (I am using version 8 update 221 and also have the Java SE Development Kit 14.0.2)
- Node.js (I am using version 12.14.1)
- Android Studio (I am using version 3.6)
- Eclipse 2019-09 (OPTIONAL as I have included runnnable JAR file)

Hardware required to use:
- 1x: PhidgetInterfaceKit 8/8/8 (1018 2)
- 1 or more: Phidget Motion Sensor (1111 OA)
- 1x: Phidget Force Sensor (1106 OA)
- 1 or more: Phidget AdvancedServo (1066 1)
- 1 or more: LEDs 

How to install/run:
1) Unzip file

2) Plug in and connect all Phidget devices and connect LEDS to the digital outputs

3) To run the PC Client -EITHER-: A) open windows command prompt and change directory to the folder 'SmartHomeAppPC_Client' and then run command: ' java -jar pc_client.jar ' 
-OR- B) open the folder 'SmartHomeAppPC_Client' as a project in eclipse and run as Java application

4) Connecting the API to the database: The API is already set up with a connection to the university mudfoot server with my login credentials, 
to use your own please enter your details in the 'SmartHomeAppAPI\app\config\db.config.js' file, I have also included the SQL to create the correct tables 
in the root of the project

5) To run the API: open a new windows command prompt and change directory to the folder 'SmartHomeAppAPI' and then run the command ' node server.js '
*NOTE: FOR BOTH STEP 3A AND STEP 4 I HAVE INCLUDED .bat FILES IN THE INDIVIDUAL DIRECTORIES TO MAKE IT EASIER TO RUN THE CLIENT AND SERVER 
AS IT WILL AUTOMATICALLY EXECUTE THE REQUIRED COMMAND IN THE DIRECTORY*

6) To run the Android App -EITHER-: A)                  
-OR-: B)

-Aubrey Monk 18026172-

DATABASE