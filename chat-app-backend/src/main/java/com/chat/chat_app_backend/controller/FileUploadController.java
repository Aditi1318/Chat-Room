package com.chat.chat_app_backend.controller;

import com.chat.chat_app_backend.entities.FileDocument;
import com.chat.chat_app_backend.service.FileService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.bind.annotation.CrossOrigin;

import java.io.IOException;
import java.util.Optional;
import java.util.HashMap;
import java.util.Map;



@CrossOrigin("http://localhost:5173")
@RestController
@RequestMapping("/api/files")
public class FileUploadController {

    @Autowired
    private FileService fileService;

    @PostMapping("/upload")
    public ResponseEntity<?> uploadFile(
            @RequestParam("file") MultipartFile file,
            @RequestParam("sender") String sender,
            @RequestParam("roomId") String roomId) {
        try {
            FileDocument savedFile = fileService.saveFile(file);

            // Prepare a response containing file details
            Map<String, String> response = new HashMap<>();
            response.put("fileName", savedFile.getFileName());
            response.put("fileId", savedFile.getId());
            response.put("url", "/api/files/" + savedFile.getId());

            return ResponseEntity.ok(response);

        } catch (IOException e) {
            return ResponseEntity.status(500).body("Error uploading file: " + e.getMessage());
        }
    }


    @GetMapping("/{id}")
    public ResponseEntity<byte[]> downloadFile(@PathVariable String id) {
        Optional<FileDocument> fileDocument = fileService.getFile(id);
        if (fileDocument.isPresent()) {
            return ResponseEntity.ok()
                    .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=" + fileDocument.get().getFileName())
                    .contentType(MediaType.parseMediaType(fileDocument.get().getFileType()))
                    .body(fileDocument.get().getData());
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/metadata/{id}")
    public ResponseEntity<?> getFileMetadata(@PathVariable String id) {
        Optional<FileDocument> fileDocument = fileService.getFile(id);
        if (fileDocument.isPresent()) {
            return ResponseEntity.ok(fileDocument.get());
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}
