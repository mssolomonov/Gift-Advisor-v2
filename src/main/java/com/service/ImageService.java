package com.service;

import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.InputStream;
import java.io.OutputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.Objects;

@Service
public class ImageService {

    public void store(MultipartFile file, String id) {
        try {
            String path = "src"+ File.separator + "main" + File.separator+ "resources" + File.separator+ "static"
                    + File.separator+id.trim();
            Path filepath = Paths.get(path);
             Files.deleteIfExists(filepath);
             Files.createFile(filepath);
                OutputStream outputStream = Files.newOutputStream(filepath);
                outputStream.write(file.getBytes());
            path = "build"+File.separator+ "resources" +  File.separator + "main" + File.separator+ "static"
                    + File.separator+id.trim();
            filepath = Paths.get(path);
            Files.deleteIfExists(filepath);
            Files.createFile(filepath);
            outputStream = Files.newOutputStream(filepath);
            outputStream.write(file.getBytes());
        } catch (Exception e) {
            throw new RuntimeException("FAIL!");
        }
    }


}
