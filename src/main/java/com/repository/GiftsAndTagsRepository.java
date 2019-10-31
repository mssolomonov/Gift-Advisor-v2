package com.repository;

import com.entity.Gifts;
import com.entity.GiftsAndTags;
import com.entity.Tags;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface GiftsAndTagsRepository extends JpaRepository<GiftsAndTags, Long> {

    List<Gifts> findAllById_tag(Long id_tag);

    //List<Gifts> findAllById_gift(Long id_gift);

    //List<Tags> findAllById_tag(Long id_tag);

    //List<Tags> findAllById_gift(Long id_gift);
}
