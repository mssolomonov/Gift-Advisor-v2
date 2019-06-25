package giftgenerator.giftgenerator.domain;

import javax.persistence.*;
import java.util.ArrayList;
import java.util.List;

public class Category {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  @Column
  private Integer id;

  @Column(name = "name")
  private String name;

  @ManyToMany(mappedBy = "categories")
  private List<Gift> gifts = new ArrayList<>();

  public Integer getId() {
    return id;
  }

  public void setId(Integer id) {
    this.id = id;
  }

  public String getName() {
    return name;
  }

  public void setName(String name) {
    this.name = name;
  }

  public List<Gift> getGifts() {
    return this.gifts;
  }

  public void setGifts(List<Gift> gifts) {
    this.gifts = gifts;
  }

}
