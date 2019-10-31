package com.entity;

import javax.persistence.*;

@Entity
@Table(name = "GiftsAndTags")
public class GiftsAndTags {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column
    private Long id_gift;

    @Column
    private Long id_tag;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getId_gift() {
        return id_gift;
    }

    public void setId_gift(Long id_gift) {
        this.id_gift = id_gift;
    }

    public Long getId_tag() {
        return id_tag;
    }

    public void setId_tag(Long id_tag) {
        this.id_tag = id_tag;
    }

    @Override
    public String toString() {
        return "UsersRepository.java{" +
                "id=" + id +
                ", id_gift='" + id_gift + '\'' +
                ", id_tag=" + id_tag +
                '}';
    }
}