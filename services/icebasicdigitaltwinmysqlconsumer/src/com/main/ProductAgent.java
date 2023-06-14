/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.main;

import java.util.ArrayList;

/**
 *
 * @author mitch
 */
public class ProductAgent {
    
    private final ArrayList<Product> products;
    
    
    public ProductAgent(){
        products = new ArrayList<Product>();
    }
    
    public void addProduct(Product prod)
    {
        products.add(prod);
    }
    
    public void removeProduct(Product prod)
    {
        //Find the position of the product in the ArrayList
        int pos = 0;
        products.remove(pos);
    }
    
    public Product getProduct(Product prod)
    {
        for(int i =0; i< products.size(); i++)
        {
            if(prod.equals(products.get(i)))
            {
                return products.get(i);
            }
        }
        return null;
    }
    
    public Product getProduct(int prod)
    {
        for(int i =0; i< products.size(); i++)
        {
            if(prod == products.get(i).getId())
            {
                return products.get(i);
            }
        }
        return null;
    }
    
    public Product getProductByPos(int prod)
    {
        return products.get(prod);
    }
    
    public int productListLength()
    {
    return products.size();
    }
    
    
}
