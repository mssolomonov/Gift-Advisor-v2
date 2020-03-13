package com.controller;

import com.entity.Gifts;
import com.entity.Popularity;
import com.google.gson.Gson;
import com.service.GiftsService;
import com.service.PopularityService;
import com.service.TagsService;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;
import org.springframework.test.web.servlet.result.MockMvcResultMatchers;

import java.util.Collections;

import static org.junit.Assert.*;

@RunWith(SpringRunner.class)
@WebMvcTest(controllers = PopularityController.class)
public class PopularityControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private PopularityService popularityService;

    @MockBean
    private GiftsService giftsService;

    @Test
    public void saveCount() throws Exception {
        Gifts gifts = new Gifts();
        gifts.setId(1L);
        Mockito.doReturn(gifts).when(giftsService).findById(1L);
        Mockito.doReturn(null).when(popularityService).findByGiftId(gifts);
        Popularity popularity = new Popularity(gifts, 1L);
        Mockito.doNothing().when(popularityService).save(popularity);
        MvcResult mvcResult = mockMvc.perform(MockMvcRequestBuilders.post("/popularity/{giftId}", 1L))
                .andExpect(MockMvcResultMatchers.status().isOk())
                .andReturn();
        String content = mvcResult.getResponse().getContentAsString();
        Gson gson = new Gson();
        Popularity popularity1 = gson.fromJson(content, Popularity.class);
        assertEquals(popularity, popularity1);

        Mockito.doReturn(popularity).when(popularityService).findByGiftId(gifts);
        popularity.setCount(2L);
        mvcResult = mockMvc.perform(MockMvcRequestBuilders.post("/popularity/{giftId}", 1L))
                .andExpect(MockMvcResultMatchers.status().isOk())
                .andReturn();
        content = mvcResult.getResponse().getContentAsString();
        popularity1 = gson.fromJson(content, Popularity.class);
        assertEquals(popularity.getCount(), popularity1.getCount());

        Mockito.doReturn(gifts).when(giftsService).findById(0L);
        Mockito.doReturn(null).when(popularityService).findByGiftId(gifts);
        mvcResult = mockMvc.perform(MockMvcRequestBuilders.post("/popularity/{giftId}", 0L))
                .andExpect(MockMvcResultMatchers.status().isOk())
                .andReturn();
        content = mvcResult.getResponse().getContentAsString();
        assertTrue(content.contains("New Gift"));
    }

    @Test
    public void getCount() throws Exception {
        Gifts gifts = new Gifts();
        gifts.setId(1L);
        Mockito.doReturn(gifts).when(giftsService).findById(1L);
        Popularity popularity = new Popularity(gifts, 1L);
        Mockito.doReturn(popularity).when(popularityService).findByGiftId(gifts);
        MvcResult mvcResult = mockMvc.perform(MockMvcRequestBuilders.get("/popularity").param("giftId", "1"))
                .andExpect(MockMvcResultMatchers.status().isOk())
                .andReturn();
        String content = mvcResult.getResponse().getContentAsString();
        Gson gson = new Gson();
        Popularity popularity1 = gson.fromJson(content, Popularity.class);
        assertEquals(popularity, popularity1);
    }
}