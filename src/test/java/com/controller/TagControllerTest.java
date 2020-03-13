package com.controller;

import com.entity.Tags;
import com.entity.User;
import com.google.gson.Gson;
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

import java.util.Arrays;
import java.util.Collections;
import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertTrue;

@RunWith(SpringRunner.class)
@WebMvcTest(controllers = TagController.class)
public class TagControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private TagsService tagsService;

    @Test
    public void getAllTags() throws Exception {
        Mockito.doReturn(Collections.emptyList()).when(tagsService).findAll();
        MvcResult mvcResult = mockMvc.perform(MockMvcRequestBuilders.get("/tags"))
                .andExpect(MockMvcResultMatchers.status().isOk())
                .andReturn();
        String content = mvcResult.getResponse().getContentAsString();
        Gson gson = new Gson();
        Tags[] user1 = gson.fromJson(content, Tags[].class);
        assertEquals(0, user1.length);

        Mockito.doReturn(Arrays.asList(new Tags("tag1"), new Tags("tag2"))).when(tagsService).findAll();
        mvcResult = mockMvc.perform(MockMvcRequestBuilders.get("/tags"))
                .andExpect(MockMvcResultMatchers.status().isOk())
                .andReturn();
        content = mvcResult.getResponse().getContentAsString();
        user1 = gson.fromJson(content, Tags[].class);
        assertEquals(2, user1.length);
    }
}