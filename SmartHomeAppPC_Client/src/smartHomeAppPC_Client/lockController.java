package smartHomeAppPC_Client;

import java.util.ArrayList;
import java.util.List;
import com.phidget22.*;

public class lockController {
	
	private static List<RCServo> lockList = new ArrayList<RCServo>();
	
	public static RCServo lockExists(Integer serial) {
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
	
	public static RCServo createLock(Integer serial) {
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
	
	public static void checkLock(Integer serial) {
		RCServo lock = lockExists(serial);
		if(lock == null) {
			RCServo newLock = createLock(serial);
			try {
				System.out.println(newLock.getPosition());
			} catch (PhidgetException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
		}else {
			try {
				System.out.println(lock.getPosition());
			} catch (PhidgetException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
		}
	}

	public static void lock(Integer serial) {
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
	
	public static void unlock(Integer serial) {
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
