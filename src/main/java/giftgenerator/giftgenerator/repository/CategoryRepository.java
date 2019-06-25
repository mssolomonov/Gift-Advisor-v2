package giftgenerator.giftgenerator.repository;

import giftgenerator.giftgenerator.domain.Category;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface CategoryRepository extends JpaRepository<Category, Integer> {

  @Query(value = "select id from Category where name=:categoryName")
  Integer findCategoryByName(@Param(value = "categoryName") String name);
}
