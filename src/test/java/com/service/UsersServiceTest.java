package com.service;

import com.entity.User;
import com.repository.UsersRepository;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit4.SpringRunner;

import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNull;

@RunWith(SpringRunner.class)
@SpringBootTest
public class UsersServiceTest {

    private UsersService usersService;

    @Mock
    private UsersRepository usersRepository;

    @Before
    public void init() {
        usersService = new UsersService(usersRepository);
    }

    @Test
    public void createUsers() {
        User user = new User();
        Mockito.doReturn(user).when(usersRepository).save(user);
        usersService.createUsers(user);
        Mockito.verify(usersRepository, Mockito.times(1)).save(user);
    }

    @Test
    public void findAll() {
        User user = new User(0L, "username", "password");
        User user1 = new User(1L, "test", "test");
        List<User> userList = Arrays.asList(user, user1);
        Mockito.doReturn(userList).when(usersRepository).findAll();
        List<User> all = usersService.findAll();
        Mockito.verify(usersRepository, Mockito.times(1)).findAll();
        assertEquals(2, all.size());
        assertEquals(userList, all);
    }

    @Test
    public void findById() {
        User user = new User(1L, "test", "test");
        Mockito.doReturn(Optional.of(user)).when(usersRepository).findById(1L);
        User user1 = usersService.findById(1L);
        Mockito.verify(usersRepository, Mockito.times(1)).findById(1L);
        assertEquals(user.getId(), user1.getId());
        Mockito.doReturn(Optional.empty()).when(usersRepository).findById(2L);
        user1 = usersService.findById(2L);
        Mockito.verify(usersRepository, Mockito.times(1)).findById(2L);
        assertNull(user1);
    }

    @Test
    public void findByName() {
        User user = new User(1L, "test", "test");
        Mockito.doReturn(user).when(usersRepository).findByUsername("test");
        User all = usersService.findByName("test");
        Mockito.verify(usersRepository, Mockito.times(1)).findByUsername("test");
        assertEquals(user, all);
    }
}