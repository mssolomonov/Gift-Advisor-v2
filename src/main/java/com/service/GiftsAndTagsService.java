package com.service;

import com.entity.Gifts;
import com.entity.GiftsAndTags;
import com.entity.Tags;
import com.repository.GiftsAndTagsRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class GiftsAndTagsService {

    @Autowired
    private final GiftsAndTagsRepository giftsAndTagsRepository;

    public GiftsAndTagsService(GiftsAndTagsRepository giftsAndTagsRepository){
        this.giftsAndTagsRepository = giftsAndTagsRepository;
    }

    public void createGiftsAndTags(GiftsAndTags giftsAndTags) {
        giftsAndTagsRepository.save(giftsAndTags);
    }

    public List<GiftsAndTags> findAll(){
        return giftsAndTagsRepository.findAll();
    }

    public List<Gifts> findAllById_tag(Long id_tag){
        return giftsAndTagsRepository.findAllById_tag(id_tag);
    }
}