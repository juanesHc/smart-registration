package com.project.data_center.service.jwt;

import com.project.data_center.entity.PersonEntity;
import com.project.data_center.entity.enums.MessageCodes;
import com.project.data_center.entity.security.SecurityUser;
import com.project.data_center.exception.LoginException;
import com.project.data_center.repository.PersonRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;


@Service
@RequiredArgsConstructor
public class CustomUserDetailsService implements UserDetailsService {

    private final PersonRepository personRepository;

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        PersonEntity personEntity = personRepository.findByEmail(email)
                .orElseThrow(() -> new LoginException(MessageCodes.INVALID_CREDENTIALS));
        return new SecurityUser(personEntity);
    }
}