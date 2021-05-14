SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

-- -----------------------------------------------------
-- Table `db`.`smarthomeapp_users`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `db`.`smarthomeapp_users` ;

CREATE TABLE IF NOT EXISTS `db`.`smarthomeapp_users` (
  `user_id` INT(10) NOT NULL AUTO_INCREMENT,
  `user_firstname` VARCHAR(50) NOT NULL,
  `user_lastname` VARCHAR(50) NOT NULL,
  `user_email` VARCHAR(320) NOT NULL,
  `user_password` VARCHAR(512) NOT NULL,
  `user_token` VARCHAR(32) NULL DEFAULT NULL,
  PRIMARY KEY (`user_id`))
ENGINE = InnoDB
AUTO_INCREMENT = 35
DEFAULT CHARACTER SET = latin1;


-- -----------------------------------------------------
-- Table `db`.`smarthomeapp_devices`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `db`.`smarthomeapp_devices` ;

CREATE TABLE IF NOT EXISTS `db`.`smarthomeapp_devices` (
  `device_id` INT(10) NOT NULL AUTO_INCREMENT,
  `device_serial_number` INT(10) NOT NULL,
  `device_name` VARCHAR(50) NOT NULL,
  `device_type` VARCHAR(50) NOT NULL,
  `device_room` VARCHAR(50) NOT NULL,
  `device_channel` INT(2) NOT NULL,
  `devices_user_id` INT(10) NOT NULL,
  PRIMARY KEY (`device_id`),
  INDEX `fk_smarthomeapp_devices_smarthomeapp_users1_idx` (`devices_user_id` ASC),
  CONSTRAINT `fk_smarthomeapp_devices_smarthomeapp_users1`
    FOREIGN KEY (`devices_user_id`)
    REFERENCES `db`.`smarthomeapp_users` (`user_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB
AUTO_INCREMENT = 57
DEFAULT CHARACTER SET = latin1;


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
