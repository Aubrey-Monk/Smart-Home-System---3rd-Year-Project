package smartHomeAppPC_Client;

import java.sql.Timestamp;

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
			String positions = "";
			for (int i = 0; i < serials.length; i++) {		
				if(lockController.checkLock(Integer.parseInt(serials[i])) == 33.1578947368421) {
					lockController.lock(Integer.parseInt(serials[i]));
					positions += String.valueOf(180.0)+"-";
				}else {
					positions += String.valueOf(lockController.checkLock(Integer.parseInt(serials[i])))+"-";
				}
	        }
			MqttMessage payload = new MqttMessage(positions.getBytes());
			mqttClient.publish("18026172/lock/checked", payload);
		}
		if(topic.equals("18026172/light/on")) {
			lightController.on(new String(message.getPayload()));
		}
		if(topic.equals("18026172/light/off")) {
			lightController.off(new String(message.getPayload()));
		}
		if(topic.equals("18026172/light/check")) {
			String[] serialChannels = new String(message.getPayload()).split("-");
			String states = "";
			for (int i = 0; i < serialChannels.length; i++) {		
				states += Boolean.toString(lightController.checkLight(serialChannels[i]))+"-";
	        }
			MqttMessage payload = new MqttMessage(states.getBytes());
			mqttClient.publish("18026172/light/checked", payload);
		}
	}
}
