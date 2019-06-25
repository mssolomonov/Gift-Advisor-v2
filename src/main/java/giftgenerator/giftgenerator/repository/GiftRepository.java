package giftgenerator.giftgenerator.repository;

import giftgenerator.giftgenerator.domain.Gift;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface GiftRepository extends JpaRepository<Gift, Integer> {

  @Query(value = "select id from gifts join gift_catogory on gifts.id = gift_category.gift_id " +
    "join categories on categories.id=gift_category.category_id where categories.name=:category", nativeQuery = true)
  List<Integer> findGiftByCategory(@Param(value = "category") String category);

  @Query(value = "select id from Gift where name=:giftName")
  Integer findGiftByName(@Param(value = "giftName") String name);
}
