// context/MenuContext.js
import React, { createContext, useState, useEffect, useContext } from "react";
import BASE_URL from "../apiConfig";

const MenuContext = createContext();

export function MenuProvider({ children }) {
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);

useEffect(() => {
  async function fetchAllMenuItems() {
    let allItems = [];
    let url = `${BASE_URL}/restaurante/menu-items/`;
    try {
      while (url) {
        const response = await fetch(url);
        const data = await response.json();
        allItems = allItems.concat(data.results || []);
        url = data.next; // DRF pagination: null if no more pages
      }
      setMenuItems(allItems);
    } catch (error) {
      console.error("Error fetching menu items:", error);
    } finally {
      setLoading(false);
    }
  }
  fetchAllMenuItems();
}, []);


  return (
    <MenuContext.Provider value={{ menuItems, loading }}>
      {children}
    </MenuContext.Provider>
  );
}


export function useMenu() {
  return useContext(MenuContext);
}
