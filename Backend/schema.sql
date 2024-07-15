-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

-- -----------------------------------------------------
-- Schema mydb
-- -----------------------------------------------------
-- -----------------------------------------------------
-- Schema service_sphere
-- -----------------------------------------------------

-- -----------------------------------------------------
-- Schema service_sphere
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `service_sphere` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci ;
USE `service_sphere` ;

-- -----------------------------------------------------
-- Table `service_sphere`.`countrys`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `service_sphere`.`countrys` (
  `countryID` INT NOT NULL AUTO_INCREMENT,
  `countryName` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`countryID`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `service_sphere`.`jobs`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `service_sphere`.`jobs` (
  `jobID` INT NOT NULL AUTO_INCREMENT,
  `jobName` VARCHAR(100) NOT NULL,
  PRIMARY KEY (`jobID`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `service_sphere`.`laborers`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `service_sphere`.`laborers` (
  `laborerID` INT NOT NULL AUTO_INCREMENT,
  `fullName` VARCHAR(150) NOT NULL,
  `email` VARCHAR(200) NOT NULL,
  `password` VARCHAR(300) NOT NULL,
  `image` VARCHAR(200) NULL DEFAULT NULL,
  `experience` VARCHAR(300) NOT NULL,
  `phone` VARCHAR(100) NOT NULL,
  `jobID` INT NOT NULL,
  `countryID` INT NOT NULL,
  PRIMARY KEY (`laborerID`),
  INDEX `jobID_idx` (`jobID` ASC) VISIBLE,
  INDEX `countryID_idx` (`countryID` ASC) VISIBLE,
  CONSTRAINT `countryID`
    FOREIGN KEY (`countryID`)
    REFERENCES `service_sphere`.`countrys` (`countryID`),
  CONSTRAINT `jobID`
    FOREIGN KEY (`jobID`)
    REFERENCES `service_sphere`.`jobs` (`jobID`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `service_sphere`.`images`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `service_sphere`.`images` (
  `imageID` INT UNSIGNED NOT NULL,
  `imageUrl` VARCHAR(300) NOT NULL,
  `laborerID` INT NOT NULL,
  PRIMARY KEY (`imageID`),
  INDEX `LAVB_idx` (`laborerID` ASC) VISIBLE,
  CONSTRAINT `LAVB`
    FOREIGN KEY (`laborerID`)
    REFERENCES `service_sphere`.`laborers` (`laborerID`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `service_sphere`.`users`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `service_sphere`.`users` (
  `userID` INT NOT NULL AUTO_INCREMENT,
  `fullName` VARCHAR(100) NOT NULL,
  `email` VARCHAR(200) NOT NULL,
  `password` VARCHAR(200) NOT NULL,
  `addresse` VARCHAR(200) NULL DEFAULT NULL,
  `countryID` INT NOT NULL,
  PRIMARY KEY (`userID`),
  INDEX `countryID` (`countryID` ASC) VISIBLE,
  CONSTRAINT `users_ibfk_1`
    FOREIGN KEY (`countryID`)
    REFERENCES `service_sphere`.`countrys` (`countryID`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `service_sphere`.`job_requests`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `service_sphere`.`job_requests` (
  `job_requestsID` INT NOT NULL AUTO_INCREMENT,
  `address` VARCHAR(200) NOT NULL,
  `description` VARCHAR(200) NOT NULL,
  `time` TIMESTAMP NOT NULL,
  `userID` INT NOT NULL,
  `laborerID` INT NOT NULL,
  `seen` TINYINT(1) NULL DEFAULT '0',
  PRIMARY KEY (`job_requestsID`),
  INDEX `laborerID` (`laborerID` ASC) VISIBLE,
  INDEX `userID` (`userID` ASC) VISIBLE,
  CONSTRAINT `job_requests_ibfk_1`
    FOREIGN KEY (`laborerID`)
    REFERENCES `service_sphere`.`laborers` (`laborerID`),
  CONSTRAINT `job_requests_ibfk_2`
    FOREIGN KEY (`userID`)
    REFERENCES `service_sphere`.`users` (`userID`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `service_sphere`.`messages`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `service_sphere`.`messages` (
  `messageID` INT UNSIGNED NOT NULL,
  `userID` INT NOT NULL,
  `laborerID` INT NOT NULL,
  `text` VARCHAR(400) NULL DEFAULT NULL,
  `image` VARCHAR(200) NULL DEFAULT NULL,
  `sender` ENUM('user', 'laborer') NOT NULL,
  `sent_at` TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  `read_at` TIMESTAMP NULL DEFAULT NULL,
  PRIMARY KEY (`messageID`),
  INDEX `laborerID` (`laborerID` ASC) VISIBLE,
  INDEX `userID` (`userID` ASC) VISIBLE,
  CONSTRAINT `messages_ibfk_1`
    FOREIGN KEY (`laborerID`)
    REFERENCES `service_sphere`.`laborers` (`laborerID`),
  CONSTRAINT `messages_ibfk_2`
    FOREIGN KEY (`userID`)
    REFERENCES `service_sphere`.`users` (`userID`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `service_sphere`.`rating`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `service_sphere`.`rating` (
  `ratingID` INT NOT NULL AUTO_INCREMENT,
  `comment` VARCHAR(250) NULL DEFAULT NULL,
  `rate` INT NULL DEFAULT NULL,
  `laborerID` INT NOT NULL,
  `userID` INT NOT NULL,
  PRIMARY KEY (`ratingID`),
  INDEX `ll_idx` (`laborerID` ASC) VISIBLE,
  INDEX `kk_idx` (`userID` ASC) VISIBLE,
  CONSTRAINT `kk`
    FOREIGN KEY (`userID`)
    REFERENCES `service_sphere`.`users` (`userID`),
  CONSTRAINT `ll`
    FOREIGN KEY (`laborerID`)
    REFERENCES `service_sphere`.`laborers` (`laborerID`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `service_sphere`.`user_laborer_appointments`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `service_sphere`.`user_laborer_appointments` (
  `UserLaborerAppointmentsID` INT NOT NULL AUTO_INCREMENT,
  `userID` INT NOT NULL,
  `laborerID` INT NOT NULL,
  `price` DECIMAL(2,0) NOT NULL,
  `isFinish` TINYINT(1) NOT NULL DEFAULT '0',
  `timeStart` TIMESTAMP NOT NULL,
  `timeFinish` TIMESTAMP NOT NULL,
  PRIMARY KEY (`UserLaborerAppointmentsID`),
  INDEX `aa_idx` (`laborerID` ASC) VISIBLE,
  INDEX `ss_idx` (`userID` ASC) VISIBLE,
  CONSTRAINT `aa`
    FOREIGN KEY (`laborerID`)
    REFERENCES `service_sphere`.`laborers` (`laborerID`),
  CONSTRAINT `ss`
    FOREIGN KEY (`userID`)
    REFERENCES `service_sphere`.`users` (`userID`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;