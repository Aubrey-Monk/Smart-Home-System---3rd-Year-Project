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
	private static Double sensorThreshold = 0.5;
	private static int sensorPublishDelay = 2000;

	public static VoltageRatioInput motionSensorExists(Integer serial, Integer channel) { // check if a motionSensor (of
																							// a specific channel and
																							// serial) already exists
		for (int i = 0; i < motionSensorList.size(); i++) {
			try {
				if (motionSensorList.get(i).getDeviceSerialNumber() == serial
						&& motionSensorList.get(i).getChannel() == channel) {
					return motionSensorList.get(i);
				}
			} catch (PhidgetException e) {
				e.printStackTrace();
			}
		}
		return null;
	}

	public static VoltageRatioInput createMotionSensor(Integer serial, Integer channel) { // create a new instance of a
																							// motionSensor
		try {
			// create new motion sensor, add to list and return
			VoltageRatioInput motionSensor = new VoltageRatioInput();
			motionSensor.setDeviceSerialNumber(serial);
			motionSensor.setChannel(channel);
			motionSensorList.add(motionSensor);
			return motionSensor;
		} catch (PhidgetException e) {
			e.printStackTrace();
		}
		return null;
	}

	public static boolean checkSensor(String serialChannel) { // check the state of a specific sensor
		Integer serialNumber = Integer.parseInt(serialChannel.substring(0, serialChannel.length() - 1));
		Integer channel = Character.getNumericValue(serialChannel.charAt(serialChannel.length() - 1));

		// check if sensor exists
		VoltageRatioInput sensor = motionSensorExists(serialNumber, channel);
		if (sensor == null) {
			return (false); // if sensor does not exist return false
		} else {
			if (isActiveList.contains(serialChannel)) { // if sensor is contained within the isActive list then return
														// true
				return (true);
			} else {
				return (false);
			}
		}
	}

	public static void activate(String serialChannel, MqttClient mqttClient) { // activate a specific motion sensor
		Integer serialNumber = Integer.parseInt(serialChannel.substring(0, serialChannel.length() - 1));
		Integer channel = Character.getNumericValue(serialChannel.charAt(serialChannel.length() - 1));

		VoltageRatioInput motionSensor = motionSensorExists(serialNumber, channel);
		if (motionSensor == null) {
			VoltageRatioInput newMotionSensor = createMotionSensor(serialNumber, channel);
			try {
				newMotionSensor.addSensorChangeListener(new VoltageRatioInputSensorChangeListener() {
					// uses a check value and a timer to ensure it does not spam publish the motion,
					// it will only publish if check = true
					Boolean check = true;

					public void onSensorChange(VoltageRatioInputSensorChangeEvent e) {

						if ((e.getSensorValue() > sensorThreshold || e.getSensorValue() < -sensorThreshold)
								&& check == true) {
							try {
								MqttMessage payload = new MqttMessage(serialChannel.getBytes());
								mqttClient.publish("18026172/motion/motion", payload);
							} catch (MqttPersistenceException e1) {
								e1.printStackTrace();
							} catch (MqttException e1) {
								e1.printStackTrace();
							}
							check = false;
							new java.util.Timer().schedule(new java.util.TimerTask() {
								@Override
								public void run() {
									check = true;
								}
							}, sensorPublishDelay);
						}

					}
				});

				newMotionSensor.open(5000);
				newMotionSensor.setSensorType(VoltageRatioSensorType.PN_1111);
				isActiveList.add(serialNumber.toString() + channel.toString());
			} catch (PhidgetException e) {
				e.printStackTrace();
			}
		} else {
			try {
				motionSensor.open(5000);
				motionSensor.setSensorType(VoltageRatioSensorType.PN_1111);
				isActiveList.add(serialNumber.toString() + channel.toString());
			} catch (PhidgetException e) {
				e.printStackTrace();
			}
		}
	}

	public static void deactivate(String serialChannel) { // deactivate a specific motion sensor
		Integer serialNumber = Integer.parseInt(serialChannel.substring(0, serialChannel.length() - 1));
		Integer channel = Character.getNumericValue(serialChannel.charAt(serialChannel.length() - 1));
		VoltageRatioInput sensor = motionSensorExists(serialNumber, channel);
		if (!(sensor == null)) {
			try {
				sensor.close();
				isActiveList.remove(serialChannel);
			} catch (PhidgetException e) {
				e.printStackTrace();
			}
		}
	}

}
