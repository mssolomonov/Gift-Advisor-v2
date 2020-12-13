package com.controller;

import com.entity.Gifts;
import com.entity.Popularity;
import com.entity.Tags;
import com.entity.User;
import com.google.gson.Gson;
import com.service.GiftsService;
import com.service.PopularityService;
import com.service.TagsService;
import com.service.UsersService;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;
import org.springframework.test.web.servlet.result.MockMvcResultMatchers;

import java.util.*;

import static org.junit.Assert.assertEquals;

@RunWith(SpringRunner.class)
@WebMvcTest(controllers = GiftController.class)
public class TagControllerIT {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private GiftsService giftsService;

    @MockBean
    private UsersService usersService;

    @MockBean
    private PopularityService popularityService;

    @MockBean
    private TagsService tagsService;

    @Test
    public void setTags() throws Exception {
        /*Set<Tags> tags = new HashSet<>();
        tags.add(new Tags("tag1"));
        tags.add(new Tags("tag2"));
        User user = new User(1L, "username", "password");
        Gifts gifts = new Gifts("test", "test", user, "image", tags, 1000d, new Popularity());
        Gson g = new Gson();
        String json = g.toJson(gifts);

        Mockito.doNothing().when(giftsService).createGifts(gifts);
        Mockito.doReturn(user).when(usersService).findByName("username");
        System.out.println(json);
        MvcResult mvcResult = mockMvc.perform(MockMvcRequestBuilders.post("/gift/add")
                .accept(MediaType.APPLICATION_JSON_VALUE).contentType(MediaType.APPLICATION_JSON_VALUE)
                .content(json))
                .andExpect(MockMvcResultMatchers.status().isOk())
                .andReturn();

        String content = mvcResult.getResponse().getContentAsString();
        Gifts gifts1 = g.fromJson(content, Gifts.class);
        assertEquals(gifts1.getTags(), tags);*/
    }
}
