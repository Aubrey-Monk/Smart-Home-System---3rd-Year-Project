package smartHomeAppPC_Client;

import java.util.ArrayList;
import java.util.List;

import com.phidget22.*;

public class doorbellController {
	
	private static List<VoltageRatioInput> doorbellList = new ArrayList<VoltageRatioInput>();
	
	public static VoltageRatioInput doorbellExists(Integer serial, Integer channel) { // check if a doorbell (of a specific channel and serial) already exists
		for (int i = 0; i < doorbellList.size(); i++) {
            try {
				if(doorbellList.get(i).getDeviceSerialNumber() == serial && doorbellList.get(i).getChannel() == channel) {
					return doorbellList.get(i);
				}
			} catch (PhidgetException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
        }
		return null;
	}
	
	public static VoltageRatioInput createDoorbell(Integer serial, Integer channel) { // create a new instance of a doorbell
		try {
			VoltageRatioInput doorbell = new VoltageRatioInput();
			doorbell.setDeviceSerialNumber(serial);
			doorbell.setChannel(channel);
			doorbellList.add(doorbell);
			return doorbell;
		} catch (PhidgetException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		return null;	
	}
	
	public static void activate(String serialChannel) { // activate a specific doorbell 
		Integer serialNumber = Integer.parseInt(serialChannel.substring(0, serialChannel.length() - 1));
		Integer channel = Character.getNumericValue(serialChannel.charAt(serialChannel.length()-1));
		
		VoltageRatioInput doorbell = doorbellExists(serialNumber, channel);
		if(doorbell == null) {
			VoltageRatioInput newDoorbell = createDoorbell(serialNumber, channel);
			try {
				newDoorbell.addSensorChangeListener(new VoltageRatioInputSensorChangeListener() {
					public void onSensorChange(VoltageRatioInputSensorChangeEvent e) {
						if(e.getSensorValue() > 0) {
						System.out.println("SensorValue: " + e.getSensorValue());
						System.out.println("SensorUnit: " + e.getSensorUnit().symbol);
						System.out.println("----------");
						}
					}
				});

				newDoorbell.open(5000);

				newDoorbell.setSensorType(VoltageRatioSensorType.PN_1106);
			} catch (PhidgetException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
		}else {
			System.out.println("do nothing");
		}
	}
	
}
