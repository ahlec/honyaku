CREATE TABLE `origins` (
	`origin_id` INT(10) UNSIGNED NOT NULL AUTO_INCREMENT,
	`title` TEXT NOT NULL COLLATE 'utf16_bin',
	`origin_type` ENUM('game','manga','anime','book','news') NOT NULL COLLATE 'utf16_bin',
	PRIMARY KEY (`origin_id`)
)
COLLATE='utf16_bin'
ENGINE=InnoDB
;

CREATE TABLE `records` (
	`record_id` INT(10) UNSIGNED NOT NULL AUTO_INCREMENT,
	`created` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
	`has_image` BIT(1) NOT NULL DEFAULT b'0',
	`origin_id` INT(10) UNSIGNED NOT NULL DEFAULT '0',
	`origin_chapter_no` INT(10) UNSIGNED NULL DEFAULT NULL,
	`origin_page_no` INT(10) UNSIGNED NULL DEFAULT NULL,
	`origin_season_no` INT(10) UNSIGNED NULL DEFAULT NULL,
	`origin_episode_no` INT(10) UNSIGNED NULL DEFAULT NULL,
	PRIMARY KEY (`record_id`),
	INDEX `records_origin_FK` (`origin_id`),
	CONSTRAINT `records_origin_FK` FOREIGN KEY (`origin_id`) REFERENCES `origins` (`origin_id`)
)
COLLATE='utf16_bin'
ENGINE=InnoDB
;


CREATE TABLE `official_translations` (
	`translation_id` INT(10) UNSIGNED NOT NULL AUTO_INCREMENT,
	`record_id` INT(10) UNSIGNED NOT NULL,
	`translation` TEXT NOT NULL COLLATE 'utf16_bin',
	`comments` TEXT NULL COLLATE 'utf16_bin',
	PRIMARY KEY (`translation_id`),
	INDEX `official_translation_record_FK` (`record_id`),
	CONSTRAINT `official_translation_record_FK` FOREIGN KEY (`record_id`) REFERENCES `records` (`record_id`)
)
COLLATE='utf16_bin'
ENGINE=InnoDB
;


CREATE TABLE `user_translations` (
	`translation_id` INT(10) UNSIGNED NOT NULL AUTO_INCREMENT,
	`record_id` INT(10) UNSIGNED NOT NULL,
	`created` TIMESTAMP NOT NULL,
	`modified` TIMESTAMP NULL DEFAULT NULL,
	`translation` TEXT NOT NULL COLLATE 'utf16_bin',
	`comments` TEXT NULL COLLATE 'utf16_bin',
	PRIMARY KEY (`translation_id`),
	INDEX `user_translations_record_FK` (`record_id`),
	CONSTRAINT `user_translations_record_FK` FOREIGN KEY (`record_id`) REFERENCES `records` (`record_id`)
)
COLLATE='utf16_bin'
ENGINE=InnoDB
;
