package com.repository;

import com.entity.Tags;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TagsRepository extends JpaRepository<Tags, Long> {
    List<Tags> findAllByName(String name);
}
