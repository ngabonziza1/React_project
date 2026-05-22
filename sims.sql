-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: May 21, 2026 at 07:18 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `sims`
--

-- --------------------------------------------------------

--
-- Table structure for table `spare_part`
--

CREATE TABLE `spare_part` (
  `id` int(11) NOT NULL,
  `Name` varchar(255) NOT NULL,
  `Category` varchar(100) NOT NULL,
  `Quantity` int(11) NOT NULL DEFAULT 0,
  `UnitPrice` decimal(10,2) NOT NULL,
  `TotalPrice` decimal(10,2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `spare_part`
--

INSERT INTO `spare_part` (`id`, `Name`, `Category`, `Quantity`, `UnitPrice`, `TotalPrice`) VALUES
(1, 'jhugy', 'lkjhg', 3379, 45.00, 152055.00),
(2, 'ngan', 'rice', 34, 67.00, 2278.00),
(3, 'phone', 'sumsung', 202, 1000.00, 202000.00);

-- --------------------------------------------------------

--
-- Table structure for table `stock_in`
--

CREATE TABLE `stock_in` (
  `id` int(11) NOT NULL,
  `spare_part_id` int(11) NOT NULL,
  `StockInQuantity` int(11) NOT NULL,
  `StockInDate` date NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `stock_in`
--

INSERT INTO `stock_in` (`id`, `spare_part_id`, `StockInQuantity`, `StockInDate`) VALUES
(1, 1, 34, '2026-05-20');

-- --------------------------------------------------------

--
-- Table structure for table `stock_out`
--

CREATE TABLE `stock_out` (
  `id` int(11) NOT NULL,
  `spare_part_id` int(11) NOT NULL,
  `StockOutQuantity` int(11) NOT NULL,
  `StockOutUnitPrice` decimal(10,2) NOT NULL,
  `StockOutTotalPrice` decimal(10,2) NOT NULL,
  `StockOutDate` date NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `username` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `username`, `password`) VALUES
(1, 'admin', '$2b$10$g/Z6W8LshbK.fV5eR71XvO7Z0pY7xJ3i17yClyjZk7M7.wEeyfMkq'),
(2, 'ngabonzizaaimable@gmaail.com', '$2b$10$sDCfFJf7TDVlYiKPfS8N3uarsZexEIK3CXU9R/wXt8Z/Sic4nsy1u'),
(3, 'ngabo', '$2b$10$P587vI5XNTfDhpbbo/M5ceLQ/wLo/UKMd1U0rDzHdscxtG/iDe7gu'),
(4, 'nzabaho', '$2b$10$J5jovtdr9RAygzN732xVqeG4JRXW7RfQ1ZbMGFX5hfC86HfkLRyAK'),
(5, 'manah', '$2b$10$j2zDG82XEG.r5.CdQKNVOuBFOyXu/qF3102C0aSCo.BIdtFCQnutq'),
(6, 'mable@gmail.com', '$2b$10$IpF2UQOhexeALLh6TwxxKO5F.rB29dL2c4w.yfHRwyPpJPwFe.xRO'),
(7, 'aimable@gmail.com', '$2b$10$IySIDXFPY4MmkL8RMyInweYYv7x4Ioceb5uMk40I5lqr1sfXOQwM2');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `spare_part`
--
ALTER TABLE `spare_part`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `stock_in`
--
ALTER TABLE `stock_in`
  ADD PRIMARY KEY (`id`),
  ADD KEY `spare_part_id` (`spare_part_id`);

--
-- Indexes for table `stock_out`
--
ALTER TABLE `stock_out`
  ADD PRIMARY KEY (`id`),
  ADD KEY `spare_part_id` (`spare_part_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `username` (`username`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `spare_part`
--
ALTER TABLE `spare_part`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `stock_in`
--
ALTER TABLE `stock_in`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `stock_out`
--
ALTER TABLE `stock_out`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `stock_in`
--
ALTER TABLE `stock_in`
  ADD CONSTRAINT `stock_in_ibfk_1` FOREIGN KEY (`spare_part_id`) REFERENCES `spare_part` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `stock_out`
--
ALTER TABLE `stock_out`
  ADD CONSTRAINT `stock_out_ibfk_1` FOREIGN KEY (`spare_part_id`) REFERENCES `spare_part` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
