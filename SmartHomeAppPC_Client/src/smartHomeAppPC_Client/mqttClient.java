package smartHomeAppPC_Client;

import java.util.UUID;

import org.eclipse.paho.client.mqttv3.*;

public class mqttClient {

	// client details
	private String clientId = UUID.randomUUID().toString();
	private String brokerUrl = "ws://test.mosquitto.org:8080";
    private static MqttClient mqttClient;

    public mqttClient() 
    {
    	try 
    	{
    		// create new client
    		mqttClient = new MqttClient(brokerUrl, clientId);
    		// set callback
    		mqttClient.setCallback(new subscriberCallback(mqttClient));
    		// connect to new client
	        mqttClient.connect();
        } 
    	catch (MqttException e) 
    	{
            e.printStackTrace();
        } 
    }
    
    // custom subscribe method to subscribe to multiple topics at once
    public void subscribe(String[] topics) 
    {
        try 
        {
        	// subscribe to each topic in given array
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
