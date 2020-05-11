package com.controller;

import com.entity.Gifts;
import com.entity.Popularity;
import com.entity.User;
import com.service.GiftsService;
import com.service.PopularityService;
import com.service.UsersService;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.web.servlet.MockMvc;

import java.util.*;

import static org.junit.Assert.assertEquals;

@RunWith(SpringRunner.class)
@WebMvcTest(controllers = GiftController.class)
public class UserControllerIT {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private GiftsService giftsService;

    @MockBean
    private UsersService usersService;

    @MockBean
    private PopularityService popularityService;

    @Test
    public void getUsersGifts() throws Exception {
        User user = new User(1L, "username", "password");
        Gifts gifts = new Gifts("test", "test", user, "image", Collections.emptySet(), 1000d, new Popularity());
        Set<Gifts> giftsSet = new HashSet<>();
        giftsSet.add(gifts);
        user.setGifts(giftsSet);
        assertEquals(user.getGifts(), giftsSet);
    }
}
