package com.prat.websgrpc.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.prat.websgrpc.pojo.News;

import java.io.File;
import java.util.List;

@Service
public class ItemService {

    private static final Logger logger = LoggerFactory.getLogger(ItemService.class);

    private final ObjectMapper objectMapper;

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    public ItemService(ObjectMapper objectMapper) {
        this.objectMapper = objectMapper;
    }

    /**
     * Fetches items from a JSON file and returns them as a list of News objects.
     *
     * @return List of News objects
     */
    private List<News> getItems() {
        try {
            return objectMapper.readValue(new File("src/main/resources/news.json"), new TypeReference<List<News>>() {});
        } catch (Exception e) {
            logger.error("Error while fetching items", e);
            return null;
        }
    }

    /**
     * Sends items to all connected WebSocket clients at a fixed rate of 60 seconds (1 min).
     *
     */
    @Scheduled(fixedRate = 60000)
    public void sendItems() {
        List<News> items = getItems();
        messagingTemplate.convertAndSend("/topic/news", items);
        logger.info("Sent items: {}", items);
    }
}