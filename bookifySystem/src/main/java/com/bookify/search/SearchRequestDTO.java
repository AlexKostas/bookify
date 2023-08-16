package com.bookify.search;

import java.time.LocalDate;
import java.util.List;

public record SearchRequestDTO(LocalDate startDate, LocalDate endDate, List<Integer> amenitiesIDs, float maxPrice,
                               List<Integer> roomTypesIDs, int tenants) {}
