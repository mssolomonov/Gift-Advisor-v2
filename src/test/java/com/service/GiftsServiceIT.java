package com.service;

import com.entity.Gifts;
import com.entity.Popularity;
import com.entity.User;
import com.repository.GiftsRepository;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit4.SpringRunner;

import java.util.*;

import static org.junit.Assert.*;

@RunWith(SpringRunner.class)
@SpringBootTest
public class GiftsServiceIT {

    private GiftsService giftsService;

    @Mock
    private GiftsRepository giftsRepository;

    @Before
    public void init() {
        giftsService = new GiftsService(giftsRepository);
    }

    @Test
    public void userCreateGift() {
        User user = new User(1L, "test", "password");
        Gifts gift = new Gifts("test", "test gift", user, "image", Collections.emptySet(), 100d, new Popularity());

        List<Gifts> giftsList = Collections.singletonList(gift);
        Mockito.doReturn(giftsList).when(giftsRepository).findAllByUsername("test");
        List<Gifts> all = giftsService.findAllByUsername("test");
        Mockito.verify(giftsRepository, Mockito.times(1)).findAllByUsername("test");

        assertEquals(all.get(0).getId_user(), user);
    }
}
