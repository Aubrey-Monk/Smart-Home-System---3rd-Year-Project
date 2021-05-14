-README for the SmartHomeApp-

SOFTWARE required to run:
- Java (I am using version 8 update 221 and also have the Java SE Development Kit 14.0.2)
- Node.js (I am using version 12.14.1)
- Android Studio (I am using version 3.6) (Also make sure you have Android SDK Platform-Tools needed for ADB)
- Eclipse 2019-09 (OPTIONAL as I have included runnnable JAR file)

HARDWARE required to use:
- 1x: PhidgetInterfaceKit 8/8/8 (1018 2)
- 1 or more: Phidget Motion Sensor (1111 OA)
- 1x: Phidget Force Sensor (1106 OA)
- 1 or more: Phidget AdvancedServo (1066 1)
- 1 or more: LEDs 

How to INSTALL/RUN:
1) Unzip file

2) Plug in and connect all Phidget devices and connect LEDS to the digital outputs

3) To run the PC Client -EITHER-: A) open windows command prompt and change directory to the folder 'SmartHomeAppPC_Client' and then run command: 'java -jar pc_client.jar' 
-OR- B) open the folder 'SmartHomeAppPC_Client' as a project in eclipse and run as Java application

4) Connecting the API to the database: The API is already set up with a connection to the university mudfoot server with my login credentials, 
to use your own please enter your details in the 'SmartHomeAppAPI\app\config\db.config.js' file, I have also included the SQL for the creation of the correct tables 
located in the root of the project

5) To run the API: open a new windows command prompt and change directory to the folder 'SmartHomeAppAPI' and then run the command 'node server.js'

6) Setting up enviroment to run the Android Application: open a new windows command prompt and change directory to the folder 'SmartHomeApp' and then run command 'npm install'.
Next open android studio and open the folder 'SmartHomeApp\android' and let it load everything up.

7) Setting up Android Emulator: Oen the 'AVD Manager' in Android Studio, click 'Create Virtual Device', select a 'Pixel 3 XL' (recommended), select 'API Level 29' (recommended).
Once emulator is created go into 'AVD Manager' again select the device and choose 'Actions \/ -> Cold Boot Now'.

8) Installing the app on the emulator: With the emulator open and discoverable using command 'adb devices' open a new windows command prompt and change directory to the folder 'SmartHomeApp' and then run the command 'npx react-native run-android'

*NOTE: FOR BOTH STEP 3A AND STEP 5 I HAVE INCLUDED .bat FILES IN THE INDIVIDUAL DIRECTORIES TO MAKE IT EASIER TO RUN THE CLIENT AND SERVER 
AS IT WILL AUTOMATICALLY EXECUTE THE REQUIRED COMMAND IN THE DIRECTORY*

-Aubrey Monk 18026172-