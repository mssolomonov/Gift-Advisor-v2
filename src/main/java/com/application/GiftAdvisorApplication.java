package com.application;

import com.service.UsersService;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;

@SpringBootApplication
public class GiftAdvisorApplication {

	private UsersService usersService;

	public static void main(String[] args) {
		SpringApplication.run(GiftAdvisorApplication.class, args);
	}

	@EventListener(ApplicationReadyEvent.class)
	public void testJpaMethods(){

		/*Users users = new Users();
		address.setCity("Kiev");
		address.setHomeNumber("4");
		address.setStreet("Main Street");
		Address address1 = new Address();
		address1.setCity("Lviv");
		Users users = new Users();
		users.setAddress(address);
		users.setEmail("someEmail@gmail.com");
		users.setName("Smith");
		userService.createUsers(users);
		Users users1 = new Users();
		users1.setName("Jon Dorian");
		users1.setEmail("gmailEmail@gmail.com");
		users1.setAddress(address1);
		userService.createUsers(users1);*/

		usersService.findAll().forEach(System.out::println);

	}
}