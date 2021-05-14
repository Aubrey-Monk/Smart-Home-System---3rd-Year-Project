package smartHomeAppPC_Client;

import org.eclipse.paho.client.mqttv3.MqttClient;
import org.eclipse.paho.client.mqttv3.MqttException;
import org.eclipse.paho.client.mqttv3.MqttMessage;
import org.eclipse.paho.client.mqttv3.MqttPersistenceException;

import com.phidget22.*;

public class doorbellController {

	private static VoltageRatioInput bell = null;
	static Boolean isActive = false;
	private static Double bellThreshold = 0.0;
	private static int bellPublishDelay = 2000;

	public static VoltageRatioInput createDoorbell(Integer serial, Integer channel) { // create a new instance of a door
																						// bell
		try {
			VoltageRatioInput doorbell = new VoltageRatioInput();
			doorbell.setDeviceSerialNumber(serial);
			doorbell.setChannel(channel);
			bell = doorbell;
			return doorbell;
		} catch (PhidgetException e) {
			e.printStackTrace();
		}
		return null;
	}

	public static void activate(String serialChannel, MqttClient mqttClient) { // activate a specific door bell
		Integer serialNumber = Integer.parseInt(serialChannel.substring(0, serialChannel.length() - 1));
		Integer channel = Character.getNumericValue(serialChannel.charAt(serialChannel.length() - 1));
		if (bell == null) {
			VoltageRatioInput newDoorbell = createDoorbell(serialNumber, channel);
			try {
				newDoorbell.addSensorChangeListener(new VoltageRatioInputSensorChangeListener() {
					// uses a check value and a timer to ensure it does not spam publish the
					// ringing, it will only publish if check = true
					Boolean check = true;

					public void onSensorChange(VoltageRatioInputSensorChangeEvent e) {
						if (e.getSensorValue() > bellThreshold && check == true) {
							try {
								MqttMessage payload = new MqttMessage("Doorbell ringing".getBytes());
								mqttClient.publish("18026172/doorbell/ringing", payload);
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
							}, bellPublishDelay);
						}
					}
				});

				newDoorbell.open(5000);

				newDoorbell.setSensorType(VoltageRatioSensorType.PN_1106);
				isActive = true;
			} catch (PhidgetException e) {
				e.printStackTrace();
			}
		} else {
			try {
				bell.open(5000);
				bell.setSensorType(VoltageRatioSensorType.PN_1106);
				isActive = true;
			} catch (PhidgetException e) {
				e.printStackTrace();
			}
		}
	}

	public static void deactivate(String serialChannel) { // deactivate a specific door bell
		if (!(bell == null)) {
			try {
				bell.close();
				isActive = false;
			} catch (PhidgetException e) {
				e.printStackTrace();
			}
		}
	}

}
