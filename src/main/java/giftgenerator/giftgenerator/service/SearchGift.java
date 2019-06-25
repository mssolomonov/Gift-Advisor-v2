package giftgenerator.giftgenerator.service;

import giftgenerator.giftgenerator.domain.Gift;
import giftgenerator.giftgenerator.repository.GiftRepository;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class SearchGift {

  private final GiftRepository giftRepository;

  public SearchGift(GiftRepository giftRepository) {
    this.giftRepository = giftRepository;
  }

  public List<Gift> searchForGift(String category){
    return giftRepository.findAllById(giftRepository.findGiftByCategory(category));
  }

  public List<Gift> searchForGift(List<String> category){
    List<Gift> gifts = new ArrayList<>();
    for (String str: category){
      gifts.addAll(giftRepository.findAllById(giftRepository.findGiftByCategory(str)));
    }
    return gifts;
  }
}
