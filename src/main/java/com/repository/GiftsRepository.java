package com.repository;

import com.entity.Gifts;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface GiftsRepository extends JpaRepository<Gifts, Long> {
    List<Gifts> findAllByName(String name);

}
