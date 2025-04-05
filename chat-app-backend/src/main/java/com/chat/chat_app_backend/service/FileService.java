package com.chat.chat_app_backend.service;

import com.chat.chat_app_backend.Repositories.FileRepository;
import com.chat.chat_app_backend.entities.FileDocument;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Optional;

@Service
public class FileService {

    @Autowired
    private FileRepository fileRepository;

    public FileDocument saveFile(MultipartFile file) throws IOException {
        FileDocument fileDocument = new FileDocument(file.getOriginalFilename(), file.getContentType(), file.getBytes());
        return fileRepository.save(fileDocument);
    }

    public Optional<FileDocument> getFile(String id) {
        return fileRepository.findById(id);
    }
}
