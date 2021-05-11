package smartHomeAppPC_Client;

import com.phidget22.*;

import java.util.ArrayList;
import java.util.List;

public class lightController {
	
	private static List<DigitalOutput> interfaceList = new ArrayList<DigitalOutput>();
	
	public static DigitalOutput interfaceExists(Integer channel) {
		for (int i = 0; i < interfaceList.size(); i++) {
            try {
				if(interfaceList.get(i).getChannel() == channel) {
					return interfaceList.get(i);
				}
			} catch (PhidgetException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
        }
		return null;
	}
	
	public static DigitalOutput createInterface(Integer serial, Integer channel) {
		try {
			DigitalOutput phidgetInterface = new DigitalOutput();
			phidgetInterface.setDeviceSerialNumber(serial);
			phidgetInterface.setChannel(channel);
			interfaceList.add(phidgetInterface);
			return phidgetInterface;
		} catch (PhidgetException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		return null;	
	}
	
	public static void on(String serialChannel) {
		Integer serialNumber = Integer.parseInt(serialChannel.substring(0, serialChannel.length() - 1));
		Integer channel = Character.getNumericValue(serialChannel.charAt(serialChannel.length()-1));
		
		DigitalOutput phidgetInterface = interfaceExists(channel);
		if(phidgetInterface == null) {
			DigitalOutput newInterface = createInterface(serialNumber, channel);
			try {
				newInterface.open(5000);
				newInterface.setDutyCycle(1);
			} catch (PhidgetException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
		}else {
			try {
				phidgetInterface.open(5000);
				phidgetInterface.setDutyCycle(1);
			} catch (PhidgetException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
		}
		
	}
	
	public static void off(String serialChannel) {
		Integer serialNumber = Integer.parseInt(serialChannel.substring(0, serialChannel.length() - 1));
		Integer channel = Character.getNumericValue(serialChannel.charAt(serialChannel.length()-1));
		
		DigitalOutput phidgetInterface = interfaceExists(channel);
		if(phidgetInterface == null) {
			DigitalOutput newInterface = createInterface(serialNumber, channel);
			try {
				newInterface.close();
			} catch (PhidgetException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
		}else {
			try {
				phidgetInterface.close();
			} catch (PhidgetException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
		}
	}
	
}
