package giftgenerator.giftgenerator.domain;


import javax.persistence.*;
import java.util.ArrayList;
import java.util.List;

@Entity
public class Gift {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  @Column
  private Integer id;

  @Column(name = "name")
  private String name;

  @ManyToMany
  @JoinTable(
    name = "gift_category",
    joinColumns = @JoinColumn(name = "gift_id"),
    inverseJoinColumns = @JoinColumn(name = "category_id"))
  private List<Category> categories = new ArrayList<>();

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

  public List<Category> getCategories() {
    return categories;
  }

  public void setCategories(List<Category> categories) {
    this.categories = categories;
  }
}
