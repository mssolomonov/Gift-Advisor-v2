package com.controller;

import com.entity.User;
import com.google.gson.Gson;
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

import java.util.Base64;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertTrue;


@RunWith(SpringRunner.class)
@WebMvcTest(controllers = UserController.class)
public class UserControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private UsersService usersService;

    @Test
    public void registration() throws Exception {
        User user = new User(1L, "username", "password");
        Gson g = new Gson();
        String json = g.toJson(user);
        Mockito.doReturn(user).when(usersService).findByName("username");
        MvcResult mvcResult = mockMvc.perform(MockMvcRequestBuilders.post("/users/reg")
                .accept(MediaType.APPLICATION_JSON_VALUE).contentType(MediaType.APPLICATION_JSON_VALUE)
                .content(json))
                .andExpect(MockMvcResultMatchers.status().isBadRequest())
                .andReturn();
        String content = mvcResult.getResponse().getContentAsString();
        assertTrue(content.contains("User already exists"));

        Mockito.doReturn(null).when(usersService).findByName("username");
        Mockito.doNothing().when(usersService).createUsers(user);
        mvcResult = mockMvc.perform(MockMvcRequestBuilders.post("/users/reg")
                .accept(MediaType.APPLICATION_JSON_VALUE).contentType(MediaType.APPLICATION_JSON_VALUE)
                .content(json))
                .andExpect(MockMvcResultMatchers.status().isOk())
                .andReturn();
        content = mvcResult.getResponse().getContentAsString();
        Gson gson = new Gson();
        User user1 = gson.fromJson(content, User.class);
        assertEquals(user.getUsername(), user1.getUsername());
        Base64.Encoder encoder = Base64.getEncoder();
        assertEquals(new String(encoder.encode(user.getPassword().getBytes())),user1.getPassword());
    }

    @Test
    public void login() throws Exception {
        User testUser = new User(1L, "username", "password");
        User user = new User(1L, "username", "password");
        Base64.Encoder encoder = Base64.getEncoder();
        user.setPassword(new String(encoder.encode(user.getPassword().getBytes())));
        User user1 = new User(1L, "username", "password111");
        Gson g = new Gson();
        String json = g.toJson(testUser);
        Mockito.doReturn(null).when(usersService).findByName("username");
        MvcResult mvcResult = mockMvc.perform(MockMvcRequestBuilders.post("/user/log")
                .accept(MediaType.APPLICATION_JSON_VALUE).contentType(MediaType.APPLICATION_JSON_VALUE)
                .content(json))
                .andExpect(MockMvcResultMatchers.status().isNotFound())
                .andReturn();
        String content = mvcResult.getResponse().getContentAsString();
        assertTrue(content.contains("User doesn't exists"));

        json = g.toJson(user1);
        Mockito.doReturn(user).when(usersService).findByName("username");
        mvcResult = mockMvc.perform(MockMvcRequestBuilders.post("/user/log")
                .accept(MediaType.APPLICATION_JSON_VALUE).contentType(MediaType.APPLICATION_JSON_VALUE)
                .content(json))
                .andExpect(MockMvcResultMatchers.status().isNotFound())
                .andReturn();
        content = mvcResult.getResponse().getContentAsString();
        assertTrue(content.contains("User doesn't exists"));

        json = g.toJson(testUser);
        mvcResult = mockMvc.perform(MockMvcRequestBuilders.post("/user/log")
                .accept(MediaType.APPLICATION_JSON_VALUE).contentType(MediaType.APPLICATION_JSON_VALUE)
                .content(json))
                .andExpect(MockMvcResultMatchers.status().isOk())
                .andReturn();
        content = mvcResult.getResponse().getContentAsString();
        Gson gson = new Gson();
        User user2 = gson.fromJson(content, User.class);
        assertEquals(testUser.getUsername(), user2.getUsername());
        assertEquals(testUser.getPassword(), user2.getPassword());
    }
}