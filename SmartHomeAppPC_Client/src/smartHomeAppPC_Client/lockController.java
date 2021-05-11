package smartHomeAppPC_Client;

import com.phidget22.*;

import java.util.ArrayList;
import java.util.List;

public class lockController {
	
	private static List<RCServo> lockList = new ArrayList<RCServo>();
	
	public static RCServo lockExists(Integer serial) { // check if a lock (of a specific serial number) already exists in the list
		for (int i = 0; i < lockList.size(); i++) {
            try {
				if(lockList.get(i).getDeviceSerialNumber() == serial) {
					return lockList.get(i);
				}
			} catch (PhidgetException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
        }
		return null;
	}
	
	public static RCServo createLock(Integer serial) { // create a new lock and add to list
		try {
			RCServo lock = new RCServo();
			lock.setDeviceSerialNumber(serial);
			lock.open(5000);
			lockList.add(lock);
			return lock;
		} catch (PhidgetException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		return null;	
	}
	
	public static double checkLock(Integer serial) { // check current position of lock
		RCServo lock = lockExists(serial);
		if(lock == null) {
			RCServo newLock = createLock(serial);
			try {
				return(newLock.getPosition());
			} catch (PhidgetException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
		}else {
			try {
				return(lock.getPosition());
			} catch (PhidgetException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
		}
		return -1;
	}

	public static void lock(Integer serial) { // lock a specific lock
		RCServo lock = lockExists(serial);
		if(lock == null) {
			RCServo newLock = createLock(serial);
			try {
				newLock.setTargetPosition(180);
				newLock.setEngaged(true);
			} catch (PhidgetException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
		}else {
			try {
				lock.setTargetPosition(180);
				lock.setEngaged(true);
			} catch (PhidgetException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
		}
	}
	
	public static void unlock(Integer serial) { // unlock a specific lock 
		RCServo lock = lockExists(serial);
		if(lock == null) {
			RCServo newLock = createLock(serial);
			try {
				newLock.setTargetPosition(0);
				newLock.setEngaged(true);
			} catch (PhidgetException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
		}else {
			try {
				lock.setTargetPosition(0);
				lock.setEngaged(true);
			} catch (PhidgetException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
		}
	}
}
