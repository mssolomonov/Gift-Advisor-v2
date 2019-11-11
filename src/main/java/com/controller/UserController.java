package com.controller;

import com.entity.User;
import com.service.UsersService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.Base64;


@RestController
public class UserController {
    @Autowired
    private UsersService userService;

    @Transactional
    @CrossOrigin(origins = "*")
    @RequestMapping(value="/users/reg", method = RequestMethod.POST)
    public ResponseEntity<?> registration(@RequestBody User user) {
        User  user1 = userService.findByName(user.getUsername());
        if (user1 != null){
            return new ResponseEntity<>("\"User already exists\"", HttpStatus.CONFLICT);
        }
        Base64.Encoder encoder = Base64.getEncoder();
        user.setPassword(new String(encoder.encode(user.getPassword().getBytes())));
        userService.createUsers(user);
        return ResponseEntity.ok(user);
    }

    @Transactional
    @CrossOrigin(origins = "*")
    @RequestMapping(value="/user/log", method = RequestMethod.POST)
    public ResponseEntity<?> login(@RequestBody User user) {
        User  user1 = userService.findByName(user.getUsername());
        Base64.Decoder encoder = Base64.getDecoder();
        if (user1 == null){
            return new ResponseEntity<>("\"User doesn't exists\"", HttpStatus.NOT_FOUND);
        }
        String password = user1.getPassword().replaceAll("\\s", "");
        String s = new String(encoder.decode(password));
        if (!s.equals(user.getPassword())){
            return new ResponseEntity<>("\"User doesn't exists\"", HttpStatus.NOT_FOUND);
        }
        return ResponseEntity.ok(user);
    }
}
