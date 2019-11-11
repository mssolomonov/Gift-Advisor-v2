package com.service;

import com.entity.User;
import com.repository.UsersRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UsersService {

    @Autowired
    private final UsersRepository usersRepository;

    public UsersService(UsersRepository usersRepository){
        this.usersRepository = usersRepository;
    }

    public void createUsers(User user) {
        usersRepository.save(user);
    }

    public List<User> findAll(){
        return usersRepository.findAll();
    }

    public User findById(Long userId){
        return usersRepository.findById(userId).orElse(null);
    }

    public User findByName(String name){
        return usersRepository.findByUsername(name);
    }
}