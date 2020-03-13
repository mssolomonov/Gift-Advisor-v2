package com.entity;

import com.fasterxml.jackson.annotation.*;

import javax.persistence.*;
import java.io.Serializable;
import java.util.HashSet;
import java.util.Objects;
import java.util.Set;

@Entity
@Table(name = "gifts")
public class Gifts implements Serializable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column
    private String name;

    @Column
    private String description;

    @ManyToOne
    @JoinColumn(name="id_user")
    private User id_user;

    @Column
    private String image_url;

    @OneToOne(mappedBy = "gifts", cascade = CascadeType.ALL)
    @JsonBackReference
    private Popularity popularity;

    @ManyToMany(fetch=FetchType.EAGER)
    @JoinTable(
            name = "gifts_tags",
            joinColumns = @JoinColumn(name = "id_gift"),
            inverseJoinColumns = @JoinColumn(name = "id_tag"))
    private Set<Tags> tags = new HashSet<>();

    @Column
    private Double price;

    public Gifts() {
    }

    public Gifts(String name, String description, User id_user, String image_url, Set<Tags> tags, Double price, Popularity popularity) {
        this.name = name;
        this.description = description;
        this.id_user = id_user;
        this.image_url = image_url;
        this.tags = tags;
        this.price = price;
        this.popularity = popularity;
    }

    public Double getPrice() {
        return price;
    }

    public void setPrice(Double price) {
        this.price = price;
    }

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

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public User getId_user() {
        return id_user;
    }

    public void setId_user(User id_user) {
        this.id_user = id_user;
    }

    public String getImage_url() {
        return image_url;
    }

    public void setImage_url(String image_url) {
        this.image_url = image_url;
    }

    public Set<Tags> getTags() {
        return tags;
    }

    public void setTags(Set<Tags> tags) {
        this.tags = tags;
    }

    public Popularity getPopularity() {
        return popularity;
    }

    public void setPopularity(Popularity popularity) {
        this.popularity = popularity;
    }

    @Override
    public String toString() {
        return "Gifts{" +
                "id=" + id +
                ", name='" + name + '\'' +
                ", description='" + description + '\'' +
                ", image_url='" + image_url + '\'' +
                ", id_user=" + id_user +
                '}';
    }
    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof Gifts)) return false;
        Gifts gifts = (Gifts) o;
        return Objects.equals(id, gifts.id) &&
                Objects.equals(name, gifts.name) &&
                Objects.equals(description, gifts.description) &&
                Objects.equals(id_user, gifts.id_user) &&
                Objects.equals(image_url, gifts.image_url) &&
                Objects.equals(popularity, gifts.popularity) &&
                Objects.equals(tags, gifts.tags) &&
                Objects.equals(price, gifts.price);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, name, description, id_user, image_url, popularity, tags, price);
    }
}