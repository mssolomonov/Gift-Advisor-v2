package com.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import javax.persistence.*;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "usertable")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column
    private String username;

    @Column(name = "hash")
    private String password;

    @OneToMany(mappedBy = "id_user", cascade = CascadeType.ALL)
    private Set<Gifts> gifts = new HashSet<>();

    public Set<Gifts> getGifts() {
        return gifts;
    }

    public void setGifts(Set<Gifts> gifts) {
        this.gifts = gifts;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    @Override
    public String toString() {
        return "UsersRepository.java{" +
                "id=" + id +
                ", username='" + username + '\'' +
                ", hash=" + password +
                '}';
    }
}