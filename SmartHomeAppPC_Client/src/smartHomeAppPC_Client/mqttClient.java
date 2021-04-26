package smartHomeAppPC_Client;

import org.eclipse.paho.client.mqttv3.*;

public class mqttClient {

	private String clientId = "18026172_PC_Client";
	private String brokerUrl = "ws://test.mosquitto.org:8080";
    private static MqttClient mqttClient;

    public mqttClient() 
    {
    	try 
    	{
    		mqttClient = new MqttClient(brokerUrl, clientId);
        } 
    	catch (MqttException e) 
    	{
            e.printStackTrace();
        } 
    }
    
    public void subscribe(String[] topics) 
    {
        try 
        {
	        mqttClient.setCallback(new subscriberCallback());
	        mqttClient.connect();
	        for (int i = 0; i < topics.length; i++) {
	        	  mqttClient.subscribe(topics[i]);
	        	  System.out.println("Subscribed to topic: " + topics[i]);
	        }
	        
        } 
        catch (MqttException e) 
        {
            e.printStackTrace();
        }
    }
    
}
