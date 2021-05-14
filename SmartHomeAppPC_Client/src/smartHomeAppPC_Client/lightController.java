package smartHomeAppPC_Client;

import com.phidget22.*;

import java.util.ArrayList;
import java.util.List;

public class lightController {

	private static List<DigitalOutput> lightList = new ArrayList<DigitalOutput>();

	public static DigitalOutput lightExists(Integer serial, Integer channel) { // check if a light (of a specific serial
																				// and channel) already exists
		for (int i = 0; i < lightList.size(); i++) { // loop through list of added lights
			try {
				if (lightList.get(i).getDeviceSerialNumber() == serial && lightList.get(i).getChannel() == channel) { // check
																														// if
																														// serial
																														// and
																														// channel
																														// are
																														// the
																														// same
					return lightList.get(i); // if found return the instance of the light
				}
			} catch (PhidgetException e) {
				e.printStackTrace();
			}
		}
		return null; // return null if not found
	}

	public static DigitalOutput createLight(Integer serial, Integer channel) { // create a new instance of a light
		try {
			// create new light
			DigitalOutput light = new DigitalOutput();
			light.setDeviceSerialNumber(serial);
			light.setChannel(channel);
			// add created light to list
			lightList.add(light);
			return light;
		} catch (PhidgetException e) {
			e.printStackTrace();
		}
		return null; // return null if light cannot be created
	}

	public static boolean checkLight(String serialChannel) { // check the state of a specific light
		Integer serialNumber = Integer.parseInt(serialChannel.substring(0, serialChannel.length() - 1));
		Integer channel = Character.getNumericValue(serialChannel.charAt(serialChannel.length() - 1));

		DigitalOutput light = lightExists(serialNumber, channel); // set light to returned light after checking it
																	// exists
		// if lightExists returns null then create new light
		if (light == null) {
			DigitalOutput newLight = createLight(serialNumber, channel);
			try {
				newLight.open(5000);
				return (newLight.getState()); // return current state of new light
			} catch (PhidgetException e) {
				e.printStackTrace();
			}
		} else {
			try {
				return (light.getState()); // return state of light
			} catch (PhidgetException e) {
				e.printStackTrace();
			}
		}
		return false;
	}

	public static void on(String serialChannel) { // turn on a specific light
		Integer serialNumber = Integer.parseInt(serialChannel.substring(0, serialChannel.length() - 1));
		Integer channel = Character.getNumericValue(serialChannel.charAt(serialChannel.length() - 1));

		DigitalOutput light = lightExists(serialNumber, channel); // set light to returned light after checking it
																	// exists
		// if lightExists returns null then create new light
		if (light == null) {
			DigitalOutput newLight = createLight(serialNumber, channel);
			try {
				// open and turn on new light
				newLight.open(5000);
				newLight.setDutyCycle(1);
			} catch (PhidgetException e) {
				e.printStackTrace();
			}
		} else {
			try {
				// turn on light
				light.setDutyCycle(1);
			} catch (PhidgetException e) {
				e.printStackTrace();
			}
		}

	}

	public static void off(String serialChannel) { // turn off a specific light
		Integer serialNumber = Integer.parseInt(serialChannel.substring(0, serialChannel.length() - 1));
		Integer channel = Character.getNumericValue(serialChannel.charAt(serialChannel.length() - 1));

		DigitalOutput light = lightExists(serialNumber, channel); // set light to returned light after checking it
																	// exists
		// if lightExists returns null then create new light
		if (light == null) {
			DigitalOutput newLight = createLight(serialNumber, channel);
			try {
				// turn off new light
				newLight.setDutyCycle(0);
			} catch (PhidgetException e) {
				e.printStackTrace();
			}
		} else {
			try {
				// turn off light
				light.setDutyCycle(0);
			} catch (PhidgetException e) {
				e.printStackTrace();
			}
		}
	}

}
