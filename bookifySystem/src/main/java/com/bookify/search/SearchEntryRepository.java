package com.bookify.search;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SearchEntryRepository extends JpaRepository<SearchEntry, Long> {
}