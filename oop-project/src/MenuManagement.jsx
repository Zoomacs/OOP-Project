import { useState } from "react";
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  Star,
  AlertTriangle,
  Zap,
  Megaphone,
  X,
} from "lucide-react";
import "./MenuManagement.css";

function MenuManagement() {
  const [items, setItems] = useState([
    {
      id: 1,
      title: "Truffle Avocado Toast",
      tag: "VEGAN",
      price: 12.5,
      description: "Sourdough bread, smashed avocado, truffle oil, microgreens",
      inStock: true,
    },
    {
      id: 2,
      title: "Double Smash Burger",
      tag: "",
      price: 15.0,
      description:
        "Two wagyu patties, secret sauce, caramelized onions, brioche",
      inStock: true,
    },
    {
      id: 3,
      title: "Pepperoni Classic",
      tag: "SOLD OUT",
      price: 14.0,
      description:
        "Classic wood-fired pizza with spicy pepperoni and mozzarella",
      inStock: false,
    },
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [quickAdd, setQuickAdd] = useState({
    title: "",
    price: "",
    category: "",
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    price: "",
    tag: "",
    description: "",
    inStock: true,
  });

  function toggleStock(id) {
    setItems(
      items.map((item) => {
        if (item.id === id) {
          const newStockStatus = !item.inStock;
          return {
            ...item,
            inStock: newStockStatus,
            tag: newStockStatus
              ? item.tag === "SOLD OUT"
                ? ""
                : item.tag
              : "SOLD OUT",
          };
        }
        return item;
      }),
    );
  }

  function handleRemove(id) {
    setItems((prev) => prev.filter((item) => item.id !== id));
  }

  function handleQuickAdd(e) {
    e.preventDefault();
    if (!quickAdd.title || !quickAdd.price) return;

    const newItem = {
      id: Date.now(),
      title: quickAdd.title,
      tag: quickAdd.category.toUpperCase(),
      price: parseFloat(quickAdd.price),
      description: "Newly added item via Quick Add.",
      inStock: true,
    };

    setItems([newItem, ...items]);
    setQuickAdd({ title: "", price: "", category: "" });
  }

  function openAddModal() {
    setEditingItem(null);
    setFormData({
      title: "",
      price: "",
      tag: "",
      description: "",
      inStock: true,
    });
    setIsModalOpen(true);
  }

  function openEditModal(item) {
    setEditingItem(item.id);
    setFormData({ ...item });
    setIsModalOpen(true);
  }

  function handleModalSubmit(e) {
    e.preventDefault();
    if (editingItem) {
      setItems(
        items.map((item) =>
          item.id === editingItem
            ? { ...formData, price: parseFloat(formData.price) }
            : item,
        ),
      );
    } else {
      setItems([
        { ...formData, id: Date.now(), price: parseFloat(formData.price) },
        ...items,
      ]);
    }
    setIsModalOpen(false);
  }

  return (
    <div className="menu-editor-container fade-in">
      <div className="editor-header-main">
        <div>
          <h1>Menu Editor</h1>
          <p className="editor-subtitle">
            Manage your campus culinary offerings and availability.
          </p>
        </div>
        <button className="primary-pill-btn" onClick={openAddModal}>
          <Plus size={20} /> Add New Item
        </button>
      </div>

      <div className="metrics-row">
        <div className="metric-card">
          <div className="metric-header primary-text">
            <Star size={16} /> PEAK PERFORMANCE ITEM
          </div>
          <h3>Spicy Miso Ramen</h3>
          <p>142 orders this week (+12%)</p>
        </div>

        <div className="metric-card">
          <div className="metric-header primary-text">
            <AlertTriangle size={16} /> LOW STOCK ALERTS
          </div>
          <div className="metric-big-number">
            <span className="primary-text">03</span> items require attention
          </div>
        </div>

        <div className="metric-card highlight-card">
          <div className="metric-header text-color">
            <Zap size={16} /> LIVE STATUS
          </div>
          <div className="status-indicator">
            <span className="dot pulse"></span> Kitchen is Active
          </div>
          <p>Average prep time: 12 mins</p>
        </div>
      </div>

      <div className="menu-list-section">
        <div className="menu-list-header">
          <h2>Current Menu</h2>
          <div className="search-bar">
            <Search size={18} />
            <input
              type="text"
              placeholder="Search menu..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="menu-items-container">
          {items
            .filter((item) =>
              item.title.toLowerCase().includes(searchTerm.toLowerCase()),
            )
            .map((item) => (
              <div className="menu-list-row" key={item.id}>
                <div className="row-left">
                  <div className="item-image-placeholder"></div>
                  <div className="item-details">
                    <div className="item-title-row">
                      <h3>{item.title}</h3>
                      {item.tag && (
                        <span
                          className={`item-tag ${item.tag === "SOLD OUT" ? "tag-red" : "tag-green"}`}
                        >
                          {item.tag}
                        </span>
                      )}
                    </div>
                    <p className="item-desc">{item.description}</p>
                    <span className="item-price-text">
                      {item.price.toFixed(2)} EGP
                    </span>
                  </div>
                </div>

                <div className="row-right">
                  <div className="stock-toggle-wrapper">
                    <label className="toggle-switch">
                      <input
                        type="checkbox"
                        checked={item.inStock}
                        onChange={() => toggleStock(item.id)}
                      />
                      <span className="slider round"></span>
                    </label>
                    <span
                      className={`toggle-label ${item.inStock ? "text-green" : "text-gray"}`}
                    >
                      {item.inStock ? "IN STOCK" : "STOCK OUT"}
                    </span>
                  </div>

                  <div className="action-buttons-group">
                    <button
                      className="icon-action-btn"
                      onClick={() => openEditModal(item)}
                    >
                      <Edit2 size={18} />
                    </button>
                    <button
                      className="icon-action-btn delete"
                      onClick={() => handleRemove(item.id)}
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          {items.length === 0 && (
            <p className="empty-menu-text">
              Your menu is currently empty. Add some items!
            </p>
          )}
        </div>
      </div>

      <div className="bottom-sections-grid">
        <div className="promo-card">
          <div className="promo-header primary-text">
            <Megaphone size={16} /> PROMOTION ACTIVE
          </div>
          <h2>Finals Week Fuel</h2>
          <p>20% off all coffee and energy drinks. Ends in 48 hours.</p>
          <button
            className="promo-btn"
            onClick={() => alert("Promotion manager coming soon!")}
          >
            Manage Promotion
          </button>
        </div>

        <div className="quick-add-card">
          <div className="quick-add-header">
            <Zap size={18} className="primary-text" /> <h2>Quick Add Item</h2>
          </div>
          <form className="quick-add-form" onSubmit={handleQuickAdd}>
            <input
              type="text"
              placeholder="Item Name"
              className="pill-input full-width"
              value={quickAdd.title}
              onChange={(e) =>
                setQuickAdd({ ...quickAdd, title: e.target.value })
              }
              required
            />
            <div className="input-row">
              <input
                type="number"
                step="0.01"
                placeholder="Price (EGP)"
                className="pill-input half-width"
                value={quickAdd.price}
                onChange={(e) =>
                  setQuickAdd({ ...quickAdd, price: e.target.value })
                }
                required
              />
              <select
                className="pill-input half-width"
                value={quickAdd.category}
                onChange={(e) =>
                  setQuickAdd({ ...quickAdd, category: e.target.value })
                }
                required
              >
                <option value="" disabled>
                  Category
                </option>
                <option value="Mains">Mains</option>
                <option value="Sides">Sides</option>
                <option value="Drinks">Drinks</option>
                <option value="Vegan">Vegan</option>
              </select>
            </div>
            <button type="submit" className="dark-pill-btn">
              Publish Immediately
            </button>
          </form>
        </div>
      </div>

      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2>{editingItem ? "Edit Item" : "Add New Item"}</h2>
              <button
                className="icon-action-btn"
                onClick={() => setIsModalOpen(false)}
              >
                <X size={20} />
              </button>
            </div>

            <form className="modal-form" onSubmit={handleModalSubmit}>
              <div className="input-group">
                <label>Item Title</label>
                <input
                  type="text"
                  className="pill-input"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  required
                />
              </div>

              <div className="input-row">
                <div className="input-group half-width">
                  <label>Price (EGP)</label>
                  <input
                    type="number"
                    step="0.01"
                    className="pill-input full-width"
                    value={formData.price}
                    onChange={(e) =>
                      setFormData({ ...formData, price: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="input-group half-width">
                  <label>Tag (Optional)</label>
                  <input
                    type="text"
                    className="pill-input full-width"
                    placeholder="e.g. VEGAN"
                    value={formData.tag}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        tag: e.target.value.toUpperCase(),
                      })
                    }
                  />
                </div>
              </div>

              <div className="input-group">
                <label>Description</label>
                <textarea
                  className="pill-input text-area"
                  rows="3"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  required
                />
              </div>

              <div className="modal-actions">
                <button
                  type="button"
                  className="outline-btn"
                  onClick={() => setIsModalOpen(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="primary-pill-btn">
                  Save Item
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default MenuManagement;
