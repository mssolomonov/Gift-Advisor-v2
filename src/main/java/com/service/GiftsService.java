package com.service;

import com.entity.Gifts;
import com.repository.GiftsRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class GiftsService {

    @Autowired
    private final GiftsRepository giftsRepository;

    public GiftsService(GiftsRepository giftsRepository){
        this.giftsRepository = giftsRepository;
    }

    public void createGifts(Gifts gifts) {
        giftsRepository.save(gifts);
    }

    public List<Gifts> findAll(){
        return giftsRepository.findAll();
    }

    public Gifts findById(Long id){
        return giftsRepository.findById(id).orElse(null);
    }

    public List<Gifts> findAllByUsername(String name){
        return giftsRepository.findAllByUsername(name);
    }

    public void deleteGift(Long id){
        giftsRepository.deleteById(id);
    }

}