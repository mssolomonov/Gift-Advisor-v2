package com.controller;

import com.entity.Gifts;
import com.entity.Popularity;
import com.service.GiftsService;
import com.service.PopularityService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

@Controller
public class PopularityController {

    @Autowired
    private PopularityService popularityService;

    @Autowired
    private GiftsService giftsService;

    @Transactional
    @CrossOrigin(origins = "*")
    @RequestMapping(value = "/popularity/{giftId}", method = {RequestMethod.POST, RequestMethod.PUT})
    public ResponseEntity<?> saveCount(@PathVariable String giftId){
        long id = Long.parseLong(giftId);
        Gifts gift = giftsService.findById(id);
        Popularity popularity = popularityService.findByGiftId(gift);
        if (id!=0) {
            if (popularity == null) {
                popularity = new Popularity(gift, Long.parseLong(String.valueOf(1)));
                popularityService.save(popularity);
            } else {
                Long count = popularity.getCount()+1;
                popularity.setCount(count);
                popularityService.save(popularity);
            }
        } else {
            return  ResponseEntity.ok("New Gift");
        }
        return ResponseEntity.ok(popularity);
    }

    @Transactional
    @CrossOrigin(origins = "*")
    @GetMapping(value = "/popularity")
    public ResponseEntity<?> getCount(@RequestParam String giftId){
        long id = Long.parseLong(giftId);
        Gifts gift = giftsService.findById(id);
        Popularity popularity = popularityService.findByGiftId(gift);
        return ResponseEntity.ok(popularity);
    }
}
