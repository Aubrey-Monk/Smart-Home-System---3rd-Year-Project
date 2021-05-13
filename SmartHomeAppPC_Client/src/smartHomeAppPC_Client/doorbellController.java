package smartHomeAppPC_Client;

import org.eclipse.paho.client.mqttv3.MqttClient;
import org.eclipse.paho.client.mqttv3.MqttException;
import org.eclipse.paho.client.mqttv3.MqttMessage;
import org.eclipse.paho.client.mqttv3.MqttPersistenceException;

import com.phidget22.*;

public class doorbellController {
	
	private static VoltageRatioInput bell = null;
	
	static Boolean isActive = false;
	
	public static VoltageRatioInput createDoorbell(Integer serial, Integer channel) { // create a new instance of a doorbell
		try {
			VoltageRatioInput doorbell = new VoltageRatioInput();
			doorbell.setDeviceSerialNumber(serial);
			doorbell.setChannel(channel);
			bell = doorbell;
			return doorbell;
		} catch (PhidgetException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		return null;	
	}
	
	public static void activate(String serialChannel, MqttClient mqttClient) { // activate a specific doorbell 
		Integer serialNumber = Integer.parseInt(serialChannel.substring(0, serialChannel.length() - 1));
		Integer channel = Character.getNumericValue(serialChannel.charAt(serialChannel.length()-1));
		if(bell == null) {
			VoltageRatioInput newDoorbell = createDoorbell(serialNumber, channel);
			try {
				newDoorbell.addSensorChangeListener(new VoltageRatioInputSensorChangeListener() {
					Boolean check = true;
					public void onSensorChange(VoltageRatioInputSensorChangeEvent e) {
						if(e.getSensorValue() > 0 && check == true) {
							try {
								MqttMessage payload = new MqttMessage("Doorbell ringing".getBytes());
								mqttClient.publish("18026172/doorbell/ringing", payload);
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

				newDoorbell.open(5000);

				newDoorbell.setSensorType(VoltageRatioSensorType.PN_1106);
				isActive = true;
			} catch (PhidgetException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
		}else {
			try {
				bell.open(5000);
				bell.setSensorType(VoltageRatioSensorType.PN_1106);
				isActive = true;
			} catch (PhidgetException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
		}
	}
	
	public static void deactivate(String serialChannel) {
		if(!(bell == null)) {
			try {
				bell.close();
				isActive = false;
			} catch (PhidgetException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
		}
	}
	
}
