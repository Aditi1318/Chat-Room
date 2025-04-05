package com.chat.chat_app_backend.entities;

import lombok.*;

import java.time.LocalDateTime;

@AllArgsConstructor
//@NoArgsConstructor
@Getter
@Setter

public class Message {
    private String sender;
    private String content;
    private LocalDateTime timeStamp;


    public Message(String sender, String content) {
        this.sender = sender;
        this.content = content;
        this.timeStamp = LocalDateTime.now();
    }

    public Message() {}

    // Getters
    public String getContent() {
        return content;
    }

    public String getSender() {
        return sender;
    }

    public LocalDateTime getTimeStamp() {
        return timeStamp;
    }

    // Setters
    public void setContent(String content) {
        this.content = content;
    }

    public void setSender(String sender) {
        this.sender = sender;
    }

    public void setTimeStamp(LocalDateTime timeStamp) {
        this.timeStamp = timeStamp;
    }


}
