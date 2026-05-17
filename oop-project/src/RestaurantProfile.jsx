import { useState, useRef } from "react";
import { Save, Ticket, CheckCircle2, Camera } from "lucide-react";
import "./RestaurantProfile.css";

function RestaurantProfile() {
  const [saveStatus, setSaveStatus] = useState("");
  const [ticketStatus, setTicketStatus] = useState("");
  const [profileImage, setProfileImage] = useState("");
  const fileInputRef = useRef(null);

  function handleSave(e) {
    e.preventDefault();
    setSaveStatus("Profile updated successfully!");
    setTimeout(() => setSaveStatus(""), 3000);
  }

  function handleTicket(e) {
    e.preventDefault();
    e.target.reset();
    setTicketStatus("Ticket submitted. Support will contact you shortly.");
    setTimeout(() => setTicketStatus(""), 4000);
  }

  function handleImageClick() {
    fileInputRef.current.click();
  }

  function handleImageChange(e) {
    const file = e.target.files[0];
    if (file) {
      setProfileImage(URL.createObjectURL(file));
    }
  }

  return (
    <div className="owner-page-container fade-in">
      <div className="owner-header">
        <div>
          <h1>Restaurant Profile</h1>
          <p className="subtitle">Manage your venue details and get support.</p>
        </div>
      </div>

      <div className="profile-grid">
        <form className="form-section slide-up" onSubmit={handleSave}>
          <div className="form-header">
            <h2>Edit Information</h2>
            {saveStatus && (
              <span className="status-badge success pop-in">
                <CheckCircle2 size={16} /> {saveStatus}
              </span>
            )}
          </div>

          <div className="image-upload-container">
            <div className="profile-image-wrapper" onClick={handleImageClick}>
              {profileImage ? (
                <img src={profileImage} alt="Profile Preview" className="profile-preview-img" />
              ) : (
                <div className="profile-image-placeholder">
                  <Camera size={28} />
                </div>
              )}
              <div className="image-overlay">
                <span>Change Photo</span>
              </div>
            </div>
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleImageChange} 
              accept="image/*" 
              style={{ display: "none" }} 
            />
          </div>
          
          <div className="input-group">
            <label>Restaurant Name</label>
            <input type="text" defaultValue="KFC" required />
          </div>
          
          <div className="input-group">
            <label>Description</label>
            <textarea rows="4" defaultValue="Finger Lickin' Good" required></textarea>
          </div>
          
          <button type="submit" className="primary-btn mt-4">
            <Save size={20} /> Save Changes
          </button>
        </form>

        <form className="form-section slide-up delayed" onSubmit={handleTicket}>
          <div className="form-header">
            <h2>Support Ticket</h2>
          </div>
          
          <p className="form-helper-text">Facing a technical issue? Let us know.</p>

          <div className="input-group">
            <label>Issue Topic</label>
            <input type="text" placeholder="e.g. Menu Sync Issue" required />
          </div>

          <div className="input-group">
            <label>Message</label>
            <textarea rows="4" placeholder="Describe your problem in detail..." required></textarea>
          </div>

          <button type="submit" className="secondary-btn mt-4 outline">
            <Ticket size={20} /> Send Ticket
          </button>

          {ticketStatus && (
            <div className="status-banner pop-in">
              <CheckCircle2 size={18} />
              <p>{ticketStatus}</p>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}

export default RestaurantProfile;