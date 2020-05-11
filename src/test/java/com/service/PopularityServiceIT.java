package com.service;

import com.entity.Gifts;
import com.entity.Popularity;
import com.repository.PopularityRepository;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit4.SpringRunner;

import static org.junit.Assert.assertEquals;

@RunWith(SpringRunner.class)
@SpringBootTest
public class PopularityServiceIT {

    private PopularityService popularityService;

    @Mock
    private PopularityRepository popularityRepository;

    @Before
    public void init() {
        popularityService = new PopularityService(popularityRepository);
    }

    @Test
    public void getPopularityByGift() {
        Gifts gifts = new Gifts();
        Popularity popularity = new Popularity();
        Mockito.doReturn(popularity).when(popularityRepository).findByGiftId(gifts);
        Popularity popularity1 = popularityService.findByGiftId(gifts);
        Mockito.verify(popularityRepository, Mockito.times(1)).findByGiftId(gifts);
        assertEquals(popularity, popularity1);
    }
}
