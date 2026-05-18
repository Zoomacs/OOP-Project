import { useEffect, useState } from "react";
import { Plus, Search, Edit2, Trash2, Star, AlertTriangle, Zap, Megaphone, X, ImagePlus } from "lucide-react";
import "./MenuManagement.css";
import { api, getUser } from "../../api";

function getOwnerRestaurantId() {
  const user = getUser();
  return Number(user?.restaurant_id || sessionStorage.getItem("restaurantId") || 1);
}

function MenuManagement() {
  const restaurantId = getOwnerRestaurantId();
  const [items, setItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [quickAdd, setQuickAdd] = useState({ title: "", price: "", category: "" });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({ title: "", price: "", tag: "", description: "", image: "", image_data: "", inStock: true });

  const loadMenu = () => api(`menu&restaurant_id=${restaurantId}`).then((d) => setItems(d.items || [])).catch((err) => alert(err.message));
  useEffect(() => { loadMenu(); }, [restaurantId]);

  function readImage(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = () => reject(new Error("Could not read image"));
      reader.readAsDataURL(file);
    });
  }

  async function handleImageChange(e) {
    const file = e.target.files[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      alert("Please choose an image file only.");
      return;
    }
    if (file.size > 3 * 1024 * 1024) {
      alert("Image is too large. Maximum size is 3MB.");
      return;
    }
    const imageData = await readImage(file);
    setFormData((prev) => ({ ...prev, image: imageData, image_data: imageData }));
  }

  async function saveItem(item) {
    const payload = {
      id: item.id,
      restaurant_id: restaurantId,
      title: item.title || item.name,
      name: item.title || item.name,
      price: item.price,
      category: item.tag || item.category || "",
      tag: item.tag || item.category || "",
      description: item.description || item.desc || "",
      image: item.image || "",
      image_url: item.image_url || item.image || "",
      image_data: item.image_data || "",
      inStock: item.inStock,
      is_available: item.inStock ? 1 : 0,
    };
    if (item.id) await api("menu", { method: "PUT", body: JSON.stringify(payload) });
    else await api("menu", { method: "POST", body: JSON.stringify(payload) });
    await loadMenu();
  }

  async function toggleStock(id) {
    const item = items.find((i) => i.id === id);
    if (item) await saveItem({ ...item, inStock: !item.inStock });
  }

  async function handleRemove(id) {
    if (!window.confirm("Delete this menu item?")) return;
    await api(`menu&id=${id}`, { method: "DELETE" });
    setItems((prev) => prev.filter((item) => item.id !== id));
  }

  async function handleQuickAdd(e) {
    e.preventDefault();
    if (!quickAdd.title || !quickAdd.price) return;
    await saveItem({ title: quickAdd.title, tag: quickAdd.category.toUpperCase(), price: parseFloat(quickAdd.price), description: "Newly added item via Quick Add.", image: "", inStock: true });
    setQuickAdd({ title: "", price: "", category: "" });
  }

  function openAddModal() {
    setEditingItem(null);
    setFormData({ title: "", price: "", tag: "", description: "", image: "", image_data: "", inStock: true });
    setIsModalOpen(true);
  }

  function openEditModal(item) {
    setEditingItem(item.id);
    setFormData({
      title: item.title || item.name || "",
      price: item.price || "",
      tag: item.tag || "",
      description: item.description || item.desc || "",
      image: item.image || "",
      image_url: item.image_url || item.image || "",
      image_data: "",
      inStock: Boolean(item.inStock),
    });
    setIsModalOpen(true);
  }

  async function handleModalSubmit(e) {
    e.preventDefault();
    await saveItem({ ...formData, id: editingItem, price: parseFloat(formData.price) });
    setIsModalOpen(false);
  }

  const visibleItems = items.filter((item) => (item.title || item.name || "").toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="menu-editor-container fade-in">
      <div className="editor-header-main">
        <div>
          <h1>Menu Editor</h1>
          <p className="editor-subtitle">Manage restaurant #{restaurantId} menu items, images, and stock status.</p>
        </div>
        <button className="primary-pill-btn" onClick={openAddModal}><Plus size={20} /> Add New Item</button>
      </div>

      <div className="metrics-row">
        <div className="metric-card"><div className="metric-header primary-text"><Star size={16} /> ITEMS</div><h3>{items.length}</h3><p>Loaded from your restaurant database</p></div>
        <div className="metric-card"><div className="metric-header primary-text"><AlertTriangle size={16} /> OUT OF STOCK</div><div className="metric-big-number"><span className="primary-text">{items.filter(i => !i.inStock).length}</span> hidden from students</div></div>
        <div className="metric-card highlight-card"><div className="metric-header text-color"><Zap size={16} /> LIVE STATUS</div><div className="status-indicator"><span className="dot pulse"></span> Kitchen is Active</div><p>Only in-stock items appear on the student menu.</p></div>
      </div>

      <div className="menu-list-section">
        <div className="menu-list-header">
          <h2>Current Menu</h2>
          <div className="search-bar"><Search size={18} /><input type="text" placeholder="Search menu..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} /></div>
        </div>
        <div className="menu-items-container">
          {visibleItems.map((item) => (
            <div className="menu-list-row" key={item.id}>
              <div className="row-left">
                {item.image ? <img className="item-image-thumb" src={item.image} alt={item.title || item.name} /> : <div className="item-image-placeholder"><ImagePlus size={24} /></div>}
                <div className="item-details">
                  <div className="item-title-row">
                    <h3>{item.title || item.name}</h3>
                    {item.tag && <span className="item-tag tag-green">{item.tag}</span>}
                    {!item.inStock && <span className="item-tag tag-red">STOCK OUT</span>}
                  </div>
                  <p className="item-desc">{item.description}</p>
                  <span className="item-price-text">{Number(item.price).toFixed(2)} EGP</span>
                </div>
              </div>
              <div className="row-right">
                <div className="stock-toggle-wrapper">
                  <label className="toggle-switch"><input type="checkbox" checked={item.inStock} onChange={() => toggleStock(item.id)} /><span className="slider round"></span></label>
                  <span className={`toggle-label ${item.inStock ? "text-green" : "text-gray"}`}>{item.inStock ? "IN STOCK" : "STOCK OUT"}</span>
                </div>
                <div className="action-buttons-group">
                  <button className="icon-action-btn" onClick={() => openEditModal(item)}><Edit2 size={18} /></button>
                  <button className="icon-action-btn delete" onClick={() => handleRemove(item.id)}><Trash2 size={18} /></button>
                </div>
              </div>
            </div>
          ))}
          {items.length === 0 && <p className="empty-menu-text">Your menu is currently empty. Add some items!</p>}
        </div>
      </div>

      <div className="bottom-sections-grid">
        <div className="promo-card"><div className="promo-header primary-text"><Megaphone size={16} /> PROMOTION ACTIVE</div><h2>Finals Week Fuel</h2><p>20% off all coffee and energy drinks. Ends in 48 hours.</p><button className="promo-btn" onClick={() => alert("Promotion manager coming soon!")}>Manage Promotion</button></div>
        <div className="quick-add-card"><div className="quick-add-header"><Zap size={18} className="primary-text" /> <h2>Quick Add Item</h2></div><form className="quick-add-form" onSubmit={handleQuickAdd}><input type="text" placeholder="Item Name" className="pill-input full-width" value={quickAdd.title} onChange={(e) => setQuickAdd({ ...quickAdd, title: e.target.value })} required /><div className="input-row"><input type="number" step="0.01" placeholder="Price (EGP)" className="pill-input half-width" value={quickAdd.price} onChange={(e) => setQuickAdd({ ...quickAdd, price: e.target.value })} required /><select className="pill-input half-width" value={quickAdd.category} onChange={(e) => setQuickAdd({ ...quickAdd, category: e.target.value })} required><option value="" disabled>Category</option><option value="Mains">Mains</option><option value="Sides">Sides</option><option value="Drinks">Drinks</option><option value="Vegan">Vegan</option></select></div><button type="submit" className="dark-pill-btn">Publish Immediately</button></form></div>
      </div>

      {isModalOpen && <div className="modal-overlay">
        <div className="modal-content">
          <div className="modal-header"><h2>{editingItem ? "Edit Item" : "Add New Item"}</h2><button className="icon-action-btn" onClick={() => setIsModalOpen(false)}><X size={20} /></button></div>
          <form className="modal-form" onSubmit={handleModalSubmit}>
            <div className="input-group"><label>Item Image</label><div className="image-upload-row">{formData.image ? <img src={formData.image} alt="Preview" className="item-preview-img" /> : <div className="item-preview-empty"><ImagePlus size={26} /></div>}<input type="file" accept="image/*" onChange={handleImageChange} /></div></div>
            <div className="input-group"><label>Item Title</label><input type="text" className="pill-input" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} required /></div>
            <div className="input-row"><div className="input-group half-width"><label>Price (EGP)</label><input type="number" step="0.01" className="pill-input full-width" value={formData.price} onChange={(e) => setFormData({ ...formData, price: e.target.value })} required /></div><div className="input-group half-width"><label>Category / Tag</label><input type="text" className="pill-input full-width" placeholder="e.g. VEGAN" value={formData.tag} onChange={(e) => setFormData({ ...formData, tag: e.target.value.toUpperCase() })} /></div></div>
            <div className="input-group"><label>Description</label><textarea className="pill-input text-area" rows="3" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} required /></div>
            <div className="stock-modal-row"><label><input type="checkbox" checked={formData.inStock} onChange={(e) => setFormData({ ...formData, inStock: e.target.checked })} /> In stock</label><span>Uncheck this to hide the item from students.</span></div>
            <div className="modal-actions"><button type="button" className="outline-btn" onClick={() => setIsModalOpen(false)}>Cancel</button><button type="submit" className="primary-pill-btn">Save Item</button></div>
          </form>
        </div>
      </div>}
    </div>
  );
}
export default MenuManagement;
