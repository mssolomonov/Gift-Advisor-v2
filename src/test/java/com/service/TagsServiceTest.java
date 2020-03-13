package com.service;

import com.entity.Tags;
import com.repository.TagsRepository;
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

import static org.junit.Assert.*;

@RunWith(SpringRunner.class)
@SpringBootTest
public class TagsServiceTest {

    private TagsService tagsService;

    @Mock
    private TagsRepository tagsRepository;

    @Before
    public void init (){
        tagsService = new TagsService(tagsRepository);
    }

    @Test
    public void createTags() {
        Tags tags = new Tags();
        Mockito.doReturn(tags).when(tagsRepository).save(tags);
        tagsService.createTags(tags);
        Mockito.verify(tagsRepository, Mockito.times(1)).save(tags);
    }

    @Test
    public void findAll() {
        Tags tags = new Tags("test");
        Tags tags1 = new Tags("name");
        List<Tags> tagsList = Arrays.asList(tags, tags1);
        Mockito.doReturn(tagsList).when(tagsRepository).findAll();
        List<Tags> all = tagsService.findAll();
        Mockito.verify(tagsRepository, Mockito.times(1)).findAll();
        assertEquals(2, all.size());
        assertEquals(tagsList, all);
    }

    @Test
    public void findById() {
        Tags tags = new Tags();
        tags.setId(1L);
        Mockito.doReturn(Optional.of(tags)).when(tagsRepository).findById(1L);
        Tags tag1 = tagsService.findById(1L);
        Mockito.verify(tagsRepository, Mockito.times(1)).findById(1L);
        assertEquals(tags.getId(), tag1.getId());
        Mockito.doReturn(Optional.empty()).when(tagsRepository).findById(2L);
        tag1 = tagsService.findById(2L);
        Mockito.verify(tagsRepository, Mockito.times(1)).findById(2L);
        assertNull(tag1);
    }

    @Test
    public void findAllByName() {
        Tags tags = new Tags("name");
        List<Tags> tagsList = Collections.singletonList(tags);
        Mockito.doReturn(tagsList).when(tagsRepository).findAllByName("name");
        List<Tags> all = tagsService.findAllByName("name");
        Mockito.verify(tagsRepository, Mockito.times(1)).findAllByName("name");
        assertEquals(1, all.size());
        assertEquals(tagsList, all);
    }
}