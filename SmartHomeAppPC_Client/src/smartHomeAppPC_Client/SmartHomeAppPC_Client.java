package smartHomeAppPC_Client;

public class SmartHomeAppPC_Client {

	public static void main(String[] args) {
		// store all topics to subscribe to
		String[] topics = { "18026172/lock/lock", "18026172/lock/unlock", "18026172/lock/check", "18026172/light/on",
				"18026172/light/off", "18026172/light/check", "18026172/doorbell/activate",
				"18026172/doorbell/deactivate", "18026172/motion/activate", "18026172/motion/deactivate",
				"18026172/motion/check" };

		// create new instance of client
		mqttClient client = new mqttClient();

		// subscribe to all stored topics
		client.subscribe(topics);
	}

}
