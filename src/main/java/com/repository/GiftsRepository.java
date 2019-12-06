package com.repository;

import com.entity.Gifts;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface GiftsRepository extends JpaRepository<Gifts, Long> {

    @Query("select gift from Gifts gift where id_user.username=name")
    List<Gifts> findAllByUsername(@Param("name") String name);

}
