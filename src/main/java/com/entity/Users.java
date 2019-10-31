package com.entity;

import javax.persistence.*;

@Entity
@Table(name = "UsersRepository.java")
public class Users {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column
    private String username;

    @Column
    private String hash;

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

    public String getHash() {
        return hash;
    }

    public void setHash(String hash) {
        this.hash = hash;
    }

    @Override
    public String toString() {
        return "UsersRepository.java{" +
                "id=" + id +
                ", username='" + username + '\'' +
                ", hash=" + hash +
                '}';
    }
}