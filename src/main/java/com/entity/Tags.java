package com.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;

import javax.persistence.*;
import java.io.Serializable;
import java.util.HashSet;
import java.util.Objects;
import java.util.Set;

@Entity
@Table(name = "tags")
public class Tags implements Serializable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column
    private String name;

    @JsonIgnore
    @ManyToMany(mappedBy = "tags")
    Set<Gifts> gifts = new HashSet<>();

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    @Override
    public String toString() {
        return "Tags{" +
                "id=" + id +
                ", name=" + name +
                '}';
    }

    public Tags(String name) {
        this.name = name;
    }

    public Tags() {
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof Tags)) return false;
        Tags tags = (Tags) o;
        return Objects.equals(id, tags.id) &&
                Objects.equals(name, tags.name) &&
                Objects.equals(gifts, tags.gifts);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, name);
    }
}