import { useEffect } from "react";
import { X } from "lucide-react";
import "./SizeModal.css";

function SizeModal({ item, onClose, onAddToCart }) {
  useEffect(() => {
    const handleKey = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handleKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  if (!item) return null;

  return (
    <div className="size-modal-overlay" onClick={onClose}>
      <div className="size-modal" onClick={(e) => e.stopPropagation()}>
        <button className="size-modal-close" onClick={onClose}>
          <X size={20} />
        </button>
        <div className="size-modal-content">
          <img src={item.image} alt={item.name} className="size-modal-image" />
          <div className="size-modal-info">
            <h2>{item.baseName || item.name}</h2>
            {item.description && <p className="size-modal-desc">{item.description}</p>}
          </div>
          <div className="size-modal-sizes">
            <h3>Choose Size</h3>
            {item.sizes.map((size, index) => (
              <button
                key={index}
                className="size-option-btn"
                onClick={() => onAddToCart(size)}
              >
                <span className="size-option-name">{size.size_name}</span>
                <span className="size-option-price">{size.price} EGP</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default SizeModal;
