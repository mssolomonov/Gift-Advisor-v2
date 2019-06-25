package giftgenerator.giftgenerator.controller;
import giftgenerator.giftgenerator.service.AddGiftAndCategory;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class AddGiftAndCategoryController {
  private final AddGiftAndCategory addGiftAndCategory;

  public AddGiftAndCategoryController(giftgenerator.giftgenerator.service.AddGiftAndCategory addGiftAndCategory) {
    this.addGiftAndCategory = addGiftAndCategory;
  }

  @PostMapping("/adding")
  public void addGiftAndCategory(String giftName, String categoryName){
    addGiftAndCategory.addGiftAndCategory(giftName, categoryName);
  }
}
