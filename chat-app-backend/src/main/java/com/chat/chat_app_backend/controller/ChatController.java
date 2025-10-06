package com.chat.chat_app_backend.controller;

import com.chat.chat_app_backend.Repositories.RoomRepository;
import com.chat.chat_app_backend.entities.Message;
import com.chat.chat_app_backend.entities.Room;
import com.chat.chat_app_backend.playload.MessageRequest;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.CrossOrigin;

import java.time.LocalDateTime;

@Controller
@CrossOrigin(origins = {
        "https://chat-room-eight-amber.vercel.app", // Vercel frontend URL
        "http://localhost:5173" // Local dev server
})
public class ChatController {

    private final RoomRepository roomRepository;

    public ChatController(RoomRepository roomRepository) {
        this.roomRepository = roomRepository;
    }

    // Sending and receiving chat messages
    @MessageMapping("/sendMessage/{roomId}") // /app/sendMessage/roomId
    @SendTo("/topic/room/{roomId}") // frontend subscribes to this
    public Message sendMessage(
            @DestinationVariable String roomId,
            MessageRequest request) {
        Room room = roomRepository.findByRoomId(request.getRoomId());

        Message message = new Message();
        message.setContent(request.getContent());
        message.setSender(request.getSender());
        message.setTimeStamp(LocalDateTime.now());

        if (room != null) {
            room.getMessages().add(message);
            roomRepository.save(room);
        } else {
            throw new RuntimeException("Room not found!!");
        }

        return message;
    }

}
