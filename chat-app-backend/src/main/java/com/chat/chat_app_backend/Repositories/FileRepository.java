package com.chat.chat_app_backend.Repositories;

import com.chat.chat_app_backend.entities.FileDocument;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface FileRepository extends MongoRepository<FileDocument, String> {
}
