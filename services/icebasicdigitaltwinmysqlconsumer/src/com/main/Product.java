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
public class Product {
    
    private int id;
    private String name;
    private ArrayList<Item>  items;
    
    public Product() {
        items = new ArrayList<Item>();
    }
    
    
    public Product(int id, String name) {
        this.items = new ArrayList<Item>();
        this.id = id;
        this.name = name;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public void addItem(Item item)
    {
        items.add(item);
    }

    public void removeItem(Item item)
    {
        //Find the position of the machine in the ArrayList
        int pos = 0;
        items.remove(pos);
    }
    
    public Item getItem(Item item)
    {
        for(int i =0; i< items.size(); i++)
        {
            if(item.equals(items.get(i)))
            {
                return items.get(i);
            }
        }
        return null;
    }
    
    public Item getItem(int item)
    { 
        for(int i =0; i< items.size(); i++)
        {
            if(item == items.get(i).getId())
            {
                return items.get(i);
            }
        }
        return null;
    }
    
    public Item getItemByPos(int item)
    { 
       return items.get(item);
    }
    
    public int itemListLength()
    {
        return items.size();
    }
    
}
