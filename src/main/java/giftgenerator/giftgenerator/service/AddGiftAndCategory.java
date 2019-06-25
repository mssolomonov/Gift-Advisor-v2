package giftgenerator.giftgenerator.service;

import giftgenerator.giftgenerator.domain.Category;
import giftgenerator.giftgenerator.domain.Gift;
import giftgenerator.giftgenerator.repository.CategoryRepository;
import giftgenerator.giftgenerator.repository.GiftRepository;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.List;
import java.util.Optional;

@Service
public class AddGiftAndCategory {

  private final GiftRepository giftRepository;
  private final CategoryRepository categoryRepository;

  public AddGiftAndCategory(GiftRepository giftRepository, CategoryRepository categoryRepository) {
    this.giftRepository = giftRepository;
    this.categoryRepository = categoryRepository;
  }

  public void addGiftAndCategory(String giftName, String categoryName){
    Optional<Integer> optional= Optional.of(giftRepository.findGiftByName(giftName));
    Optional<Integer> optionalCategory= Optional.of(categoryRepository.findCategoryByName(categoryName));
    Category category1 = null;
    if (optionalCategory.isPresent()){
      Optional<Category> category = categoryRepository.findById(optionalCategory.get());
      category1 = category.get();
    }else {
      category1 = new Category();
      category1.setName(giftName);
      categoryRepository.save(category1);
    }
    if (optional.isPresent()){
      Optional<Gift> gift = giftRepository.findById(optional.get());
      Gift gift1 = gift.get();
      List<Category> categoryList = gift1.getCategories();
      categoryList.add(category1);
      gift1.setCategories(categoryList);
    }else {
      Gift gift = new Gift();
      gift.setName(giftName);
      gift.setCategories(Collections.singletonList(category1));
      giftRepository.save(gift);
    }
  }
}
