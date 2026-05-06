package com.project.data_center.controller.person.account;

import com.project.data_center.dto.person.request.UpdatePersonDataRequestDto;
import com.project.data_center.dto.person.response.DropPersonDataResponseDto;
import com.project.data_center.dto.person.response.RetrievePersonDataResponseDto;
import com.project.data_center.dto.person.response.UpdatePersonDataResponseDto;
import com.project.data_center.service.person.account.DropAccountService;
import com.project.data_center.service.person.account.EditAccountService;
import com.project.data_center.service.person.account.RetrieveAccountService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/account")
@RequiredArgsConstructor
public class AccountController {

    private final RetrieveAccountService retrieveAccountService;
    private final EditAccountService editAccountService;
    private final DropAccountService dropAccountService;

    @GetMapping("/me")
    public ResponseEntity<RetrievePersonDataResponseDto> getPersonData(Authentication authentication){
        String email = authentication.getName();
        return ResponseEntity.ok(retrieveAccountService.retrievePersonData(email));

    }

    @PatchMapping("/me")
    public ResponseEntity<UpdatePersonDataResponseDto> updatePersonData(
            @Valid @RequestBody UpdatePersonDataRequestDto request,
            Authentication authentication) {

        String email = authentication.getName();
       return ResponseEntity.ok(editAccountService.editPersonData(email, request));

    }

    @DeleteMapping("/delete/me")
    public ResponseEntity<DropPersonDataResponseDto>  deletePersonData(Authentication authentication){
        String email = authentication.getName();
        return ResponseEntity.ok(dropAccountService.dropPersonData(email));
    }



}
