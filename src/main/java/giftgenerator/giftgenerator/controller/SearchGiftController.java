package giftgenerator.giftgenerator.controller;

import giftgenerator.giftgenerator.domain.Gift;
import giftgenerator.giftgenerator.service.SearchGift;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.List;

@RestController
public class SearchGiftController {

  private final SearchGift searchGift;

  public SearchGiftController(SearchGift searchGift) {
    this.searchGift = searchGift;
  }

  @GetMapping("/search")
  public List<Gift> searchForGift (List<String> categories){
    List<Gift> gifts;
    if (categories.size()==1){
      gifts = searchGift.searchForGift(categories.get(0));
    }else {
      gifts = searchGift.searchForGift(categories);
    }
    return gifts;
  }
}
