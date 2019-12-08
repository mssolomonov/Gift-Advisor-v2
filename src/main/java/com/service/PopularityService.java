package com.service;

import com.entity.Gifts;
import com.entity.Popularity;
import com.repository.PopularityRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class PopularityService {

    @Autowired
    private final PopularityRepository popularityRepository;

    public PopularityService(PopularityRepository popularityRepository) {
        this.popularityRepository = popularityRepository;
    }

    public void save(Popularity popularity) {
        popularityRepository.save(popularity);
    }

    public Popularity findById(Long id){
        return popularityRepository.findById(id).orElse(null);
    }

    public Popularity findByGiftId(Gifts gift) {
        return popularityRepository.findByGiftId(gift);
    }
}