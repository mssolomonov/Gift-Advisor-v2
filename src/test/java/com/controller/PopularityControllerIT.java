package com.controller;

import com.entity.Gifts;
import com.entity.Popularity;
import com.google.gson.Gson;
import com.service.GiftsService;
import com.service.PopularityService;
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

import static org.junit.Assert.*;

@RunWith(SpringRunner.class)
@WebMvcTest(controllers = PopularityController.class)
public class PopularityControllerIT {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private PopularityService popularityService;

    @MockBean
    private GiftsService giftsService;

    @Test
    public void setPopularityByGiftId() throws Exception {
        Gifts gifts = new Gifts();
        gifts.setId(1L);
        Popularity popularity = new Popularity(gifts, 1L);

        Mockito.doReturn(gifts).when(giftsService).findById(1L);
        Mockito.doReturn(null).when(popularityService).findByGiftId(gifts);
        Mockito.doNothing().when(popularityService).save(popularity);
        gifts.setPopularity(popularity);
        MvcResult mvcResult = mockMvc.perform(MockMvcRequestBuilders.post("/popularity/{giftId}", 1L))
                .andExpect(MockMvcResultMatchers.status().isOk())
                .andReturn();
        String content = mvcResult.getResponse().getContentAsString();
        Gson gson = new Gson();
        Popularity popularity1 = gson.fromJson(content, Popularity.class);

        assertEquals(popularity, popularity1);
    }
}
