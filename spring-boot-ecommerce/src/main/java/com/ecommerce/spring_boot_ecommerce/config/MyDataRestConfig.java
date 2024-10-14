package com.ecommerce.spring_boot_ecommerce.config;

import com.ecommerce.spring_boot_ecommerce.entity.Country;
import com.ecommerce.spring_boot_ecommerce.entity.Product;
import com.ecommerce.spring_boot_ecommerce.entity.ProductCategory;
import com.ecommerce.spring_boot_ecommerce.entity.State;
import jakarta.persistence.EntityManager;
import jakarta.persistence.metamodel.EntityType;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.rest.core.config.RepositoryRestConfiguration;
import org.springframework.data.rest.webmvc.config.RepositoryRestConfigurer;
import org.springframework.http.HttpMethod;
import org.springframework.web.servlet.config.annotation.CorsRegistry;

import java.util.ArrayList;
import java.util.List;
import java.util.Set;

@Configuration
public class MyDataRestConfig implements RepositoryRestConfigurer {

    private EntityManager entityManager;
    @Autowired
    public MyDataRestConfig(EntityManager theentityManager){
        entityManager=theentityManager;
    }
    @Override
    public void configureRepositoryRestConfiguration(RepositoryRestConfiguration config, CorsRegistry cors) {
        HttpMethod[] theUnsupportedActions={HttpMethod.DELETE,HttpMethod.POST,HttpMethod.PUT};

        //disable HTTP Methods for Product: Put,Post and Delete
        disableHttpMethods(Product.class,config,theUnsupportedActions);
        //disable HTTP Methods for ProductCategory:Put,Post and Delete
        disableHttpMethods(ProductCategory.class,config, theUnsupportedActions);
        //disable HTTP Methods for Country:Put,Post and Delete
        disableHttpMethods(Country.class,config,theUnsupportedActions);
        //disable HTTP Methods for State:Put,Post and Delete
        disableHttpMethods(State.class,config,theUnsupportedActions);
        //call an internal helper method
        exposeIds(config);
    }

    private void disableHttpMethods(Class theClass,RepositoryRestConfiguration config, HttpMethod[] theUnsupportedActions) {
        config.getExposureConfiguration().forDomainType(theClass)
                .withCollectionExposure((metadata, httpMethods) -> httpMethods.disable(theUnsupportedActions))
                .withItemExposure((metadata, httpMethods) -> httpMethods.disable(theUnsupportedActions));
    }

    private void exposeIds(RepositoryRestConfiguration config) {
        //expose entity Id's

        //-get a list of all entity classes from the entity manager
        Set<EntityType<?>> entities=entityManager.getMetamodel().getEntities();

        //-create an array of the entity types
        List<Class> entityClasses=new ArrayList<>();
        for (EntityType tempEntityType:entities){
            entityClasses.add(tempEntityType.getJavaType());
        }

        //-expose the entity ids for the entity /domain types
        Class[] domainTypes=entityClasses.toArray(new Class[0]);
        config.exposeIdsFor(domainTypes);
    }
}
