package smartHomeAppPC_Client;

public class SmartHomeAppPC_Client {

	public static void main(String[] args) {
		String[] topics = {"18026172/lock/lock", "18026172/lock/unlock"};
		mqttClient client = new mqttClient();
	    client.subscribe(topics);
	}

}
