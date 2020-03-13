package com.controller;

import com.service.ImageService;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;
import org.springframework.test.web.servlet.result.MockMvcResultMatchers;

import static org.junit.Assert.assertTrue;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@RunWith(SpringRunner.class)
@WebMvcTest(controllers = ImageController.class)
public class ImageControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private ImageService imageService;

    @Test
    public void saveImage() throws Exception {
        MockMultipartFile file = new MockMultipartFile("file", "filename.txt", "text/plain", "some xml".getBytes());
        Mockito.doNothing().when(imageService).store(file, "1");
        MvcResult mvcResult = mockMvc.perform(MockMvcRequestBuilders.multipart("/image")
                .file(file)
                .param("id", "1"))
                .andExpect(status().is(200)).andReturn();
        String content = mvcResult.getResponse().getContentAsString();
        assertTrue(content.contains("You successfully uploaded filename.txt!"));
    }
    @Test(expected = Exception.class)
    public void saveImageFail() throws Exception {
        MvcResult mvcResult = mockMvc.perform(MockMvcRequestBuilders.multipart("/image")
                .file(null)
                .param("id", "1"))
                .andExpect(status().isBadRequest()).andReturn();
        String content = mvcResult.getResponse().getContentAsString();
        assertTrue(content.contains("FAIL to upload filename.txt!"));
    }

    @Test
    public void getImage() throws Exception {
        MvcResult mvcResult = mockMvc.perform(MockMvcRequestBuilders.get("/image/{file}","filename.txt"))
                .andExpect(MockMvcResultMatchers.status().isBadRequest())
                .andReturn();
        String content = mvcResult.getResponse().getContentAsString();
        assertTrue(content.contains("Fail"));
    }
}