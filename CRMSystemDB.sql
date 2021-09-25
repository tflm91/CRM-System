-- phpMyAdmin SQL Dump
-- version 5.1.1
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Erstellungszeit: 23. Sep 2021 um 23:39
-- Server-Version: 10.4.19-MariaDB
-- PHP-Version: 8.0.7

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Datenbank: `CRMSystemDB`
--

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `AccountManager`
--

CREATE TABLE `AccountManager` (
  `id` int(11) NOT NULL,
  `username` char(20) DEFAULT NULL,
  `passwd` char(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `Customer`
--

CREATE TABLE `Customer` (
  `id` int(11) NOT NULL,
  `lastName` char(20) DEFAULT NULL,
  `firstName` char(20) DEFAULT NULL,
  `street` char(20) DEFAULT NULL,
  `houseNumber` int(11) DEFAULT NULL,
  `postalCode` int(11) DEFAULT NULL,
  `city` char(20) DEFAULT NULL,
  `emailAddress` char(40) DEFAULT NULL,
  `phoneNumber` char(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `Item`
--

CREATE TABLE `Item` (
  `id` int(11) NOT NULL,
  `name` char(20) DEFAULT NULL,
  `quantity` int(11) DEFAULT NULL,
  `basePrice` decimal(6,2) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-----------------------------

--
-- Tabellenstruktur für Tabelle `Purchase`
--

CREATE TABLE `Purchase` (
  `id` int(11) NOT NULL,
  `customer` int(11) DEFAULT NULL,
  `item` int(11) DEFAULT NULL,
  `quantity` int(11) DEFAULT NULL,
  `date` DATE DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `SpecialOffer`
--

CREATE TABLE `SpecialOffer` (
  `id` int(11) NOT NULL,
  `item` int(11) DEFAULT NULL,
  `quantity` int(11) DEFAULT NULL,
  `price` decimal(6,2) DEFAULT NULL,
  `begin` date DEFAULT NULL,
  `expiration` date DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Indizes der exportierten Tabellen
--

--
-- Indizes für die Tabelle `AccountManager`
--
ALTER TABLE `AccountManager`
  ADD PRIMARY KEY (`id`);

--
-- Indizes für die Tabelle `Customer`
--
ALTER TABLE `Customer`
  ADD PRIMARY KEY (`id`);

--
-- Indizes für die Tabelle `Item`
--
ALTER TABLE `Item`
  ADD PRIMARY KEY (`id`);

--
-- Indizes für die Tabelle `Purchase`
--
ALTER TABLE `Purchase`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_customer` (`customer`),
  ADD KEY `fk_item_purchase` (`item`);

--
-- Indizes für die Tabelle `SpecialOffer`
--
ALTER TABLE `SpecialOffer`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_item_specialoffer` (`item`);

--
-- AUTO_INCREMENT für exportierte Tabellen
--

--
-- AUTO_INCREMENT für Tabelle `AccountManager`
--
ALTER TABLE `AccountManager`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT für Tabelle `Customer`
--
ALTER TABLE `Customer`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT für Tabelle `Item`
--
ALTER TABLE `Item`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT für Tabelle `Purchase`
--
ALTER TABLE `Purchase`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT für Tabelle `SpecialOffer`
--
ALTER TABLE `SpecialOffer`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- Constraints der exportierten Tabellen
--

--
-- Constraints der Tabelle `Purchase`
--
ALTER TABLE `Purchase`
  ADD CONSTRAINT `fk_customer` FOREIGN KEY (`customer`) REFERENCES `Customer` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  ADD CONSTRAINT `fk_item_purchase` FOREIGN KEY (`item`) REFERENCES `Item` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

--
-- Constraints der Tabelle `SpecialOffer`
--
ALTER TABLE `SpecialOffer`
  ADD CONSTRAINT `fk_item_specialoffer` FOREIGN KEY (`item`) REFERENCES `Item` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
