package com.project.data_center.controller.person.register;

import com.project.data_center.dto.person.request.RegisterPersonRequestDto;
import com.project.data_center.dto.person.response.RegisterPersonResponseDto;
import com.project.data_center.service.person.register.RegisterPersonService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/register")
public class RegisterPersonController {

    private final RegisterPersonService registerPersonService;

    @PostMapping("/classic")
    public ResponseEntity<RegisterPersonResponseDto> postUser(@RequestBody RegisterPersonRequestDto registerPersonRequestDto){
        return ResponseEntity.ok(registerPersonService.registerPerson(registerPersonRequestDto));
    }

}
