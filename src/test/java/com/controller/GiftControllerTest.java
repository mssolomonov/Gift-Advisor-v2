package com.controller;

import com.entity.Gifts;
import com.entity.Popularity;
import com.entity.Tags;
import com.entity.User;
import com.google.gson.Gson;
import com.service.GiftsService;
import com.service.PopularityService;
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
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;

import java.util.*;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertTrue;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@RunWith(SpringRunner.class)
@WebMvcTest(controllers = GiftController.class)
public class GiftControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private GiftsService giftsService;

    @MockBean
    private UsersService usersService;

    @MockBean
    private PopularityService popularityService;

    @Test
    public void addGift() throws Exception {
        User user = new User(1L, "username", "password");
        Gifts gifts = new Gifts("test", "test", user, "image", Collections.emptySet(), 1000d, new Popularity());
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
    }

    @Test
    public void giftByUsername() throws Exception {
        Gifts gifts = new Gifts();
        User user = new User(1L, "test", "test");
        gifts.setId_user(user);
        Gifts gifts1 = new Gifts();
        gifts1.setId_user(user);
        Mockito.doReturn(Arrays.asList(gifts, gifts1)).when(giftsService).findAll();
        MvcResult result = mockMvc.perform(MockMvcRequestBuilders.get("/gifts/{username}", "test"))
                .andExpect(status().isOk())
                .andReturn();
        String content = result.getResponse().getContentAsString();
        Gson gson = new Gson();
        Gifts[] gifts2 = gson.fromJson(content, Gifts[].class);
        assertEquals(gifts, gifts2[0]);
    }

    @Test
    public void giftById() throws Exception {
        Gifts gifts = new Gifts();
        gifts.setId(1L);
        User user = new User(1L, "test", "test");
        gifts.setId_user(user);
        Mockito.doReturn(gifts).when(giftsService).findById(1L);
        MvcResult result = mockMvc.perform(MockMvcRequestBuilders.get("/gift/{id}", 1L))
                .andExpect(status().isOk())
                .andReturn();
        String content = result.getResponse().getContentAsString();
        Gson gson = new Gson();
        Gifts gifts2 = gson.fromJson(content, Gifts.class);
        assertEquals(gifts, gifts2);
    }

    @Test
    public void giftByIdFailed() throws Exception {
        Mockito.doReturn(null).when(giftsService).findById(2L);
        MvcResult result1 = mockMvc.perform(MockMvcRequestBuilders.get("/gift/{id}", 2L))
                .andExpect(status().isNotFound())
                .andReturn();
        String content1 = result1.getResponse().getContentAsString();
        assertTrue(content1.contains("Not found"));
    }

    @Test
    public void deleteGift() throws Exception {
        Mockito.doNothing().when(giftsService).deleteGift(2L);
        MvcResult result1 = mockMvc.perform(MockMvcRequestBuilders.delete("/gift/{id}", 2L))
                .andExpect(status().isOk()).andReturn();
        assertTrue(result1.getResponse().getContentAsString().equals(String.valueOf(2)));
    }

    @Test
    public void getAll() throws Exception {
        Mockito.doReturn(Collections.emptyList()).when(giftsService).findAll();
        MvcResult result1 = mockMvc.perform(MockMvcRequestBuilders.get("/gifts"))
                .andExpect(status().isOk())
                .andReturn();
        String content = result1.getResponse().getContentAsString();
        Gson gson = new Gson();
        Gifts[] gifts2 = gson.fromJson(content, Gifts[].class);
        assertEquals(0, gifts2.length);
        Gifts gifts = new Gifts();
        User user = new User(1L, "test", "test");
        gifts.setId_user(user);
        Gifts gifts1 = new Gifts();
        gifts1.setId_user(user);
        Mockito.doReturn(Arrays.asList(gifts, gifts1)).when(giftsService).findAll();
        MvcResult result = mockMvc.perform(MockMvcRequestBuilders.get("/gifts"))
                .andExpect(status().isOk())
                .andReturn();
        content = result.getResponse().getContentAsString();
        gifts2 = gson.fromJson(content, Gifts[].class);
        assertEquals(2, gifts2.length);
    }
    //with username
    //without username
    //with tags
    //without tags
    //all sort types

    @Test
    public void getGiftByTagsWithUsername() throws Exception {
        MultiValueMap<String, String> param = new LinkedMultiValueMap<>();
        param.add("tags", null);
        param.add("username", "");
        param.add("from", "1");
        param.add("to", "2");
        param.add("sort", "asc");
        Gifts gifts = new Gifts();
        gifts.setName("a");
        User user = new User(1L, "test", "test");
        gifts.setId_user(user);
        gifts.setPrice(1d);
        Gifts gifts1 = new Gifts();
        gifts1.setId_user(user);
        gifts1.setName("b");
        gifts1.setPrice(2d);
        List<Gifts> gifts3 = Arrays.asList(gifts, gifts1);
        List<Gifts> sortList = Arrays.asList(gifts, gifts1);
        Mockito.doReturn(gifts3).when(giftsService).findAll();
        MvcResult result1 = mockMvc.perform(MockMvcRequestBuilders.get("/gift/search").params(param))
                .andExpect(status().isOk())
                .andReturn();
        String content = result1.getResponse().getContentAsString();
        Gson gson = new Gson();
        Gifts[] gifts2 = gson.fromJson(content, Gifts[].class);
        assertEquals(sortList, Arrays.asList(gifts2));

        param.set("sort", "desc");
        sortList.sort(Comparator.comparing(Gifts::getPrice).reversed());
        result1 = mockMvc.perform(MockMvcRequestBuilders.get("/gift/search").params(param))
                .andExpect(status().isOk())
                .andReturn();
        content = result1.getResponse().getContentAsString();
        gifts2 = gson.fromJson(content, Gifts[].class);
        assertEquals(sortList,  Arrays.asList(gifts2));

        sortList.sort(Comparator.comparing(Gifts::getName));
        param.set("sort", "alpha");
        result1 = mockMvc.perform(MockMvcRequestBuilders.get("/gift/search").params(param))
                .andExpect(status().isOk())
                .andReturn();
        content = result1.getResponse().getContentAsString();
        gifts2 = gson.fromJson(content, Gifts[].class);
        assertEquals(sortList, Arrays.asList(gifts2));

        Popularity popularity = new Popularity(gifts, 1L);
        gifts.setPopularity(popularity);
        Popularity popularity1 = new Popularity(gifts1, 100L);
        gifts1.setPopularity(popularity1);
        gifts1.setPopularity(popularity);
        Mockito.doReturn(popularity).when(popularityService).findByGiftId(gifts);
        Mockito.doReturn(popularity1).when(popularityService).findByGiftId(gifts1);
        List<Gifts> popularitySort = Arrays.asList(gifts1, gifts);
        param.set("sort", "popular");
        result1 = mockMvc.perform(MockMvcRequestBuilders.get("/gift/search").params(param))
                .andExpect(status().isOk())
                .andReturn();
        content = result1.getResponse().getContentAsString();
        gifts2 = gson.fromJson(content, Gifts[].class);
        assertEquals(popularitySort.get(0).getId(),  gifts2[0].getId());
        assertEquals(popularitySort.get(1).getId(),  gifts2[1].getId());

        param.set("sort", "default");
        result1 = mockMvc.perform(MockMvcRequestBuilders.get("/gift/search").params(param))
                .andExpect(status().isOk())
                .andReturn();
        content = result1.getResponse().getContentAsString();
        gifts2 = gson.fromJson(content, Gifts[].class);
        assertEquals(gifts3.get(0).getId(),  gifts2[0].getId());
        assertEquals(gifts3.get(1).getId(),  gifts2[1].getId());

        Set<Tags> tags = new HashSet<>();
        tags.add(new Tags("tag"));
        gifts1.setTags(tags);
        List<Gifts> singletonList = Collections.singletonList(gifts1);
        result1 = mockMvc.perform(MockMvcRequestBuilders.get("/gift/search").param("tags", new String[]{"tag"})
                .param("username", "").param("from", "1").param("to", "2").param("sort", "asc"))
                .andExpect(status().isOk())
                .andReturn();
        content = result1.getResponse().getContentAsString();
        gifts2 = gson.fromJson(content, Gifts[].class);
        assertEquals(singletonList.get(0).getId(), gifts2[0].getId());
    }

    @Test
    public void getGiftByTagsWithoutUsername() throws Exception {
        MultiValueMap<String, String> param = new LinkedMultiValueMap<>();
        param.add("tags", null);
        param.add("username", "test");
        param.add("from", "1");
        param.add("to", "2");
        param.add("sort", "asc");
        Gifts gifts = new Gifts();
        gifts.setName("a");
        User user = new User(1L, "test", "test");
        User user1 = new User(1L, "test1", "test");
        gifts.setId_user(user);
        gifts.setPrice(1d);
        Gifts gifts1 = new Gifts();
        gifts1.setId_user(user1);
        gifts1.setName("b");
        gifts1.setPrice(2d);
        List<Gifts> gifts3 = Arrays.asList(gifts, gifts1);
        List<Gifts> sortList = Arrays.asList(gifts);
        Mockito.doReturn(gifts3).when(giftsService).findAll();
        MvcResult result1 = mockMvc.perform(MockMvcRequestBuilders.get("/gift/search").params(param))
                .andExpect(status().isOk())
                .andReturn();
        String content = result1.getResponse().getContentAsString();
        Gson gson = new Gson();
        Gifts[] gifts2 = gson.fromJson(content, Gifts[].class);
        assertEquals(sortList, Arrays.asList(gifts2));
        assertEquals(1, gifts2.length);

        param.set("username", "");
        param.set("from", "0");
        param.set("to", "1");
        result1 = mockMvc.perform(MockMvcRequestBuilders.get("/gift/search").params(param))
                .andExpect(status().isOk())
                .andReturn();
        content = result1.getResponse().getContentAsString();
        gifts2 = gson.fromJson(content, Gifts[].class);
        assertEquals(1, gifts2.length);
        assertEquals(gifts.getId(), gifts2[0].getId());
    }
}