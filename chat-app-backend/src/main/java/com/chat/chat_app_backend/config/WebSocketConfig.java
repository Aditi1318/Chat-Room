package com.chat.chat_app_backend.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;

@Configuration
@EnableWebSocketMessageBroker
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {

    @Override
    public void configureMessageBroker(MessageBrokerRegistry config) {
        config.enableSimpleBroker("/topic");
        config.setApplicationDestinationPrefixes("/app");
    }

    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        // Updated this line to include your Vercel URL
        registry.addEndpoint("/chat")
                .setAllowedOrigins(
                        "https://chat-room-eight-amber.vercel.app", // <-- IMPORTANT: Replace with your Vercel URL
                        "http://localhost:5173" // For local development (assuming Vite)
                )
                .withSockJS();
    }
}