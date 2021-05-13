package smartHomeAppPC_Client;

import com.phidget22.*;

import java.util.ArrayList;
import java.util.List;

public class lockController {
	
	private static List<RCServo> lockList = new ArrayList<RCServo>();
	
	public static RCServo lockExists(Integer serial) { // check if a lock (of a specific serial number) already exists in the list
		for (int i = 0; i < lockList.size(); i++) { // loop through list of added locks
            try {
				if(lockList.get(i).getDeviceSerialNumber() == serial) { // check if serial is the same
					return lockList.get(i); // if found return the instance of the lock
				}
			} catch (PhidgetException e) {
				e.printStackTrace();
			}
        }
		return null;
	}
	
	public static RCServo createLock(Integer serial) { // create a new lock and add to list
		try {
			// create new lock
			RCServo lock = new RCServo();
			lock.setDeviceSerialNumber(serial);
			lock.open(5000);
			// add new lock to the list
			lockList.add(lock);
			return lock;
		} catch (PhidgetException e) {
			e.printStackTrace();
		}
		return null;	
	}
	
	public static double checkLock(Integer serial) { // check current position of lock
		RCServo lock = lockExists(serial);
		if(lock == null) {
			RCServo newLock = createLock(serial);
			try {
				return(newLock.getPosition()); // return current position
			} catch (PhidgetException e) {
				try { // see if lock has been reconnected
					newLock.setTargetPosition(180);
					newLock.setEngaged(true);
					return(180.0);
				} catch (PhidgetException _e) {
					return 1.0; // on error return as if no lock exists
				}
			}
		}else {
			try {
				return(lock.getPosition()); // try to get current position
			} catch (PhidgetException e) {
				try { // see if lock has been reconnected
					lock.setTargetPosition(180);
					lock.setEngaged(true);
					return(180.0);
				} catch (PhidgetException _e) {
					return 1.0; // on error return as if no lock exists
				}
			}
		}
	}

	public static void lock(Integer serial) { // lock a specific lock
		RCServo lock = lockExists(serial); // set lock to returned lock after checking it exists
		// if lockExists returns null then create new lock
		if(lock == null) {
			RCServo newLock = createLock(serial); 
			try {
				// lock the new lock
				newLock.setTargetPosition(180);
				newLock.setEngaged(true);
			} catch (PhidgetException e) {
				e.printStackTrace();
			}
		}else {
			try {
				// lock the lock
				lock.setTargetPosition(180);
				lock.setEngaged(true);
			} catch (PhidgetException e) {
				e.printStackTrace();
			}
		}
	}
	
	public static void unlock(Integer serial) { // unlock a specific lock 
		RCServo lock = lockExists(serial); // set lock to returned lock after checking it exists
		// if lockExists returns null then create new lock
		if(lock == null) {
			RCServo newLock = createLock(serial);
			try {
				// unlock the new lock
				newLock.setTargetPosition(0);
				newLock.setEngaged(true);
			} catch (PhidgetException e) {
				e.printStackTrace();
			}
		}else {
			try {
				// unlock the lock
				lock.setTargetPosition(0);
				lock.setEngaged(true);
			} catch (PhidgetException e) {
				e.printStackTrace();
			}
		}
	}
}
