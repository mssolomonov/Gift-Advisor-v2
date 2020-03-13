package com.service;

import com.entity.Tags;
import com.repository.TagsRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TagsService {

    private final TagsRepository tagsRepository;

    public TagsService(TagsRepository tagsRepository){
        this.tagsRepository = tagsRepository;
    }

    public void createTags(Tags tags) {
        tagsRepository.save(tags);
    }

    public List<Tags> findAll(){
        return tagsRepository.findAll();
    }

    public Tags findById(Long id){
        return tagsRepository.findById(id).orElse(null);
    }

    public List<Tags> findAllByName(String name){
        return tagsRepository.findAllByName(name);
    }
}