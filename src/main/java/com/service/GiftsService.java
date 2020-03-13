package com.service;

import com.entity.Gifts;
import com.repository.GiftsRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class GiftsService {

    private final GiftsRepository giftsRepository;

    public GiftsService(GiftsRepository giftsRepository){
        this.giftsRepository = giftsRepository;
    }

    //Add contructor to use mocks
    public void createGifts(Gifts gifts) {
        giftsRepository.save(gifts);
    }

    public List<Gifts> findAll(){
        return giftsRepository.findAll();
    }

    public List<Gifts> findAll(Sort sort){
        return giftsRepository.findAll(sort);
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