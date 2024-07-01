-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jul 01, 2024 at 06:12 PM
-- Server version: 10.4.28-MariaDB
-- PHP Version: 8.2.4

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `abskrywn1_db`
--

-- --------------------------------------------------------

--
-- Table structure for table `absensis`
--

CREATE TABLE `absensis` (
  `id` bigint(20) NOT NULL,
  `karyawan_id` bigint(20) DEFAULT NULL,
  `status` varchar(50) DEFAULT NULL,
  `keterangan` varchar(100) DEFAULT NULL,
  `date` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `absensis`
--

INSERT INTO `absensis` (`id`, `karyawan_id`, `status`, `keterangan`, `date`) VALUES
(49, 22, 'Hadir', '-', '0000-00-00 00:00:00'),
(51, 18, 'Tidak Hadir', 'TIDAK HADIR MASUK', '0000-00-00 00:00:00'),
(52, 10, 'Hadir', '-', '0000-00-00 00:00:00'),
(53, 10, 'Tidak Hadir', 'IZIN SAKIT', '0000-00-00 00:00:00'),
(54, 23, 'Hadir', '-', '0000-00-00 00:00:00'),
(55, 23, 'Tidak Hadir', 'IZIN SAKIT', '0000-00-00 00:00:00');

-- --------------------------------------------------------

--
-- Table structure for table `karyawans`
--

CREATE TABLE `karyawans` (
  `id` bigint(20) NOT NULL,
  `nama_karyawan` varchar(300) DEFAULT NULL,
  `deskripsi` text DEFAULT NULL,
  `username` varchar(191) DEFAULT NULL,
  `password` longtext DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `karyawans`
--

INSERT INTO `karyawans` (`id`, `nama_karyawan`, `deskripsi`, `username`, `password`) VALUES
(10, 'Ardian Syash Putra', 'TEST', NULL, NULL),
(12, 'RAMADHANI PRASETYO', 'test134', NULL, NULL),
(13, 'SYAIFULFATHOR12', '1234556898700448', NULL, NULL),
(14, 'RAMADHANI PRASETYO', 'adadw', NULL, NULL),
(15, 'TheOramaJuiceV2', 'ASDAD', NULL, NULL),
(16, 'Dhani', 'Univ Pancasila Teknik Informatika', NULL, NULL),
(18, 'amir murtako', 'dosen', NULL, NULL),
(22, 'RAMADHANI PRASETYO2', 'Teknik', 'dani', '$2a$10$b4nloCH78FzVP.MsEkTXee.sUfOn3o.X22h1EIt0pKIP6uA2/jQK2'),
(23, 'RAMADHANI', 'TEKNIK', 'admin', '$2a$10$0mOb89B1dMh5RHzPTPEYceJZpAwqZkANMY6xPe1sO2eQiFJcnVpNq');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `username` varchar(191) DEFAULT NULL,
  `password` longtext DEFAULT NULL,
  `nama` varchar(300) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `username`, `password`, `nama`) VALUES
(16, 'dhani562', '$2a$10$s02UiD3xncEc7UqT4c9Qeu3ba1YZaeMU0x5kruG.008P/CuylbR.i', 'RAMADHANI PRASETYOO'),
(18, 'dhani123', '$2a$10$7BgNfo.EKyLaQw/dcEQc0ufynAZO6TRQljWCTFxIekb3.uPbplwGu', 'Dhani');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `absensis`
--
ALTER TABLE `absensis`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_absensis_karyawan` (`karyawan_id`);

--
-- Indexes for table `karyawans`
--
ALTER TABLE `karyawans`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uni_karyawans_username` (`username`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `uni_users_username` (`username`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `absensis`
--
ALTER TABLE `absensis`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=56;

--
-- AUTO_INCREMENT for table `karyawans`
--
ALTER TABLE `karyawans`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=24;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=19;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `absensis`
--
ALTER TABLE `absensis`
  ADD CONSTRAINT `fk_absensis_karyawan` FOREIGN KEY (`karyawan_id`) REFERENCES `karyawans` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
