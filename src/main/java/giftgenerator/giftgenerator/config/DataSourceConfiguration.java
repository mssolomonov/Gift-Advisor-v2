package giftgenerator.giftgenerator.config;

import org.springframework.boot.jdbc.DataSourceBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import javax.sql.DataSource;

@Configuration
public class DataSourceConfiguration {

  @Bean
  public DataSource getDataSource() {
    DataSourceBuilder dataSourceBuilder = DataSourceBuilder.create();
    dataSourceBuilder.driverClassName("org.postgresql.Driver");
    dataSourceBuilder.url("jdbc:postgresql://127.0.0.1:5432/giftgenerator");
    dataSourceBuilder.username("anastasia");
    dataSourceBuilder.password("1234");
    return dataSourceBuilder.build();
  }

}
