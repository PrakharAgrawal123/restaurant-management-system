import React, { useEffect, useState } from "react";
import api from "../../utils/api";
import toast from "react-hot-toast";
import { Plus, Edit, Trash2, MapPin, Phone, Mail } from "lucide-react";

const ManageBranches = () => {
  const [branches, setBranches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingBranch, setEditingBranch] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    location: "",
    address: "",
    phone: "",
    email: "",
    openingHours: "",
    image: ""
  });

  useEffect(() => {
    fetchBranches();
  }, []);

  const fetchBranches = async () => {
    try {
      const { data } = await api.get("/branch/all");
      setBranches(data.branches);
    } catch (error) {
      toast.error("Failed to fetch branches");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingBranch) {
        await api.put(`/branch/update/${editingBranch._id}`, formData);
        toast.success("Branch updated");
      } else {
        await api.post("/branch/new", formData);
        toast.success("Branch created");
      }
      setShowModal(false);
      setEditingBranch(null);
      setFormData({ name: "", location: "", address: "", phone: "", email: "", openingHours: "", image: "" });
      fetchBranches();
    } catch (error) {
      toast.error(error.response?.data?.message || "Operation failed");
    }
  };

  const handleEdit = (branch) => {
    setEditingBranch(branch);
    setFormData({
      name: branch.name,
      location: branch.location,
      address: branch.address,
      phone: branch.phone,
      email: branch.email,
      openingHours: branch.openingHours,
      image: branch.image || ""
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this branch?")) {
      try {
        await api.delete(`/branch/delete/${id}`);
        toast.success("Branch deleted");
        fetchBranches();
      } catch (error) {
        toast.error("Failed to delete branch");
      }
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="manage-branches-container">
      <div className="header-actions">
        <h2>Manage Branches</h2>
        <button className="add-btn" onClick={() => { setEditingBranch(null); setShowModal(true); }}>
          <Plus size={20} /> Add Branch
        </button>
      </div>

      <div className="branches-grid">
        {branches.map(branch => (
          <div key={branch._id} className="branch-card">
            <div className="branch-image">
              <img src={branch.image || "https://via.placeholder.com/300x150?text=Restaurant+Branch"} alt={branch.name} />
            </div>
            <div className="branch-info">
              <h3>{branch.name}</h3>
              <p><MapPin size={16} /> {branch.location}</p>
              <p><Phone size={16} /> {branch.phone}</p>
              <p><Mail size={16} /> {branch.email}</p>
              <div className="branch-actions">
                <button onClick={() => handleEdit(branch)}><Edit size={18} /></button>
                <button onClick={() => handleDelete(branch._id)} className="delete"><Trash2 size={18} /></button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>{editingBranch ? "Edit Branch" : "Add New Branch"}</h3>
            <form onSubmit={handleSubmit}>
              <input type="text" placeholder="Branch Name" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} required />
              <input type="text" placeholder="Location (City)" value={formData.location} onChange={(e) => setFormData({...formData, location: e.target.value})} required />
              <input type="text" placeholder="Full Address" value={formData.address} onChange={(e) => setFormData({...formData, address: e.target.value})} required />
              <input type="text" placeholder="Phone" value={formData.phone} onChange={(e) => setFormData({...formData, phone: e.target.value})} required />
              <input type="email" placeholder="Email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} required />
              <input type="text" placeholder="Opening Hours" value={formData.openingHours} onChange={(e) => setFormData({...formData, openingHours: e.target.value})} />
              <input type="text" placeholder="Image URL" value={formData.image} onChange={(e) => setFormData({...formData, image: e.target.value})} />
              <div className="modal-btns">
                <button type="button" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="submit-btn">{editingBranch ? "Update" : "Create"}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageBranches;
