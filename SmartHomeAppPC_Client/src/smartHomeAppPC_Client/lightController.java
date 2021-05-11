package smartHomeAppPC_Client;

import com.phidget22.*;

import java.util.ArrayList;
import java.util.List;

public class lightController {
	
	private static List<DigitalOutput> lightList = new ArrayList<DigitalOutput>();
	
	public static DigitalOutput lightExists(Integer channel) {
		for (int i = 0; i < lightList.size(); i++) {
            try {
				if(lightList.get(i).getChannel() == channel) {
					return lightList.get(i);
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
			lightList.add(phidgetInterface);
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
		
		DigitalOutput light = lightExists(channel);
		if(light == null) {
			DigitalOutput newLight = createInterface(serialNumber, channel);
			try {
				newLight.open(5000);
				newLight.setDutyCycle(1);
			} catch (PhidgetException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
		}else {
			try {
				light.open(5000);
				light.setDutyCycle(1);
			} catch (PhidgetException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
		}
		
	}
	
	public static void off(String serialChannel) {
		Integer serialNumber = Integer.parseInt(serialChannel.substring(0, serialChannel.length() - 1));
		Integer channel = Character.getNumericValue(serialChannel.charAt(serialChannel.length()-1));
		
		DigitalOutput light = lightExists(channel);
		if(light == null) {
			DigitalOutput newLight = createInterface(serialNumber, channel);
			try {
				newLight.close();
			} catch (PhidgetException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
		}else {
			try {
				light.close();
			} catch (PhidgetException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
		}
	}
	
}
