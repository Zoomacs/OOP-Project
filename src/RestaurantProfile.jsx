import { useEffect, useRef, useState } from "react";
import { Save, Ticket, CheckCircle2, Camera } from "lucide-react";
import "./RestaurantProfile.css";
import { api, getUser } from "./api";

function RestaurantProfile() {
  const currentUser = getUser();
  const restaurantId = Number(currentUser?.restaurant_id || sessionStorage.getItem("restaurantId") || 1);
  const [saveStatus, setSaveStatus] = useState("");
  const [ticketStatus, setTicketStatus] = useState("");
  const [profileImage, setProfileImage] = useState("");
  const [imageData, setImageData] = useState("");
  const [form, setForm] = useState({ name: "", description: "", category: "", phone: "", address: "", opening_hours: "" });
  const fileInputRef = useRef(null);

  useEffect(() => {
    api(`restaurants&restaurant_id=${restaurantId}`)
      .then((data) => {
        const r = data.restaurant;
        if (!r) return;
        setForm({ name: r.name || "", description: r.description || "", category: r.category || "", phone: r.phone || "", address: r.address || "", opening_hours: r.opening_hours || "" });
        setProfileImage(r.imageUrl || "");
      })
      .catch((err) => console.log(err.message));
  }, [restaurantId]);

  async function handleSave(e) {
    e.preventDefault();
    try {
      await api("restaurants", { method: "PUT", body: JSON.stringify({ id: restaurantId, ...form, image_data: imageData || profileImage, image_url: profileImage }) });
      setSaveStatus("Profile updated successfully!");
    } catch (err) {
      setSaveStatus(err.message);
    }
    setTimeout(() => setSaveStatus(""), 3000);
  }

  async function handleTicket(e) {
    e.preventDefault();
    const title = e.target.elements[0].value;
    const message = e.target.elements[1].value;
    try {
      await api("tickets", { method: "POST", body: JSON.stringify({ user_id: currentUser?.id || 2, email: currentUser?.email || "owner@qless.local", title, message }) });
      e.target.reset();
      setTicketStatus("Ticket submitted to database. Support will contact you shortly.");
    } catch (err) {
      setTicketStatus(err.message);
    }
    setTimeout(() => setTicketStatus(""), 4000);
  }

  function handleImageClick() {
    fileInputRef.current.click();
  }

  function handleImageChange(e) {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 3 * 1024 * 1024) {
      setSaveStatus("Image is too large. Maximum size is 3MB.");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      setProfileImage(reader.result);
      setImageData(reader.result);
    };
    reader.readAsDataURL(file);
  }

  return (
    <div className="owner-page-container fade-in">
      <div className="owner-header"><div><h1>Restaurant Profile</h1><p className="subtitle">Manage details for restaurant #{restaurantId}.</p></div></div>
      <div className="profile-grid">
        <form className="form-section slide-up" onSubmit={handleSave}>
          <div className="form-header"><h2>Edit Information</h2>{saveStatus && <span className="status-badge success pop-in"><CheckCircle2 size={16} /> {saveStatus}</span>}</div>
          <div className="image-upload-container"><div className="profile-image-wrapper" onClick={handleImageClick}>{profileImage ? <img src={profileImage} alt="Profile Preview" className="profile-preview-img" /> : <div className="profile-image-placeholder"><Camera size={28} /></div>}<div className="image-overlay"><span>Change Photo</span></div></div><input type="file" ref={fileInputRef} onChange={handleImageChange} accept="image/*" style={{ display: "none" }} /></div>
          <div className="input-group"><label>Restaurant Name</label><input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required /></div>
          <div className="input-group"><label>Category</label><input type="text" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} /></div>
          <div className="input-group"><label>Description</label><textarea rows="4" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} required></textarea></div>
          <div className="input-group"><label>Phone</label><input type="text" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} /></div>
          <div className="input-group"><label>Address</label><input type="text" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} /></div>
          <div className="input-group"><label>Opening Hours</label><input type="text" value={form.opening_hours} onChange={(e) => setForm({ ...form, opening_hours: e.target.value })} /></div>
          <button type="submit" className="primary-btn mt-4"><Save size={20} /> Save Changes</button>
        </form>

        <form className="form-section slide-up delayed" onSubmit={handleTicket}>
          <div className="form-header"><h2>Support Ticket</h2></div>
          <p className="form-helper-text">Facing a technical issue? Let us know.</p>
          <div className="input-group"><label>Issue Topic</label><input type="text" placeholder="e.g. Menu Sync Issue" required /></div>
          <div className="input-group"><label>Message</label><textarea rows="4" placeholder="Describe your problem in detail..." required></textarea></div>
          <button type="submit" className="secondary-btn mt-4 outline"><Ticket size={20} /> Send Ticket</button>
          {ticketStatus && <div className="status-banner pop-in"><CheckCircle2 size={18} /><p>{ticketStatus}</p></div>}
        </form>
      </div>
    </div>
  );
}

export default RestaurantProfile;
