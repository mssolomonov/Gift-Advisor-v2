package giftgenerator.giftgenerator.config;

import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Around;

@Aspect
public class Logging {

  @Around("within(giftgenerator.giftgenerator..*)")
  public Object logAround(ProceedingJoinPoint joinPoint) throws Throwable {

    System.out.println("Logging");
    System.out.println("method : " + joinPoint.getSignature().getName());

    System.out.println("Around before is running!");
    joinPoint.proceed();
    System.out.println("Around after is running!");

    System.out.println("******");
    return joinPoint.proceed();

  }

}

