package com.repository;

import com.entity.Gifts;
import com.entity.Popularity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface PopularityRepository extends JpaRepository<Popularity, Long> {

    @Query("select popularity from Popularity popularity where popularity.gifts=:gift")
    Popularity findByGiftId(@Param("gift") Gifts gift);
}
