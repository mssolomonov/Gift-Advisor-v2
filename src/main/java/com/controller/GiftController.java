package com.controller;

import com.entity.Gifts;
import com.entity.Popularity;
import com.entity.Tags;
import com.entity.User;
import com.service.GiftsService;
import com.service.PopularityService;
import com.service.UsersService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.*;
import java.util.stream.Collectors;

@RestController
public class GiftController {
    @Autowired
    private GiftsService giftsService;

    @Autowired
    private UsersService userService;

    @Autowired
    private PopularityService popularityService;

    @Transactional
    @CrossOrigin(origins = "*")
    @RequestMapping(
            value={"/gift/add", "/gift/update"}, method = {RequestMethod.POST,
                                                                    RequestMethod.PUT})
    public ResponseEntity<?> addGift(@RequestBody Gifts gift) {
        User user = gift.getId_user();
        User user1 = userService.findByName(user.getUsername());
        user.setId(user1.getId());
        user.setPassword(user1.getPassword());
        user.setGifts(user1.getGifts());
        gift.setId_user(user);
        giftsService.createGifts(gift);
        return ResponseEntity.ok(gift);
    }

    @Transactional
    @CrossOrigin(origins = "*")
    @RequestMapping(value="/gifts/{username}", method = RequestMethod.GET)
    public List<Gifts> giftByUsername(@PathVariable String username) {
        return giftsService.findAll().stream().filter(gifts -> gifts.getId_user().getUsername().trim().equals(username)).collect(Collectors.toList());
    }

    @Transactional
    @CrossOrigin(origins = "*")
    @RequestMapping(value="/gift/{id}", method = RequestMethod.GET)
    public ResponseEntity<?> giftById(@PathVariable Long id) {
        Gifts gifts = giftsService.findById(id);
        if (gifts == null){
            return new ResponseEntity<>("Not found", HttpStatus.NOT_FOUND);
        }
        return new ResponseEntity<>(gifts, HttpStatus.OK);
    }

    @Transactional
    @CrossOrigin(origins = "*")
    @RequestMapping(value="/gift/{id}", method = RequestMethod.DELETE)
    public ResponseEntity<?> deleteGift(@PathVariable Long id) {
        giftsService.deleteGift(id);
        return new ResponseEntity<>(id, HttpStatus.OK);
    }

    @Transactional
    @CrossOrigin(origins = "*")
    @RequestMapping(value="/gifts", method = RequestMethod.GET)
    public ResponseEntity<?> getAll() {
        return new ResponseEntity<>(giftsService.findAll(), HttpStatus.OK);
    }

    @Transactional
    @CrossOrigin(origins = "*")
    @RequestMapping(value="/gift/search", method = RequestMethod.GET)
    public ResponseEntity<?> getGiftByTags(@RequestParam(value="tags", required = false) String[] tags,
                                           @RequestParam("username") String username,
                                           @RequestParam("from") String from,
                                           @RequestParam("to") String to,
                                           @RequestParam("sort") String sort) {

        Double fr = Double.valueOf(from);
        Double t = Double.valueOf(to);
        List<Gifts> gifts = giftsService.findAll();
        if (!username.equals("")){
            gifts = gifts.stream().filter(gifts1 -> gifts1.getId_user().getUsername().trim().equals(username)).collect(Collectors.toList());
        }
        List<Gifts> concludeGift = new ArrayList<>(Collections.emptyList());
        List<Gifts> giftsList = gifts.stream().filter(gifts1 -> gifts1.getPrice() <= t && gifts1.getPrice() >= fr).collect(Collectors.toList());
        if (tags==null || tags.length==0){
            giftsList = sort(sort, giftsList);
            return new ResponseEntity<>(giftsList, HttpStatus.OK);
        }
        for (Gifts gift: giftsList) {
            List<String> match = gift.getTags().stream().map(tag -> tag.getName().trim()).collect(Collectors.toList());
            if (match.containsAll(Arrays.asList(tags))){
                concludeGift.add(gift);
            }
        }
        concludeGift = sort(sort, concludeGift);
        return new ResponseEntity<>(concludeGift, HttpStatus.OK);
    }

    private List<Gifts> sort (String sortType, List<Gifts> gifts){
        switch (sortType) {
            case "asc": return gifts.stream().sorted((gifts1, t1) -> gifts1.getPrice().compareTo(t1.getPrice()))
                    .collect(Collectors.toList());
            case "desc": return gifts.stream().sorted((gifts1, t1) -> t1.getPrice().compareTo(gifts1.getPrice()))
                    .collect(Collectors.toList());
            case "alpha":return gifts.stream().sorted((gifts1, t1) -> gifts1.getName().compareTo(t1.getName()))
                    .collect(Collectors.toList());
            case "popular": return sortByPopularity(gifts);
            default: return gifts;
        }
    }

    private List<Gifts> sortByPopularity (List<Gifts> gifts){
        return gifts.stream().sorted((gifts1, t1) ->{
            Long firstCount= 0L;
            Long secondCount=0L;
            Popularity popularity = popularityService.findByGiftId(t1);
            if (popularity!=null ){
                firstCount =popularity.getCount();
            }
            popularity = popularityService.findByGiftId(gifts1);
            if (popularity!=null ){
                secondCount = popularity.getCount();
            }
            return firstCount.compareTo(secondCount);
        }).collect(Collectors.toList());
    }
}
