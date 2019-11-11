package com.controller;

import com.entity.Gifts;
import com.entity.User;
import com.service.GiftsService;
import com.service.UsersService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;
import java.util.Set;

@RestController
public class GiftController {
    @Autowired
    private GiftsService giftsService;

    @Autowired
    private UsersService userService;

    @Transactional
    @CrossOrigin(origins = "*")
    @RequestMapping(value="/gift/add", method = RequestMethod.POST)
    public ResponseEntity<?> addGift(@RequestBody Gifts gift) {
        giftsService.createGifts(gift);
        return ResponseEntity.ok(gift);
    }

    @Transactional
    @CrossOrigin(origins = "*")
    @RequestMapping(value="/gifts/{username}", method = RequestMethod.POST)
    public Set<Gifts> giftByUsername(@PathVariable String username) {
        User  user1 = userService.findByName(username);
        if (user1 == null){
            return Collections.emptySet();
        }
       return user1.getGifts();
    }

    @Transactional
    @CrossOrigin(origins = "*")
    @RequestMapping(value="/gifts/{id}", method = RequestMethod.POST)
    public ResponseEntity<?> giftByUsername(@PathVariable Long id) {
        Gifts gifts = giftsService.findById(id);
        if (gifts == null){
            return new ResponseEntity<>("Not found", HttpStatus.NOT_FOUND);
        }
        return new ResponseEntity<>(gifts, HttpStatus.OK);
    }
}
