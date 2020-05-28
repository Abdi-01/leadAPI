CREATE DATABASE  IF NOT EXISTS `db-lead` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `db-lead`;
-- MySQL dump 10.13  Distrib 8.0.18, for Win64 (x86_64)
--
-- Host: localhost    Database: db-lead
-- ------------------------------------------------------
-- Server version	8.0.18

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `tb_cart`
--

DROP TABLE IF EXISTS `tb_cart`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tb_cart` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `userID` int(11) NOT NULL,
  `productID` int(11) NOT NULL,
  `stockID` int(11) NOT NULL,
  `qty` int(11) NOT NULL,
  `price` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FK_cart_user_idx` (`userID`),
  KEY `FK_cart_product_idx` (`productID`),
  KEY `FK_cartstock_idx` (`stockID`),
  CONSTRAINT `FK_cart_product` FOREIGN KEY (`productID`) REFERENCES `tb_products` (`id`),
  CONSTRAINT `FK_cart_user` FOREIGN KEY (`userID`) REFERENCES `tb_users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `FK_cartstock` FOREIGN KEY (`stockID`) REFERENCES `tb_stock` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=25 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tb_cart`
--

LOCK TABLES `tb_cart` WRITE;
/*!40000 ALTER TABLE `tb_cart` DISABLE KEYS */;
INSERT INTO `tb_cart` VALUES (22,20,9,29,1,125000);
/*!40000 ALTER TABLE `tb_cart` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tb_categories`
--

DROP TABLE IF EXISTS `tb_categories`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tb_categories` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `category` varchar(45) NOT NULL,
  `parentId` int(11) DEFAULT NULL,
  `customPrice` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FKcategory_idx` (`parentId`),
  CONSTRAINT `FKcategory` FOREIGN KEY (`parentId`) REFERENCES `tb_categories` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tb_categories`
--

LOCK TABLES `tb_categories` WRITE;
/*!40000 ALTER TABLE `tb_categories` DISABLE KEYS */;
INSERT INTO `tb_categories` VALUES (1,'Global Product',NULL,NULL),(2,'Sport Apparel',NULL,NULL),(3,'T-Shirt',1,85000),(4,'Shirt',1,90000),(5,'Hoodie',1,110000),(6,'Jersey',2,125000);
/*!40000 ALTER TABLE `tb_categories` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tb_custom`
--

DROP TABLE IF EXISTS `tb_custom`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tb_custom` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `invoice` varchar(45) DEFAULT NULL,
  `imagepath` varchar(45) NOT NULL,
  `userID` int(11) NOT NULL,
  `category` varchar(45) NOT NULL,
  `material` varchar(45) NOT NULL,
  `detail` varchar(100) NOT NULL,
  `qty` int(11) NOT NULL,
  `price` int(11) NOT NULL,
  `note` varchar(200) DEFAULT NULL,
  `statusOrder` varchar(45) DEFAULT 'On Transaction',
  PRIMARY KEY (`id`),
  KEY `FK_custom_user_idx` (`userID`),
  CONSTRAINT `FK_custom_user` FOREIGN KEY (`userID`) REFERENCES `tb_users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tb_custom`
--

LOCK TABLES `tb_custom` WRITE;
/*!40000 ALTER TABLE `tb_custom` DISABLE KEYS */;
INSERT INTO `tb_custom` VALUES (2,'LEAD_RDBW5Y','/customOrder/IMG1584720676112.png',2,'T-Shirt','Cotton','S = 22/M = 33/L = 33/',88,85000,'COba','On Transaction'),(3,'LEAD_IID7LG','/customOrder/IMG1584870011135.jpg',6,'Hoodie','Fleece','M = 5/L = 10/',15,110000,'Sablon yang bagus','On Transaction'),(6,NULL,'/customOrder/IMG1585043085728.png',21,'T-Shirt','Cotton','M = 5/L = 5/',10,85000,'Cek barang','On Transaction');
/*!40000 ALTER TABLE `tb_custom` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tb_history`
--

DROP TABLE IF EXISTS `tb_history`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tb_history` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `invoice` varchar(45) NOT NULL DEFAULT 'null',
  `userID` int(11) NOT NULL,
  `productID` int(11) NOT NULL,
  `stockID` int(11) NOT NULL,
  `qty` int(11) NOT NULL,
  `price` int(11) NOT NULL,
  `status` varchar(45) NOT NULL DEFAULT 'Unpaid',
  `transactionID` int(11) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `FK_history_user_idx` (`userID`),
  KEY `FK_history_product_idx` (`productID`),
  KEY `FK_history_transaction_idx` (`transactionID`,`invoice`),
  KEY `FK_history_trans_idx` (`transactionID`),
  KEY `FK_history_stock_idx` (`stockID`),
  CONSTRAINT `FK_history_product` FOREIGN KEY (`productID`) REFERENCES `tb_products` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `FK_history_stock` FOREIGN KEY (`stockID`) REFERENCES `tb_stock` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `FK_history_trans` FOREIGN KEY (`transactionID`) REFERENCES `tb_transactions` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `FK_history_user` FOREIGN KEY (`userID`) REFERENCES `tb_users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tb_history`
--

LOCK TABLES `tb_history` WRITE;
/*!40000 ALTER TABLE `tb_history` DISABLE KEYS */;
INSERT INTO `tb_history` VALUES (1,'LEAD_EN0Z8E',2,2,5,2,240000,'Unpaid',1),(2,'LEAD_17EEZK',4,4,12,2,220000,'Unpaid',2),(3,'LEAD_17EEZK',4,4,13,3,330000,'Unpaid',2),(5,'LEAD_6MQ8ME',4,7,21,2,300000,'Unpaid',3),(6,'LEAD_KPG3L5',2,11,40,1,140000,'Unpaid',6),(7,'LEAD_KPG3L5',2,11,41,2,280000,'Unpaid',6),(9,'LEAD_Y7PZUL',6,20,54,2,400000,'Unpaid',7),(10,'LEAD_F1BXGU',10,16,36,2,130000,'Unpaid',9),(11,'LEAD_P12NXK',21,1,1,3,360000,'Unpaid',10),(12,'LEAD_P12NXK',21,1,2,2,240000,'Unpaid',10);
/*!40000 ALTER TABLE `tb_history` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tb_materials`
--

DROP TABLE IF EXISTS `tb_materials`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tb_materials` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `material` varchar(45) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tb_materials`
--

LOCK TABLES `tb_materials` WRITE;
/*!40000 ALTER TABLE `tb_materials` DISABLE KEYS */;
INSERT INTO `tb_materials` VALUES (1,'Cotton'),(2,'Fleece'),(3,'Leather'),(4,'Parasut'),(5,'Diadora');
/*!40000 ALTER TABLE `tb_materials` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tb_productcat`
--

DROP TABLE IF EXISTS `tb_productcat`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tb_productcat` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `productID` int(11) NOT NULL,
  `categoryID` int(11) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FKproductCat_idx` (`productID`),
  KEY `FKcatProCat_idx` (`categoryID`),
  CONSTRAINT `FKcatProCat` FOREIGN KEY (`categoryID`) REFERENCES `tb_categories` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `FKproductCat` FOREIGN KEY (`productID`) REFERENCES `tb_products` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=53 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tb_productcat`
--

LOCK TABLES `tb_productcat` WRITE;
/*!40000 ALTER TABLE `tb_productcat` DISABLE KEYS */;
INSERT INTO `tb_productcat` VALUES (1,1,3),(2,1,1),(3,2,3),(4,2,1),(5,3,3),(6,3,1),(7,4,3),(8,4,1),(9,5,3),(10,5,1),(13,7,3),(14,7,1),(17,9,5),(18,9,1),(19,10,5),(20,10,1),(21,11,5),(22,11,1),(25,13,5),(26,13,1),(29,15,4),(30,15,1),(31,16,4),(32,16,1),(33,17,6),(34,17,2),(35,18,6),(36,18,2),(37,19,6),(38,19,2),(39,20,6),(40,20,2),(43,22,3),(44,22,1),(45,23,3),(46,23,1),(47,24,3),(48,24,1),(49,25,5),(50,25,1),(51,26,3),(52,26,1);
/*!40000 ALTER TABLE `tb_productcat` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tb_products`
--

DROP TABLE IF EXISTS `tb_products`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tb_products` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(45) NOT NULL,
  `imagepath` varchar(45) NOT NULL,
  `materialID` int(11) NOT NULL,
  `description` varchar(200) NOT NULL,
  `price` int(11) NOT NULL,
  `last_update` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=27 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tb_products`
--

LOCK TABLES `tb_products` WRITE;
/*!40000 ALTER TABLE `tb_products` DISABLE KEYS */;
INSERT INTO `tb_products` VALUES (1,'Solidarity 04','/images/IMG1583856401562.png',2,'Kaos Lead yang di design secara uptodate bermaterial katun tidak transparan, ringan dan tidak stretch cocok untuk kamu yang ingin tampil stylish disaat beraktifitas.',120000,'2020-03-24 07:53:40'),(2,'Adventura 1','/images/IMG1583856451582.png',2,'Kaos Lead yang di design secara uptodate bermaterial katun tidak transparan, ringan dan tidak stretch cocok untuk kamu yang ingin tampil stylish disaat beraktifitas.',120000,'2020-03-24 07:33:17'),(3,'Solidarity V3','/images/IMG1583856485047.png',3,'Kaos Lead yang di design secara uptodate bermaterial katun tidak transparan, ringan dan tidak stretch cocok untuk kamu yang ingin tampil stylish disaat beraktifitas.',90000,'2020-03-24 07:36:14'),(4,'Assembler 2','/images/IMG1583856576970.png',4,'Kaos Lead yang di design secara uptodate bermaterial katun tidak transparan, ringan dan tidak stretch cocok untuk kamu yang ingin tampil stylish disaat beraktifitas.',110000,'2020-03-24 07:30:14'),(5,'Engineer Community','/images/IMG1583856622135.jpg',5,'Kaos Lead yang di design secara uptodate bermaterial katun tidak transparan, ringan dan tidak stretch cocok untuk kamu yang ingin tampil stylish disaat beraktifitas.',115000,'2020-03-22 12:32:57'),(7,'Mabok Coding 12','/images/IMG1583856718745.png',1,'Kaos Lead yang di design secara uptodate bermaterial katun tidak transparan, ringan dan tidak stretch cocok untuk kamu yang ingin tampil stylish disaat beraktifitas.',150000,'2020-03-24 09:48:03'),(9,'Hoodie v1','/images/IMG1583856869935.jpeg',2,'Hoodie Lead yang di design secara uptodate bermaterial katun tidak transparan, ringan dan tidak stretch cocok untuk kamu yang ingin tampil stylish disaat beraktifitas.',125000,'2020-03-10 16:14:29'),(10,'Black Shadow','/images/IMG1583856906910.jpg',2,'Hoodie Lead yang di design secara uptodate bermaterial katun tidak transparan, ringan dan tidak stretch cocok untuk kamu yang ingin tampil stylish disaat beraktifitas.',130000,'2020-03-10 16:15:06'),(11,'Hoodie v3','/images/IMG1583856936782.jpg',5,'Hoodie Lead yang di design secara uptodate bermaterial katun tidak transparan, ringan dan tidak stretch cocok untuk kamu yang ingin tampil stylish disaat beraktifitas.',140000,'2020-03-11 02:22:49'),(13,'Hoodie v2','/images/IMG1583857015797.jpg',4,'Hoodie Lead yang di design secara uptodate bermaterial katun tidak transparan, ringan dan tidak stretch cocok untuk kamu yang ingin tampil stylish disaat beraktifitas.\n',85000,'2020-03-10 16:16:55'),(15,'Adventura Army New','/images/IMG1583857154112.jpg',1,'Kemeja Lead yang di design secara uptodate bermaterial katun tidak transparan, ringan dan tidak stretch cocok untuk kamu yang ingin tampil stylish disaat beraktifitas.',95000,'2020-03-24 07:53:56'),(16,'Leviman','/images/IMG1583857192700.jpg',3,'Kemeja Lead yang di design secara uptodate bermaterial katun tidak transparan, ringan dan tidak stretch cocok untuk kamu yang ingin tampil stylish disaat beraktifitas.',65000,'2020-03-10 16:19:52'),(17,'Lead Monowhite','/images/IMG1583857295923.png',5,'Jersey Lead yang di design secara uptodate bermaterial katun tidak transparan, ringan dan tidak stretch cocok untuk kamu yang ingin tampil stylish disaat beraktifitas.',120000,'2020-03-10 16:21:35'),(18,'LEAD Toscargo','/images/IMG1583857343204.png',5,'Jersey Lead yang di design secara uptodate bermaterial katun tidak transparan, ringan dan tidak stretch cocok untuk kamu yang ingin tampil stylish disaat beraktifitas.',130000,'2020-03-10 16:22:23'),(19,'LEAD Gol D','/images/IMG1583857385431.png',5,'Jersey Lead yang di design secara uptodate bermaterial katun tidak transparan, ringan dan tidak stretch cocok untuk kamu yang ingin tampil stylish disaat beraktifitas.',165000,'2020-03-10 16:23:05'),(20,'Football ARMY','/images/IMG1583857742056.jpg',5,'Jersey Lead yang di design secara uptodate bermaterial katun tidak transparan, ringan dan tidak stretch cocok untuk kamu yang ingin tampil stylish disaat beraktifitas.',200000,'2020-03-10 16:29:02'),(22,'Get yours','/images/IMG1585034927023.png',4,'Kaos juara andalanku',85000,'2020-03-24 07:28:47'),(23,'Go Pro','/images/IMG1584883531953.png',1,'Kaos fotografer',75000,'2020-03-22 13:25:32'),(24,'Mainbasket 01','/images/IMG1584883578969.png',4,'Kaos hoby basket',110000,'2020-03-24 07:37:21'),(25,'Yellow CrossX','/images/IMG1584883632274.jpg',1,'Hoodie  kece',140000,'2020-03-24 07:36:48'),(26,'New','/images/IMG1585035664933.png',2,'Kaosku',95000,'2020-03-24 07:41:04');
/*!40000 ALTER TABLE `tb_products` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tb_sizes`
--

DROP TABLE IF EXISTS `tb_sizes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tb_sizes` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `size` varchar(45) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tb_sizes`
--

LOCK TABLES `tb_sizes` WRITE;
/*!40000 ALTER TABLE `tb_sizes` DISABLE KEYS */;
INSERT INTO `tb_sizes` VALUES (1,'S'),(2,'M'),(3,'L'),(4,'XL'),(5,'XXL'),(6,'XXXL');
/*!40000 ALTER TABLE `tb_sizes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tb_stock`
--

DROP TABLE IF EXISTS `tb_stock`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tb_stock` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `productID` int(11) NOT NULL,
  `sizeID` int(11) NOT NULL,
  `stock` int(11) NOT NULL,
  `last_update` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `pro.stock_idx` (`productID`),
  KEY `size.stock_idx` (`sizeID`),
  CONSTRAINT `FKproductStock` FOREIGN KEY (`productID`) REFERENCES `tb_products` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `FKsizeStock` FOREIGN KEY (`sizeID`) REFERENCES `tb_sizes` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=77 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tb_stock`
--

LOCK TABLES `tb_stock` WRITE;
/*!40000 ALTER TABLE `tb_stock` DISABLE KEYS */;
INSERT INTO `tb_stock` VALUES (1,1,1,17,'2020-03-24 09:35:03'),(2,1,2,18,'2020-03-24 09:35:03'),(3,1,3,30,'2020-03-17 10:33:57'),(4,2,1,5,'2020-03-17 10:34:32'),(5,2,2,15,'2020-03-24 02:06:51'),(6,2,3,20,'2020-03-17 10:34:32'),(7,2,4,30,'2020-03-17 10:34:32'),(8,3,1,5,'2020-03-24 08:24:16'),(9,3,2,15,'2020-03-17 10:35:47'),(10,3,3,20,'2020-03-17 10:35:47'),(11,3,4,2,'2020-03-17 10:35:47'),(12,4,3,15,'2020-03-21 16:00:59'),(13,4,4,18,'2020-03-18 16:29:49'),(14,5,2,5,'2020-03-17 10:43:33'),(15,5,3,15,'2020-03-17 10:43:33'),(16,5,5,2,'2020-03-17 10:43:33'),(17,5,4,3,'2020-03-17 10:43:33'),(21,7,3,18,'2020-03-20 15:12:59'),(28,9,2,2,'2020-03-17 10:46:03'),(29,9,3,15,'2020-03-17 10:46:03'),(30,9,4,5,'2020-03-17 10:46:03'),(31,10,3,20,'2020-03-17 10:46:29'),(32,10,4,7,'2020-03-17 10:46:29'),(33,15,2,15,'2020-03-17 11:00:41'),(34,15,3,20,'2020-03-17 11:00:41'),(35,15,4,2,'2020-03-17 11:00:41'),(36,16,3,13,'2020-03-24 05:21:31'),(37,13,2,10,'2020-03-17 11:03:23'),(38,13,3,15,'2020-03-17 11:03:23'),(39,13,4,10,'2020-03-17 11:03:23'),(40,11,2,9,'2020-03-21 17:36:38'),(41,11,3,13,'2020-03-21 17:36:39'),(42,11,4,4,'2020-03-17 11:03:50'),(46,17,2,2,'2020-03-17 11:04:56'),(47,17,3,15,'2020-03-17 11:04:56'),(48,17,4,3,'2020-03-17 11:04:56'),(49,18,2,5,'2020-03-17 11:05:24'),(50,18,3,20,'2020-03-17 11:05:24'),(51,19,2,7,'2020-03-17 11:05:50'),(52,19,3,15,'2020-03-17 11:05:50'),(53,19,4,3,'2020-03-17 11:05:50'),(54,20,3,13,'2020-03-22 09:25:51'),(55,20,4,5,'2020-03-17 11:06:08'),(56,4,2,10,'2020-03-22 09:32:49'),(58,4,1,5,'2020-03-22 09:32:49'),(63,22,2,2,'2020-03-22 13:24:43'),(64,22,3,15,'2020-03-22 13:24:43'),(65,23,2,5,'2020-03-23 18:17:48'),(66,23,3,20,'2020-03-23 18:17:48'),(67,23,4,10,'2020-03-23 18:17:48'),(68,24,2,5,'2020-03-23 18:18:11'),(69,24,3,30,'2020-03-23 18:18:11'),(70,24,4,12,'2020-03-23 18:18:11'),(71,25,2,5,'2020-03-23 18:18:33'),(72,25,3,12,'2020-03-23 18:18:33'),(73,25,4,6,'2020-03-23 18:18:33'),(74,7,2,2,'2020-03-24 02:07:15'),(76,7,1,5,'2020-03-24 09:47:47');
/*!40000 ALTER TABLE `tb_stock` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tb_transactions`
--

DROP TABLE IF EXISTS `tb_transactions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tb_transactions` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `invoice` varchar(45) NOT NULL DEFAULT 'null',
  `userID` int(11) NOT NULL,
  `cartPrice` int(11) NOT NULL,
  `shippingPrice` int(11) NOT NULL,
  `payment` int(11) NOT NULL,
  `address` varchar(150) DEFAULT NULL,
  `courier` varchar(45) DEFAULT 'JNE REGULAR',
  `note` varchar(150) DEFAULT NULL,
  `time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `status` varchar(45) NOT NULL DEFAULT 'Unpaid',
  `imgpayment` varchar(45) DEFAULT NULL,
  `orderType` varchar(45) DEFAULT 'General',
  PRIMARY KEY (`id`),
  KEY `FK_trans_user_idx` (`userID`),
  CONSTRAINT `FK_trans_user` FOREIGN KEY (`userID`) REFERENCES `tb_users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tb_transactions`
--

LOCK TABLES `tb_transactions` WRITE;
/*!40000 ALTER TABLE `tb_transactions` DISABLE KEYS */;
INSERT INTO `tb_transactions` VALUES (1,'LEAD_EN0Z8E',2,240000,18000,258000,'Pluit Phone (085649963278), Jakarta Utara, DKI Jakarta, 002365, Indonesia ','JNE REGULAR','Cek barang','2020-03-17 12:33:08','Paid','/transfers/TF1584448367516.jpg','General'),(2,'LEAD_17EEZK',4,550000,18000,568000,'Pluit Phone (085639241236), Jakarta Pusat, DKI Jakarta, 000222, Indonesia ','JNE REGULAR','Coba barang','2020-03-18 16:29:49','Unpaid',NULL,'General'),(3,'LEAD_6MQ8ME',4,300000,18000,318000,'Sleman Phone (085639241236), Yogyakarta, DI Yogyakarta, 333666, Indonesia ','JNE REGULAR','Cek barang','2020-03-20 15:34:29','Unpaid',NULL,'General'),(4,'LEAD_1V89Q2',3,170000,8000,178000,'Sampang Phone (081236696696), Sampang, Jawa Timur, 22535, Indonesia ','JNE REGULAR','','2020-03-20 16:01:20','Unpaid',NULL,'Custom'),(5,'LEAD_RDBW5Y',2,7480000,144000,7624000,'Sawahan Phone (085649963278), Batu, Jawa Timur, 8935, Indonesia ','JNE REGULAR','','2020-03-22 03:22:10','Unpaid','/transfers/TF1584847330425.jpg','Custom'),(6,'LEAD_KPG3L5',2,420000,8000,428000,'vv Phone (085649963278), Pacitan, Jawa Timur, 000999, Indonesia ','JNE REGULAR','','2020-03-22 04:07:48','Paid','/transfers/TF1584847313135.jpg','General'),(7,'LEAD_Y7PZUL',6,400000,18000,418000,'Perumahan Pantai Indah Kapuk Phone (0853632214), Jakarta Utara, DKI Jakarta, 655225, Indonesia ','JNE REGULAR','Tolong cek kondisi barang','2020-03-22 09:29:44','Paid','/transfers/TF1584869258842.jpg','General'),(8,'LEAD_IID7LG',6,1650000,54000,1704000,'Cileduk Phone (0853632214), Jakarta Pusat, DKI Jakarta, 666666, Indonesia ','JNE REGULAR','','2020-03-22 09:41:30','Unpaid',NULL,'Custom'),(9,'LEAD_F1BXGU',10,130000,10000,140000,'Kedungpring Phone (085645654565), Lamongan, Jawa Timur, 62272, Indonesia ','JNE REGULAR','Tolong dicek kondisinya','2020-03-24 05:21:30','Unpaid',NULL,'General'),(10,'LEAD_P12NXK',21,600000,18000,618000,'Pluit Phone (085696321364), Jakarta Utara, DKI Jakarta, 366985, Indonesia ','JNE REGULAR','Tolong cek barang','2020-03-24 09:38:46','Paid','/transfers/TF1585042680436.jpg','General'),(11,'LEAD_P5XJXH',21,2125000,35000,2160000,'Surabaya Phone (085696321364), Surabaya, Jawa Timur, 123456, Indonesia ','JNE REGULAR','','2020-03-24 09:42:22','Unpaid',NULL,'Custom');
/*!40000 ALTER TABLE `tb_transactions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tb_useraddress`
--

DROP TABLE IF EXISTS `tb_useraddress`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tb_useraddress` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `userID` varchar(45) NOT NULL,
  `address` varchar(200) NOT NULL,
  `subdistrict` varchar(45) NOT NULL,
  `city` varchar(45) NOT NULL,
  `region` varchar(45) NOT NULL,
  `country` varchar(45) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tb_useraddress`
--

LOCK TABLES `tb_useraddress` WRITE;
/*!40000 ALTER TABLE `tb_useraddress` DISABLE KEYS */;
/*!40000 ALTER TABLE `tb_useraddress` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tb_users`
--

DROP TABLE IF EXISTS `tb_users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tb_users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `username` varchar(45) NOT NULL,
  `email` varchar(45) NOT NULL,
  `phone` varchar(45) NOT NULL,
  `password` varchar(120) NOT NULL,
  `role` varchar(45) NOT NULL DEFAULT 'user',
  `status` varchar(45) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=22 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tb_users`
--

LOCK TABLES `tb_users` WRITE;
/*!40000 ALTER TABLE `tb_users` DISABLE KEYS */;
INSERT INTO `tb_users` VALUES (1,'Admin','abdialghi@gmail.com','085894676306','f8ed19aa10b715aea2b3c8d298f791794059f44461faab3e26bc6f1ae4ac6672','admin','Verified'),(2,'Dede','alghifarfn@gmail.com','085649963278','70f1eb493da68571cb88985c3cbbefcdc0cc763b806b5eb4ad4db6ed8edc64ba','user','Verified'),(3,'Jojo','alghifarfn@gmail.com','081236696696','70f1eb493da68571cb88985c3cbbefcdc0cc763b806b5eb4ad4db6ed8edc64ba','user','Verified'),(4,'Carel','alghifarfn@gmail.com','085639241236','d8bd5c32a32b58ea24fa64a71c261c018fe6e344dfe942ba90cf97f6191bf2f7','user','Verified'),(5,'Budi','alghifarfn@gmail.com','085642365899','d8bd5c32a32b58ea24fa64a71c261c018fe6e344dfe942ba90cf97f6191bf2f7','user','Verified'),(6,'Cacarica','alghifarfn@gmail.com','0853632214','f8ed19aa10b715aea2b3c8d298f791794059f44461faab3e26bc6f1ae4ac6672','user','Verified'),(7,'Danu','alghifarfn@gmail.com','085236636987','d8bd5c32a32b58ea24fa64a71c261c018fe6e344dfe942ba90cf97f6191bf2f7','user','Verified'),(8,'Dani','alghifarfn@gmail.com','098654236985','d8bd5c32a32b58ea24fa64a71c261c018fe6e344dfe942ba90cf97f6191bf2f7','user','Verified'),(10,'Azza','alghifarfn@gmail.com','085645654565','70f1eb493da68571cb88985c3cbbefcdc0cc763b806b5eb4ad4db6ed8edc64ba','user','Verified'),(11,'Kiki','alghifarfn@gmail.com','085236985236','d8bd5c32a32b58ea24fa64a71c261c018fe6e344dfe942ba90cf97f6191bf2f7','user','Verified'),(12,'Janur','alghifarfn@gmail.com','085645654565','d8bd5c32a32b58ea24fa64a71c261c018fe6e344dfe942ba90cf97f6191bf2f7','user','Verified'),(13,'Irfan','alghifarfn@gmail.com','085632145252','70f1eb493da68571cb88985c3cbbefcdc0cc763b806b5eb4ad4db6ed8edc64ba','user','Verified'),(14,'Hakim','alghifarfn@gmail.com','088996655223','70f1eb493da68571cb88985c3cbbefcdc0cc763b806b5eb4ad4db6ed8edc64ba','user','Verified'),(15,'Gitta','alghifarfn@gmail.com','085666999663','70f1eb493da68571cb88985c3cbbefcdc0cc763b806b5eb4ad4db6ed8edc64ba','user','Verified'),(16,'Hadi','alghifarfn@gmail.com','085666999369','70f1eb493da68571cb88985c3cbbefcdc0cc763b806b5eb4ad4db6ed8edc64ba','user','Verified'),(17,'Rizal','alghifarfn@gmail.com','085555666332','70f1eb493da68571cb88985c3cbbefcdc0cc763b806b5eb4ad4db6ed8edc64ba','user','Verified'),(18,'Adi','alghifarfn@gmail.com','085666996636','70f1eb493da68571cb88985c3cbbefcdc0cc763b806b5eb4ad4db6ed8edc64ba','user','Verified'),(19,'Zaki','alghifarfn@gmail.com','085666999897','70f1eb493da68571cb88985c3cbbefcdc0cc763b806b5eb4ad4db6ed8edc64ba','user','Verified'),(20,'Samson','alghifarfn','085666333232','70f1eb493da68571cb88985c3cbbefcdc0cc763b806b5eb4ad4db6ed8edc64ba','user','Verified'),(21,'Bima01','alghifarfn@gmail.com','085696321364','f8ed19aa10b715aea2b3c8d298f791794059f44461faab3e26bc6f1ae4ac6672','user','Verified');
/*!40000 ALTER TABLE `tb_users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2020-05-28 12:34:54
