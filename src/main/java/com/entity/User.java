package com.entity;

import com.fasterxml.jackson.annotation.*;

import javax.persistence.*;
import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "usertable")
//@JsonIdentityInfo(generator = ObjectIdGenerators.PropertyGenerator.class,
//        property = "id")
public class User implements Serializable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column
    private String username;

    @Column(name = "hash")
    private String password;

//    @JsonManagedReference
    @OneToMany(mappedBy = "id_user")
    @JsonIgnore
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

    public User(Long id, String username, String password) {
        this.id = id;
        this.username = username;
        this.password = password;
    }

    public User() {
    }
}