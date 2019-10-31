package com.repository;

import com.entity.Gifts;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface GiftsRepository extends JpaRepository<Gifts, Long> {
    List<Gifts> findAllByName(String name);
}
