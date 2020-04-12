package com.service;

import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.test.context.junit4.SpringRunner;

import java.io.File;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

import static org.junit.Assert.assertTrue;

@RunWith(SpringRunner.class)
@SpringBootTest
public class ImageServiceTest {

    @Autowired
    private ImageService imageService;

    @Test(expected = RuntimeException.class)
    public void store() {
        MockMultipartFile file = new MockMultipartFile("file.txt", "filename.txt", "text/plain", "some xml".getBytes());
        imageService.store(file, "file.txt");
        String path = "build"+ File.separator+ "resources" +  File.separator + "main" + File.separator+ "static"
                + File.separator+"file";
        Path filepath = Paths.get(path);
        assertTrue(Files.exists(filepath));

        imageService.store(null, "file");
    }
}