package smartHomeAppPC_Client;

import java.util.ArrayList;
import java.util.List;

import com.phidget22.*;

public class motionSensorController {
	
	private static List<VoltageRatioInput> motionSensorList = new ArrayList<VoltageRatioInput>();
	
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
	
	public static VoltageRatioInput createmotionSensor(Integer serial, Integer channel) { // create a new instance of a motionSensor
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
	
	public static void activate(String serialChannel) { // activate a specific motionSensor 
		Integer serialNumber = Integer.parseInt(serialChannel.substring(0, serialChannel.length() - 1));
		Integer channel = Character.getNumericValue(serialChannel.charAt(serialChannel.length()-1));
		
		VoltageRatioInput motionSensor = motionSensorExists(serialNumber, channel);
		if(motionSensor == null) {
			VoltageRatioInput newMotionSensor = createmotionSensor(serialNumber, channel);
			try {
				newMotionSensor.addSensorChangeListener(new VoltageRatioInputSensorChangeListener() {
					public void onSensorChange(VoltageRatioInputSensorChangeEvent e) {
						if(e.getSensorValue() > 0.5 || e.getSensorValue() < -0.5) {
						System.out.println("SensorValue: " + e.getSensorValue());
						System.out.println("Channel: " + channel);
						System.out.println("----------");
						}
					}
				});

				newMotionSensor.open(5000);

				newMotionSensor.setSensorType(VoltageRatioSensorType.PN_1111);
			} catch (PhidgetException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
		}else {
			System.out.println("do nothing");
		}
	}
	
}
