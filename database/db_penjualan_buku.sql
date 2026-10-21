-- MySQL dump 10.13  Distrib 8.0.46, for Linux (x86_64)
--
-- Host: localhost    Database: db_penjualan_buku
-- ------------------------------------------------------
-- Server version	8.0.46

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `authors`
--

DROP TABLE IF EXISTS `authors`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `authors` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `photo` varchar(255) DEFAULT NULL,
  `bio` text,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `authors`
--

LOCK TABLES `authors` WRITE;
/*!40000 ALTER TABLE `authors` DISABLE KEYS */;
INSERT INTO `authors` VALUES (1,'J.K. Rowling','jk_rowling.jpg','British author, best known for the Harry Potter  series.'),(2,'George R.R. Martin','george_rr_martin.jpg','American novelist and short story  writer, known for A Song of Ice and Fire.'),(3,'Isaac Asimov','isaac_asimov.jpg','American author and professor of biochemistry,  known for his works in science fiction.'),(4,'Andrea Hirata','andrea_hirata.jpg','Penulis novel terkemuka asal Belitung, pencipta mahakarya Laskar Pelangi.'),(5,'Tere Liye','tere_liye.jpg','Prolific Indonesian author with various best-sellers.'),(6,'Pramoedya Ananta Toer','pramoedya.jpg','Leading Indonesian novelist and political activist.'),(7,'Dee Lestari','dee_lestari.jpg','Indonesian author and singer-songwriter, writer of Supernova.'),(8,'James Clear','james_clear.jpg','American author focusing on habits and decision making.');
/*!40000 ALTER TABLE `authors` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `books`
--

DROP TABLE IF EXISTS `books`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `books` (
  `id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL,
  `description` text,
  `price` decimal(10,2) NOT NULL,
  `stock` int NOT NULL,
  `cover_photo` varchar(255) DEFAULT NULL,
  `genre_id` int NOT NULL,
  `author_id` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `genre_id` (`genre_id`),
  KEY `author_id` (`author_id`),
  CONSTRAINT `books_ibfk_1` FOREIGN KEY (`genre_id`) REFERENCES `genres` (`id`),
  CONSTRAINT `books_ibfk_2` FOREIGN KEY (`author_id`) REFERENCES `authors` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `books`
--

LOCK TABLES `books` WRITE;
/*!40000 ALTER TABLE `books` DISABLE KEYS */;
INSERT INTO `books` VALUES (1,'Harry Potter and the Sorcerers Stone','The first book in the Harry Potter series.',25000.00,37,'harry_potter.jpg',1,1),(2,'The Lord of the Rings','A classic fantasy novel by J.R.R. Tolkien.',60000.00,30,'the_lord_of_the_rings.jpg',1,2),(3,'1984','A dystopian novel by George Orwell.',40000.00,40,'1984.jpg',2,3),(4,'The Hitchhikers Guide to the Galaxy','A comedy science fiction novel by Douglas  Adams.',30000.00,20,'the_hitchhikers_guide_to_the_galaxy.jpg',3,3),(5,'The Hobbit','A fantasy novel by J.R.R. Tolkien.',50000.00,8,'the_hobbit.jpg',1,2),(6,'Bumi','First book of the earth series adventures.',95000.00,15,'bumi.jpg',5,5),(7,'Laskar Pelangi','Story of inspiring school children in Belitung.',75000.00,20,'laskar_pelangi.jpg',1,4),(8,'Bumi Manusia','Epic historical fiction during colonial era.',90000.00,15,'bumi_manusia.jpg',8,6),(9,'Supernova: Ksatria, Puteri, dan Bintang Jatuh','Acclaimed sci-fi romance novel.',65000.00,18,'supernova.jpg',3,7);
/*!40000 ALTER TABLE `books` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `genres`
--

DROP TABLE IF EXISTS `genres`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `genres` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `description` text,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `genres`
--

LOCK TABLES `genres` WRITE;
/*!40000 ALTER TABLE `genres` DISABLE KEYS */;
INSERT INTO `genres` VALUES (1,'Fiction','A literary work based on the imagination and not necessarily on fact.'),(2,'Non-Fiction','A literary work based on facts and real events.'),(3,'Science Fiction','A genre that deals with imaginative and futuristic concepts.'),(5,'Fantasy','Genre sastra yang menyajikan dunia imajinatif, sihir, dan petualangan magis.'),(6,'Mystery','Plot driven by suspense, crime, and puzzle-solving.'),(7,'Biography','Detailed description of a real persons life.'),(8,'History','Accounts and studies of past events.');
/*!40000 ALTER TABLE `genres` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `transactions`
--

DROP TABLE IF EXISTS `transactions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `transactions` (
  `id` int NOT NULL AUTO_INCREMENT,
  `order_number` varchar(255) NOT NULL,
  `customer_id` int NOT NULL,
  `book_id` int NOT NULL,
  `total_amount` decimal(10,2) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `order_number` (`order_number`),
  KEY `customer_id` (`customer_id`),
  KEY `book_id` (`book_id`),
  CONSTRAINT `transactions_ibfk_1` FOREIGN KEY (`customer_id`) REFERENCES `users` (`id`),
  CONSTRAINT `transactions_ibfk_2` FOREIGN KEY (`book_id`) REFERENCES `books` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `transactions`
--

LOCK TABLES `transactions` WRITE;
/*!40000 ALTER TABLE `transactions` DISABLE KEYS */;
INSERT INTO `transactions` VALUES (1,'ORD-0001',1,1,50000.00),(2,'ORD-0002',2,2,60000.00),(3,'ORD-0003',1,3,40000.00),(4,'ORD-0004',3,4,30000.00),(5,'ORD-0005',2,5,50000.00),(6,'ORD-0006',4,7,75000.00),(7,'ORD-0007',5,6,95000.00),(8,'ORD-0008',6,8,90000.00),(9,'ORD-0009',7,9,65000.00);
/*!40000 ALTER TABLE `transactions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` enum('customer','admin') NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'Fahirul','Fahirul@example.com','Admin123','admin'),(2,'Alice','elis@example.com','alice324','customer'),(3,'Bob Smith','bob@example.com','Bob901','customer'),(4,'Citra Lestari','citra.lestari_baru@example.com','citra123','customer'),(5,'David Kurnia','david@example.com','david456','customer'),(6,'Eka Pratama','eka@example.com','eka789','customer'),(7,'Farhan Ali','farhan@example.com','farhan321','customer'),(8,'Gita Savitri','gita@example.com','gita654','customer');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-10-19  4:11:55
