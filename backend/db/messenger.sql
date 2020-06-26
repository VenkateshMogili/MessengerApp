-- phpMyAdmin SQL Dump
-- version 5.0.1
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Generation Time: Jun 26, 2020 at 01:46 PM
-- Server version: 10.4.11-MariaDB
-- PHP Version: 7.4.2

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `messenger`
--

-- --------------------------------------------------------

--
-- Table structure for table `conversation`
--

CREATE TABLE `conversation` (
  `_id` varchar(500) NOT NULL COMMENT 'It should be string',
  `text` varchar(1000) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL COMMENT 'it should be utf8mb4_unicode_ci',
  `image` varchar(1000) DEFAULT NULL,
  `video` varchar(1000) DEFAULT NULL,
  `createdAt` timestamp NOT NULL DEFAULT current_timestamp() COMMENT 'message sent time',
  `user_id` varchar(100) CHARACTER SET latin1 NOT NULL COMMENT 'sender id',
  `userTo` varchar(100) CHARACTER SET latin1 NOT NULL COMMENT 'receiver id',
  `sent` int(11) NOT NULL DEFAULT 0 COMMENT 'sent status',
  `received` int(11) NOT NULL DEFAULT 0 COMMENT 'received status'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `profiles`
--

CREATE TABLE `profiles` (
  `sno` int(11) NOT NULL,
  `userid` varchar(100) NOT NULL,
  `phone` varchar(20) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) CHARACTER SET utf8 NOT NULL,
  `firstname` varchar(30) NOT NULL,
  `middlename` varchar(255) DEFAULT NULL,
  `lastname` varchar(100) NOT NULL,
  `relation` varchar(255) DEFAULT NULL,
  `image` varchar(255) NOT NULL DEFAULT 'Liberty_Social/Users/logo1_c3wzeg',
  `coverphoto` varchar(10000) NOT NULL DEFAULT 'Liberty_Social/Users/ls_cover_photo_1',
  `gender` varchar(11) DEFAULT NULL,
  `dob` varchar(255) DEFAULT NULL,
  `nickname` varchar(255) DEFAULT NULL,
  `habits` mediumtext DEFAULT NULL,
  `relationstatus` varchar(255) DEFAULT NULL,
  `interests` varchar(5000) DEFAULT NULL,
  `religion` varchar(255) DEFAULT NULL,
  `aboutme` varchar(5000) DEFAULT NULL,
  `location_on_app` varchar(255) DEFAULT NULL,
  `verified` int(11) NOT NULL DEFAULT 0,
  `blocked` int(11) NOT NULL DEFAULT 0,
  `appversion` int(11) DEFAULT NULL,
  `token` varchar(1000) NOT NULL,
  `createdat` timestamp NOT NULL DEFAULT current_timestamp(),
  `updatedat` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `conversation`
--
ALTER TABLE `conversation`
  ADD PRIMARY KEY (`_id`) USING BTREE,
  ADD KEY `sender` (`user_id`),
  ADD KEY `receiver` (`userTo`);

--
-- Indexes for table `profiles`
--
ALTER TABLE `profiles`
  ADD PRIMARY KEY (`userid`),
  ADD UNIQUE KEY `sno` (`sno`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `profiles`
--
ALTER TABLE `profiles`
  MODIFY `sno` int(11) NOT NULL AUTO_INCREMENT;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `conversation`
--
ALTER TABLE `conversation`
  ADD CONSTRAINT `receiver` FOREIGN KEY (`userTo`) REFERENCES `profiles` (`userid`),
  ADD CONSTRAINT `sender` FOREIGN KEY (`user_id`) REFERENCES `profiles` (`userid`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
