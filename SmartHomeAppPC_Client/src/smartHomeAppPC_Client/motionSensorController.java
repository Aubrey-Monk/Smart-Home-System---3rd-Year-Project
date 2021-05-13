package smartHomeAppPC_Client;

import java.util.ArrayList;
import java.util.List;

import org.eclipse.paho.client.mqttv3.MqttClient;
import org.eclipse.paho.client.mqttv3.MqttException;
import org.eclipse.paho.client.mqttv3.MqttMessage;
import org.eclipse.paho.client.mqttv3.MqttPersistenceException;

import com.phidget22.*;

public class motionSensorController {
	
	private static List<VoltageRatioInput> motionSensorList = new ArrayList<VoltageRatioInput>();
	private static List<String> isActiveList = new ArrayList<String>();
	
	public static VoltageRatioInput motionSensorExists(Integer serial, Integer channel) { // check if a motionSensor (of a specific channel and serial) already exists
		for (int i = 0; i < motionSensorList.size(); i++) {
            try {
				if(motionSensorList.get(i).getDeviceSerialNumber() == serial && motionSensorList.get(i).getChannel() == channel) {
					return motionSensorList.get(i);
				}
			} catch (PhidgetException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
        }
		return null;
	}
	
	public static VoltageRatioInput createMotionSensor(Integer serial, Integer channel) { // create a new instance of a motionSensor
		try {
			VoltageRatioInput motionSensor = new VoltageRatioInput();
			motionSensor.setDeviceSerialNumber(serial);
			motionSensor.setChannel(channel);
			motionSensorList.add(motionSensor);
			return motionSensor;
		} catch (PhidgetException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		return null;	
	}
	
	public static boolean checkSensor(String serialChannel) { // check the state of a specific sensor
		Integer serialNumber = Integer.parseInt(serialChannel.substring(0, serialChannel.length() - 1));
		Integer channel = Character.getNumericValue(serialChannel.charAt(serialChannel.length()-1));
		
		VoltageRatioInput sensor = motionSensorExists(serialNumber, channel);
		if(sensor == null) {
			return(false);
		}else {
			if(isActiveList.contains(serialChannel)) {
				return(true);
			}else {
				return(false);
			}
		}
	}
	
	public static void activate(String serialChannel, MqttClient mqttClient) { // activate a specific motionSensor 
		Integer serialNumber = Integer.parseInt(serialChannel.substring(0, serialChannel.length() - 1));
		Integer channel = Character.getNumericValue(serialChannel.charAt(serialChannel.length()-1));
		
		VoltageRatioInput motionSensor = motionSensorExists(serialNumber, channel);
		if(motionSensor == null) {
			VoltageRatioInput newMotionSensor = createMotionSensor(serialNumber, channel);
			try {
				newMotionSensor.addSensorChangeListener(new VoltageRatioInputSensorChangeListener() {
					Boolean check = true;
					public void onSensorChange(VoltageRatioInputSensorChangeEvent e) {
						
						if((e.getSensorValue() > 0.5 || e.getSensorValue() < -0.5) && check == true) {
							try {
								MqttMessage payload = new MqttMessage(serialChannel.getBytes());
								mqttClient.publish("18026172/motion/motion", payload);
							} catch (MqttPersistenceException e1) {
								// TODO Auto-generated catch block
								e1.printStackTrace();
							} catch (MqttException e1) {
								// TODO Auto-generated catch block
								e1.printStackTrace();
							}
							check = false;
							new java.util.Timer().schedule(new java.util.TimerTask() {
								@Override
								public void run() {       	
								check = true;
								}
							}, 2000);
						}
						
					}
				});

				newMotionSensor.open(5000);
				newMotionSensor.setSensorType(VoltageRatioSensorType.PN_1111);
				System.out.println(isActiveList);
				isActiveList.add(serialNumber.toString()+channel.toString());
				System.out.println(isActiveList);
			} catch (PhidgetException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
		}else {
			try {
				motionSensor.open(5000);
				motionSensor.setSensorType(VoltageRatioSensorType.PN_1111);
				System.out.println(isActiveList);
				isActiveList.add(serialNumber.toString()+channel.toString());
				System.out.println(isActiveList);
			} catch (PhidgetException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
		}
	}
	
	public static void deactivate(String serialChannel) { // turn off a specific light 
		Integer serialNumber = Integer.parseInt(serialChannel.substring(0, serialChannel.length() - 1));
		Integer channel = Character.getNumericValue(serialChannel.charAt(serialChannel.length()-1));
		VoltageRatioInput sensor = motionSensorExists(serialNumber, channel);
		if(!(sensor == null)) {
			try {
				sensor.close();
				System.out.println(isActiveList);
				isActiveList.remove(serialChannel);
				System.out.println(isActiveList);
			} catch (PhidgetException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
		}
	}
	
}
