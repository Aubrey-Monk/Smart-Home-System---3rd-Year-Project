package smartHomeAppPC_Client;

import java.sql.Timestamp;

import org.eclipse.paho.client.mqttv3.*;

public class subscriberCallback implements MqttCallback {

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
	}
}
