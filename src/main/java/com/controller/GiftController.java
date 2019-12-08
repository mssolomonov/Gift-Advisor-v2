package com.controller;

import com.entity.Gifts;
import com.entity.Tags;
import com.entity.User;
import com.service.GiftsService;
import com.service.UsersService;
import org.springframework.beans.factory.annotation.Autowired;
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
    public ResponseEntity<?> getGiftByTags(@RequestParam(value="tags", required = false) String[] tags,  @RequestParam("username") String username) {

        List<Gifts> gifts = giftsService.findAll();
        if (!username.equals("")){
            gifts = gifts.stream().filter(gifts1 -> gifts1.getId_user().getUsername().trim().equals(username)).collect(Collectors.toList());
        }
        List<Gifts> concludeGift = new ArrayList<>(Collections.emptyList());
        if (tags==null || tags.length==0){
            return new ResponseEntity<>(gifts, HttpStatus.OK);
        }
        for (Gifts gift: gifts) {
            List<String> match = gift.getTags().stream().map(tag -> tag.getName().trim()).collect(Collectors.toList());
            if (match.containsAll(Arrays.asList(tags))){
                concludeGift.add(gift);
            }
        }
        return new ResponseEntity<>(concludeGift, HttpStatus.OK);
    }
}
