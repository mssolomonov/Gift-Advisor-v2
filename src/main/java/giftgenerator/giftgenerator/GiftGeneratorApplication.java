package giftgenerator.giftgenerator;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.EnableAspectJAutoProxy;

@SpringBootApplication
@EnableAspectJAutoProxy
public class GiftGeneratorApplication {

  public static void main(String[] args) {
    SpringApplication.run(GiftGeneratorApplication.class, args);
  }

}
