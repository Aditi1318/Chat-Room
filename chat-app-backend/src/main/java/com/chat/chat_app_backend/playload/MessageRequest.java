package com.chat.chat_app_backend.playload;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;


@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor

public class MessageRequest {

    private String content;
    private String sender;
    private String roomId;



    // Getters
    public String getRoomId() {
        return roomId;
    }

    public String getContent() {
        return content;
    }

    public String getSender() {
        return sender;
    }

    // Setters
    public void setRoomId(String roomId) {
        this.roomId = roomId;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public void setSender(String sender) {
        this.sender = sender;
    }


}
