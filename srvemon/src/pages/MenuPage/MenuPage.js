
import React from "react";
import { useMenu } from "../../context/MenuContext";
import './MenuPage.css'

// Map category IDs to names, adjust as per your backend IDs and categories
export const CATEGORY_ID_TO_NAME = {
  1: "Appetizers",
  2: "Desserts",
  3: "Beverages",
  4: "Chaat",
  5: "North-Indian",
  6: "South-Indian",
  7: "Indo-Chinese",
  8: "Other"
};

// Your fixed category order
export const CATEGORY_ORDER = [
  "Appetizers",
  "Beverages",
  "Chaat",
  "North-Indian",
  "South-Indian",
  "Indo-Chinese",
  "Desserts",
  "Other"

];

function MenuPage() {
  const { menuItems, loading } = useMenu();

  if (loading) return <p>Loading menu...</p>;
  const categories = [...new Set(menuItems.map(i => i.category || "Other"))];
  console.log("Categories found:", categories);



  // Group items by category
  const groupedItems = {};
  menuItems.forEach(item => {
  const catName = CATEGORY_ID_TO_NAME[item.category] || "Other";
  if (!groupedItems[catName]) groupedItems[catName] = [];
  groupedItems[catName].push(item);
  });


  console.log("Grouped items:", groupedItems);

  return (
    <div className="menu-container">
      <h2>Our Menu</h2>
      <br></br>
      <p className="scroll-note">Scroll inside each card to see full details and price.</p>
      {CATEGORY_ORDER.map(category => (
        groupedItems[category] ? (
          <section key={category} className="menu-category-section">
            <h3 className="menu-category-title">{category}</h3>
            <div className="menu-grid">
              {groupedItems[category].map(item => (
                <div key={item.id} className="menu-card">
                  {item.image && (
                    <img
                      src={item.image}
                      alt={item.title}
                      className="menu-card-image"
                    />
                  )}
                  <div className="menu-card-content">
                    <h4>{item.title}</h4>
                    <p>{item.description}</p>
                    <p><strong>₹{item.price}</strong></p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        ) : null
      ))}
    </div>
  );
}

export default MenuPage;
