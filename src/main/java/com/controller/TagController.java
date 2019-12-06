package com.controller;

import com.entity.Tags;
import com.service.TagsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
public class TagController {

    @Autowired
    TagsService tagsService;

    @Transactional
    @CrossOrigin(origins = "*")
    @RequestMapping(value="/tags", method = RequestMethod.GET)
    public List<Tags> getAllTags() {
        return tagsService.findAll();
    }
}
