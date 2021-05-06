package smartHomeAppPC_Client;

import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.List;

import org.eclipse.paho.client.mqttv3.*;

public class subscriberCallback implements MqttCallback {
	MqttClient mqttClient;
	
	public subscriberCallback(MqttClient mqttClient) {
		// TODO Auto-generated constructor stub
		this.mqttClient = mqttClient;
	}

	@Override
    public void connectionLost(Throwable arg0) {}

	@Override
	public void deliveryComplete(IMqttDeliveryToken arg0) {}

	@Override
	public void messageArrived(String topic, MqttMessage message) throws Exception {
		String time = new Timestamp(System.currentTimeMillis()).toString();
		System.out.println("Time:\t" +time +
                "  Topic:\t" + topic +
                "  Message:\t" + new String(message.getPayload()) +
                "  QoS:\t" + message.getQos());
		
		if(topic.equals("18026172/lock/lock")) {
			lockController.lock(Integer.parseInt(new String(message.getPayload())));
		}
		if(topic.equals("18026172/lock/unlock")) {
			lockController.unlock(Integer.parseInt(new String(message.getPayload())));
		}
		if(topic.equals("18026172/lock/check")) {
			String[] serials = new String(message.getPayload()).split("-");
			// List<String> positions = new ArrayList<String>();
			String pos = "";
			for (int i = 0; i < serials.length; i++) {		
				// System.out.println(String.valueOf(lockController.checkLock(Integer.parseInt(serials[i]))));
				if(lockController.checkLock(Integer.parseInt(serials[i])) == 33.1578947368421) {
					lockController.lock(Integer.parseInt(serials[i]));
					// positions.add(String.valueOf(180.0));
					pos += String.valueOf(180.0)+"-";
				}else {
					// positions.add(String.valueOf(lockController.checkLock(Integer.parseInt(serials[i]))));
					pos += String.valueOf(lockController.checkLock(Integer.parseInt(serials[i])))+"-";
				}
	        }
//			for (int i = 0; i < positions.size(); i++) {
//				System.out.println(positions.get(i));
//				mqttClient client = new mqttClient();
//				client.publish("18026172/lock/checked", );
//			}
			// mqttClient client = new mqttClient();
			MqttMessage payload = new MqttMessage(pos.getBytes());
			mqttClient.publish("18026172/lock/checked", payload);
			
			
		}
	}
}
