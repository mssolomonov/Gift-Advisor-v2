package com.controller;

import com.service.ImageService;
import jdk.internal.loader.Resource;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ClassPathResource;
import org.springframework.core.io.InputStreamResource;
import org.springframework.core.io.ResourceLoader;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.net.URL;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Base64;

@RestController
public class ImageController {

    @Autowired
    ImageService imageService;

    @CrossOrigin(origins = "*")
    @RequestMapping(value="/image", method = RequestMethod.POST)
    public ResponseEntity<?> saveImage(@RequestBody MultipartFile file, @RequestParam("id") String id) {
        String message = "";
        try {
            imageService.store(file, id);
            message = "You successfully uploaded " + file.getOriginalFilename() + "!";
            return ResponseEntity.status(HttpStatus.OK).body(message);
        } catch (Exception e) {
            message = "FAIL to upload " + file.getOriginalFilename() + "!";
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(message);
        }
    }

    @CrossOrigin(origins = "*")
    @RequestMapping(value="/image/{file}", method = RequestMethod.GET)
    public ResponseEntity<?> getImage(@PathVariable String file) throws IOException {
        ClassPathResource imgFile = new ClassPathResource(file);
        if (imgFile.exists()) {
            return ResponseEntity.ok(imgFile.getFile());
        }
       return  ResponseEntity.badRequest().body("Fail");
    }
}
