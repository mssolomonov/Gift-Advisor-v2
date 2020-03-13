package com.service;

import com.entity.Gifts;
import com.entity.Popularity;
import com.entity.User;
import com.repository.GiftsRepository;
import org.junit.Before;
import org.junit.Test;
import org.junit.jupiter.api.BeforeEach;
import org.junit.runner.RunWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.data.domain.Sort;
import org.springframework.test.context.event.annotation.BeforeTestMethod;
import org.springframework.test.context.junit4.SpringRunner;

import java.util.*;

import static org.junit.Assert.*;

@RunWith(SpringRunner.class)
@SpringBootTest
public class GiftsServiceTest {

    private GiftsService giftsService;

    @Mock
    private GiftsRepository giftsRepository;

    @Before
    public void init (){
        giftsService = new GiftsService(giftsRepository);
    }

    @Test
    public void createGifts() {
        User user = new User(1L, "user", "password");
        Gifts gifts = new Gifts("gift", "test gift", user, "image", Collections.emptySet(), 1000d, new Popularity());
        gifts.setId(0L);
        Mockito.doReturn(gifts).when(giftsRepository).save(gifts);
        giftsService.createGifts(gifts);
        Mockito.verify(giftsRepository, Mockito.times(1)).save(gifts);
    }

    @Test
    public void findAll() {
        User user = new User(1L, "user", "password");
        Gifts gift = new Gifts("gift", "test gift", user, "image", Collections.emptySet(), 1000d, new Popularity());
        List<Gifts> gifts= Collections.singletonList(gift);
        Mockito.doReturn(gifts).when(giftsRepository).findAll();
        List<Gifts> giftsList = giftsService.findAll();
        Mockito.verify(giftsRepository, Mockito.times(1)).findAll();
        assertEquals(1, giftsList.size());
        assertEquals(gifts, giftsList);
    }

    @Test
    public void testFindAll() {
        User user = new User(1L, "user", "password");
        Gifts gift = new Gifts("gift", "test gift", user, "image", Collections.emptySet(), 100d, new Popularity());
        Gifts gift1 = new Gifts("gift", "test gift", user, "image", Collections.emptySet(), 1000d, new Popularity());
        List<Gifts> giftsList = Arrays.asList(gift, gift1);
        giftsList.sort(Comparator.comparing(Gifts::getPrice));
        Mockito.doReturn(giftsList).when(giftsRepository).findAll(Sort.by(Sort.Direction.ASC, "price"));
        List<Gifts> gifts = giftsService.findAll(Sort.by(Sort.Direction.ASC, "price"));
        assertEquals(giftsList, gifts);
        assertEquals(gifts.size(), 2);
        Mockito.verify(giftsRepository, Mockito.times(1)).findAll(Sort.by(Sort.Direction.ASC, "price"));
    }

    @Test
    public void findById() {
        Gifts gifts = new Gifts();
        gifts.setId(1L);
        Mockito.doReturn(Optional.of(gifts)).when(giftsRepository).findById(1L);
        Gifts gifts1 = giftsService.findById(1L);
        Mockito.verify(giftsRepository, Mockito.times(1)).findById(1L);
        assertEquals(gifts.getId(), gifts1.getId());
        Mockito.doReturn(Optional.empty()).when(giftsRepository).findById(2L);
        gifts1 = giftsService.findById(2L);
        Mockito.verify(giftsRepository, Mockito.times(1)).findById(2L);
        assertNull(gifts1);

    }

    @Test
    public void findAllByUsername() {
        Gifts gifts = new Gifts();
        gifts.setName("test");
        List<Gifts> giftsList = Collections.singletonList(gifts);
        Mockito.doReturn(giftsList).when(giftsRepository).findAllByUsername("test");
        List<Gifts> all = giftsService.findAllByUsername("test");
        Mockito.verify(giftsRepository, Mockito.times(1)).findAllByUsername("test");
        assertEquals(all, giftsList);
        assertEquals(all.size(), 1);
        Mockito.doReturn(Collections.emptyList()).when(giftsRepository).findAllByUsername("name");
        all = giftsService.findAllByUsername("name");
        Mockito.verify(giftsRepository, Mockito.times(1)).findAllByUsername("name");
        assertEquals(all.size(), 0);
    }

    @Test
    public void deleteGift() {
        Mockito.doNothing().when(giftsRepository).deleteById(1L);
        giftsService.deleteGift(1L);
        Mockito.verify(giftsRepository, Mockito.times(1)).deleteById(1L);
    }
}