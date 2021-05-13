package smartHomeAppPC_Client;

import java.sql.Timestamp;

import org.eclipse.paho.client.mqttv3.*;

public class subscriberCallback implements MqttCallback {
	MqttClient mqttClient;
	
	// constructor
	public subscriberCallback(MqttClient mqttClient) {
		// get instance of client so it can be used for publishing
		this.mqttClient = mqttClient;
	}

	@Override
    public void connectionLost(Throwable arg0) {}

	@Override
	public void deliveryComplete(IMqttDeliveryToken arg0) {}

	@Override
	public void messageArrived(String topic, MqttMessage message) throws Exception { // whenever a new MQTT message arrives on any of the subscribed topics
		// log message ion console
		String time = new Timestamp(System.currentTimeMillis()).toString();
		System.out.println("Time:\t" +time +
                "  Topic:\t" + topic +
                "  Message:\t" + new String(message.getPayload()) +
                "  QoS:\t" + message.getQos());
		
		// for locks
		
		if(topic.equals("18026172/lock/lock")) {
			lockController.lock(Integer.parseInt(new String(message.getPayload())));
		}
		if(topic.equals("18026172/lock/unlock")) {
			lockController.unlock(Integer.parseInt(new String(message.getPayload())));
		}
		if(topic.equals("18026172/lock/check")) {
			String[] serials = new String(message.getPayload()).split("-");
			String positions = "";
			// check state of each lock and append all to a string ready to be published
			for (int i = 0; i < serials.length; i++) {	
				// if first time using lock set state to locked (180)
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
		
		// for lights
		
		if(topic.equals("18026172/light/on")) {
			lightController.on(new String(message.getPayload()));
		}
		if(topic.equals("18026172/light/off")) {
			lightController.off(new String(message.getPayload()));
		}
		if(topic.equals("18026172/light/check")) {
			String[] serialChannels = new String(message.getPayload()).split("-");
			String states = "";
			// check state of each light and append all to a string ready to be published
			for (int i = 0; i < serialChannels.length; i++) {		
				states += Boolean.toString(lightController.checkLight(serialChannels[i]))+"-";
	        }
			MqttMessage payload = new MqttMessage(states.getBytes());
			mqttClient.publish("18026172/light/checked", payload);
		}
		
		// for door bell
		
		if(topic.equals("18026172/doorbell/activate")) {
			doorbellController.activate(new String(message.getPayload()), mqttClient);
		}
		if(topic.equals("18026172/doorbell/deactivate")) {
			doorbellController.deactivate(new String(message.getPayload()));
		}
		
		// for motion sensors
		
		if(topic.equals("18026172/motion/activate")) {
			motionSensorController.activate(new String(message.getPayload()), mqttClient);
		}
		if(topic.equals("18026172/motion/deactivate")) {
			motionSensorController.deactivate(new String(message.getPayload()));
		}
		if(topic.equals("18026172/motion/check")) {
			String[] serialChannels = new String(message.getPayload()).split("-");
			String states = "";
			// check state of each motion sensor and append all to a string ready to be published
			for (int i = 0; i < serialChannels.length; i++) {		
				states += Boolean.toString(motionSensorController.checkSensor(serialChannels[i]))+"-";
	        }
			MqttMessage payload = new MqttMessage(states.getBytes());
			mqttClient.publish("18026172/motion/checked", payload);
		}
	}
}
