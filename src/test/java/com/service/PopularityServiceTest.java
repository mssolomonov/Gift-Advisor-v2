package com.service;

import com.entity.Gifts;
import com.entity.Popularity;
import com.entity.User;
import com.repository.PopularityRepository;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.data.domain.Sort;
import org.springframework.test.context.junit4.SpringRunner;

import java.util.*;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNull;

@RunWith(SpringRunner.class)
@SpringBootTest
public class PopularityServiceTest {

    private PopularityService popularityService;

    @Mock
    private PopularityRepository popularityRepository;

    @Before
    public void init (){
        popularityService = new PopularityService(popularityRepository);
    }

    @Test
    public void save() {
        Popularity popularity = new Popularity();
        Mockito.doReturn(popularity).when(popularityRepository).save(popularity);
        popularityService.save(popularity);
        Mockito.verify(popularityRepository, Mockito.times(1)).save(popularity);
    }

    @Test
    public void findById() {
        Popularity popularity = new Popularity();
        Mockito.doReturn(Optional.of(popularity)).when(popularityRepository).findById(1L);
        Popularity popularity1 = popularityService.findById(1L);
        Mockito.verify(popularityRepository, Mockito.times(1)).findById(1L);
        assertEquals(popularity.getId(), popularity1.getId());
        Mockito.doReturn(Optional.empty()).when(popularityRepository).findById(2L);
        popularity1 = popularityService.findById(2L);
        Mockito.verify(popularityRepository, Mockito.times(1)).findById(2L);
        assertNull(popularity1);

    }

    @Test
    public void findByGiftId() {
        Gifts gifts = new Gifts();
        Popularity popularity = new Popularity();
        Mockito.doReturn(popularity).when(popularityRepository).findByGiftId(gifts);
        Popularity popularity1 = popularityService.findByGiftId(gifts);
        Mockito.verify(popularityRepository, Mockito.times(1)).findByGiftId(gifts);
        assertEquals(popularity, popularity1);
    }

}