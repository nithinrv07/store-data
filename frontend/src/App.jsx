import { useState, useEffect } from 'react';
import { Plus, Search, User, Smartphone, Home, Monitor, Trash2, ChevronRight, X, Pencil, PlusCircle } from 'lucide-react';
import Reports from './Reports';

const API_BASE = import.meta.env.VITE_API_BASE || (import.meta.env.PROD ? '/api' : 'http://localhost:5000/api');

function App() {
  const [customers, setCustomers] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [customerSales, setCustomerSales] = useState([]);
  const [totalSales, setTotalSales] = useState(0);
  const [isCustomerModalOpen, setIsCustomerModalOpen] = useState(false);
  const [isApplianceModalOpen, setIsApplianceModalOpen] = useState(false);
  const [isInventoryModalOpen, setIsInventoryModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [view, setView] = useState(() => localStorage.getItem('app_view') || 'dashboard'); 
  const [allSales, setAllSales] = useState([]);

  useEffect(() => {
    localStorage.setItem('app_view', view);
  }, [view]);
  const [inventory, setInventory] = useState([]);
  const [editingCustomer, setEditingCustomer] = useState(null);
  const [editingAppliance, setEditingAppliance] = useState(null);
  const [editingInventory, setEditingInventory] = useState(null);
  const [multiAppliances, setMultiAppliances] = useState([{ brand: '', model_number: '', serial_number: '', category: 'Laptops', price: '', cost: '', purchase_date: '', warranty_expiration: '' }]);

  // Form States
  const [customerForm, setCustomerForm] = useState({ name: '', email: '', phone: '', address: '' });
  const [inventoryForm, setInventoryForm] = useState({ brand: '', model_number: '', category: 'Laptops', cost: '', price: '', quantity: '', min_stock_level: 5, description: '' });

  useEffect(() => {
    fetchCustomers();
    fetchTotalSales();
    fetchInventory();
  }, []);

  useEffect(() => {
    if (selectedCustomer) {
      fetchAppliances(selectedCustomer._id);
    }
  }, [selectedCustomer]);

  const fetchCustomers = async () => {
    try {
      const res = await fetch(`${API_BASE}/customers`);
      const data = await res.json();
      setCustomers(data);
    } catch (err) {
      console.error('Error fetching customers:', err);
    }
  };

  const fetchTotalSales = async () => {
    try {
      const res = await fetch(`${API_BASE}/appliances`);
      const data = await res.json();
      setAllSales(data);
      setTotalSales(data.length);
    } catch (err) {
      console.error('Error fetching total sales:', err);
    }
  };

  const fetchInventory = async () => {
    try {
      const res = await fetch(`${API_BASE}/inventory`);
      const data = await res.json();
      setInventory(data);
    } catch (err) {
      console.error('Error fetching inventory:', err);
    }
  };

  const fetchAppliances = async (id) => {
    try {
      const res = await fetch(`${API_BASE}/appliances/customer/${id}`);
      const data = await res.json();
      setCustomerSales(data);
    } catch (err) {
      console.error('Error fetching appliances:', err);
    }
  };

  const handleCustomerSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = editingCustomer ? `${API_BASE}/customers/${editingCustomer._id}` : `${API_BASE}/customers`;
      const method = editingCustomer ? 'PUT' : 'POST';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(customerForm)
      });
      if (res.ok) {
        fetchCustomers();
        setIsCustomerModalOpen(false);
        setEditingCustomer(null);
        setCustomerForm({ name: '', email: '', phone: '', address: '' });
      }
    } catch (err) {
      console.error('Error saving customer:', err);
    }
  };

  const handleInventorySubmit = async (e) => {
    e.preventDefault();
    try {
      const url = editingInventory ? `${API_BASE}/inventory/${editingInventory._id}` : `${API_BASE}/inventory`;
      const method = editingInventory ? 'PUT' : 'POST';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(inventoryForm)
      });
      if (res.ok) {
        fetchInventory();
        setIsInventoryModalOpen(false);
        setEditingInventory(null);
        setInventoryForm({ brand: '', model_number: '', category: 'Laptops', cost: '', price: '', quantity: '', min_stock_level: 5, description: '' });
      }
    } catch (err) {
      console.error('Error saving inventory:', err);
    }
  };

  const deleteInventory = async (id) => {
    try {
      const res = await fetch(`${API_BASE}/inventory/${id}`, { method: 'DELETE' });
      if (res.ok) fetchInventory();
    } catch (err) {
      console.error('Error deleting inventory:', err);
    }
  };

  const addAnotherItem = () => {
    setMultiAppliances([...multiAppliances, { brand: '', model_number: '', serial_number: '', category: 'Laptops', price: '', cost: '', purchase_date: '', warranty_expiration: '' }]);
  };

  const updateMultiAppliance = (index, field, value) => {
    const updated = [...multiAppliances];
    updated[index][field] = value;
    setMultiAppliances(updated);
  };

  const removeMultiItem = (index) => {
    if (multiAppliances.length > 1) {
      setMultiAppliances(multiAppliances.filter((_, i) => i !== index));
    }
  };

  const handleApplianceSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingAppliance) {
        const res = await fetch(`${API_BASE}/appliances/${editingAppliance._id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(multiAppliances[0])
        });
        if (res.ok) {
          fetchAppliances(selectedCustomer._id);
          fetchTotalSales();
          setIsApplianceModalOpen(false);
          setEditingAppliance(null);
        }
      } else {
        // Handle multiple POSTs
        const promises = multiAppliances.map(item => 
          fetch(`${API_BASE}/appliances`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ...item, customer_id: selectedCustomer._id })
          })
        );
        await Promise.all(promises);
        fetchAppliances(selectedCustomer._id);
        fetchTotalSales();
        setIsApplianceModalOpen(false);
      }
      setMultiAppliances([{ brand: '', model_number: '', serial_number: '', category: 'Laptops', price: '', cost: '', purchase_date: '', warranty_expiration: '' }]);
    } catch (err) {
      console.error('Error saving appliance:', err);
    }
  };

  const deleteCustomer = async (id) => {
    try {
      const res = await fetch(`${API_BASE}/customers/${id}`, { method: 'DELETE' });
      if (res.ok) {
        fetchCustomers();
        if (selectedCustomer?._id === id) setSelectedCustomer(null);
      }
    } catch (err) {
      console.error('Error deleting customer:', err);
    }
  };

  const deleteAppliance = async (id) => {
    try {
      const res = await fetch(`${API_BASE}/appliances/${id}`, { method: 'DELETE' });
      if (res.ok) {
        fetchAppliances(selectedCustomer._id);
        fetchTotalSales();
      }
    } catch (err) {
      console.error('Error deleting appliance:', err);
    }
  };

  const filteredCustomers = customers.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    c.phone.includes(searchTerm)
  );

  const groupedCustomers = filteredCustomers.reduce((acc, customer) => {
    const month = new Date(customer.createdAt).toLocaleString('default', { month: 'long', year: 'numeric' });
    if (!acc[month]) acc[month] = [];
    acc[month].push(customer);
    return acc;
  }, {});

  return (
    <div id="root">
      <header>
        <div className="container header-content">
          <div className="logo">
            <Monitor size={24} />
            <span>Jayalakshmi Computer's Database</span>
          </div>
          <div className="nav-links" style={{ display: 'flex', gap: '1.5rem', marginLeft: '2rem', flex: 1 }}>
            <button className={`nav-btn ${view === 'dashboard' ? 'active' : ''}`} onClick={() => setView('dashboard')} style={{ background: 'none', border: 'none', color: view === 'dashboard' ? '#2563eb' : '#64748b', fontWeight: 600, cursor: 'pointer', padding: '0.5rem 0', borderBottom: view === 'dashboard' ? '2px solid #2563eb' : 'none' }}>Dashboard</button>
            <button className={`nav-btn ${view === 'inventory' ? 'active' : ''}`} onClick={() => setView('inventory')} style={{ background: 'none', border: 'none', color: view === 'inventory' ? '#2563eb' : '#64748b', fontWeight: 600, cursor: 'pointer', padding: '0.5rem 0', borderBottom: view === 'inventory' ? '2px solid #2563eb' : 'none' }}>Inventory</button>
            <button className={`nav-btn ${view === 'reports' ? 'active' : ''}`} onClick={() => setView('reports')} style={{ background: 'none', border: 'none', color: view === 'reports' ? '#2563eb' : '#64748b', fontWeight: 600, cursor: 'pointer', padding: '0.5rem 0', borderBottom: view === 'reports' ? '2px solid #2563eb' : 'none' }}>Reports</button>
          </div>
          {view === 'inventory' && (
            <button className="btn-primary" onClick={() => setIsInventoryModalOpen(true)}>
              <Plus size={18} style={{ marginRight: '8px', verticalAlign: 'middle' }} />
              Add Stock
            </button>
          )}
          {view === 'dashboard' && (
            <button className="btn-primary" onClick={() => setIsCustomerModalOpen(true)}>
              <Plus size={18} style={{ marginRight: '8px', verticalAlign: 'middle' }} />
              Add Customer
            </button>
          )}
        </div>
      </header>

      <main className="container">
        {view === 'dashboard' && (
          <>
            <div className="stats">
              <div className="stat-card">
                <h4>Total Customers</h4>
                <div className="value">{customers.length}</div>
              </div>
              <div className="stat-card">
                <h4>Total Sales</h4>
                <div className="value">{totalSales}</div>
              </div>
            </div>

            <div className="dashboard-grid">
              <section>
                <div className="search-bar">
                  <div style={{ position: 'relative', flex: 1 }}>
                    <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#64748b' }} />
                    <input 
                      type="text" 
                      placeholder="Search by name or phone..." 
                      style={{ paddingLeft: '40px' }}
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                </div>

                <div className="customer-list">
                  {Object.keys(groupedCustomers).length > 0 ? Object.keys(groupedCustomers).map(month => (
                    <div key={month}>
                      <div style={{ padding: '0.75rem 1rem', fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em', background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                        {month}
                      </div>
                      {groupedCustomers[month].map(customer => (
                        <div 
                          key={customer._id} 
                          className={`customer-item ${selectedCustomer?._id === customer._id ? 'selected' : ''}`}
                          onClick={() => setSelectedCustomer(customer)}
                        >
                          <div className="customer-info">
                            <h3>{customer.name}</h3>
                            <p><Smartphone size={14} style={{ marginRight: '4px' }} /> {customer.phone}</p>
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                            <button className="btn-outline" onClick={(e) => { e.stopPropagation(); setEditingCustomer(customer); setCustomerForm(customer); setIsCustomerModalOpen(true); }} style={{ padding: '0.4rem', border: 'none', display: 'flex', alignItems: 'center', color: '#2563eb' }}>
                              <Pencil size={18} />
                            </button>
                            <button className="btn-outline" onClick={(e) => { e.stopPropagation(); deleteCustomer(customer._id); }} style={{ padding: '0.4rem', color: '#ef4444', border: 'none', display: 'flex', alignItems: 'center' }}>
                              <Trash2 size={18} />
                            </button>
                            <ChevronRight size={20} color="#64748b" />
                          </div>
                        </div>
                      ))}
                    </div>
                  )) : (
                    <div style={{ padding: '2rem', textAlign: 'center', color: '#64748b' }}>No customers found.</div>
                  )}
                </div>
              </section>

              <aside>
                {selectedCustomer ? (
                  <div className="card">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '1.5rem' }}>
                      <div>
                        <h2 style={{ fontSize: '1.5rem', marginBottom: '0.25rem' }}>{selectedCustomer.name}</h2>
                        <p style={{ color: '#64748b' }}>{selectedCustomer.email}</p>
                      </div>
                      <button className="btn-primary" onClick={() => setIsApplianceModalOpen(true)}>
                        <Plus size={16} /> Add Sale
                      </button>
                    </div>

                    <div style={{ marginBottom: '1.5rem' }}>
                      <p style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.9rem', marginBottom: '0.5rem' }}>
                        <Home size={16} color="#64748b" /> {selectedCustomer.address}
                      </p>
                    </div>

                    <hr style={{ border: 'none', borderTop: '1px solid #e2e8f0', margin: '1.5rem 0' }} />

                    <h3 style={{ fontSize: '1rem', marginBottom: '1rem' }}>Sales History</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                      {customerSales.length > 0 ? customerSales.map(app => (
                        <div key={app._id} style={{ background: '#f8fafc', padding: '1rem', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <h4 style={{ fontSize: '0.95rem' }}>{app.brand} - {app.model_number}</h4>
                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                              <button onClick={() => { setEditingAppliance(app); setMultiAppliances([app]); setIsApplianceModalOpen(true); }} style={{ color: '#2563eb', background: 'none', border: 'none', cursor: 'pointer' }}>
                                <Pencil size={14} />
                              </button>
                              <button onClick={() => deleteAppliance(app._id)} style={{ color: '#ef4444', background: 'none', border: 'none', cursor: 'pointer' }}>
                                <Trash2 size={14} />
                              </button>
                            </div>
                          </div>
                          <p style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '0.25rem' }}>{app.category} | SN: {app.serial_number}</p>
                          <div style={{ marginTop: '0.75rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ fontWeight: 600, color: '#0f172a' }}>₹{app.price}</span>
                            <span style={{ fontSize: '0.75rem', color: '#64748b' }}>{new Date(app.purchase_date).toLocaleDateString()}</span>
                          </div>
                        </div>
                      )) : (
                        <p style={{ textAlign: 'center', color: '#64748b', padding: '1rem' }}>No sales records found.</p>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="card" style={{ textAlign: 'center', padding: '3rem 1.5rem', color: '#64748b' }}>
                    <User size={48} style={{ margin: '0 auto 1rem', opacity: 0.2 }} />
                    <p>Select a customer to view their details and sales history.</p>
                  </div>
                )}
              </aside>
            </div>
          </>
        )}

        {view === 'inventory' && (
          <div className="inventory-section">
            <div className="stats" style={{ marginBottom: '2rem' }}>
              <div className="stat-card">
                <h4>Unique Items</h4>
                <div className="value">{inventory.length}</div>
              </div>
              <div className="stat-card">
                <h4>Total Stock Value</h4>
                <div className="value">₹{inventory.reduce((acc, curr) => acc + (curr.cost * curr.quantity), 0).toLocaleString()}</div>
              </div>
              <div className="stat-card">
                <h4>Low Stock Items</h4>
                <div className="value" style={{ color: inventory.filter(i => i.quantity <= i.min_stock_level).length > 0 ? '#ef4444' : 'inherit' }}>
                  {inventory.filter(i => i.quantity <= i.min_stock_level).length}
                </div>
              </div>
            </div>

            <div className="card" style={{ padding: 0 }}>
              <div className="table-responsive">
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                  <thead>
                    <tr style={{ borderBottom: '2px solid #e2e8f0', color: '#64748b', fontSize: '0.85rem' }}>
                      <th style={{ padding: '1rem' }}>Product</th>
                      <th style={{ padding: '1rem' }}>Category</th>
                      <th style={{ padding: '1rem' }}>Cost</th>
                      <th style={{ padding: '1rem' }}>Selling Price</th>
                      <th style={{ padding: '1rem' }}>Stock</th>
                      <th style={{ padding: '1rem' }}>Status</th>
                      <th style={{ padding: '1rem' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {inventory.map(item => (
                      <tr key={item._id} style={{ borderBottom: '1px solid #e2e8f0' }}>
                        <td style={{ padding: '1rem' }}>
                          <div style={{ fontWeight: 600 }}>{item.brand}</div>
                          <div style={{ fontSize: '0.8rem', color: '#64748b' }}>{item.model_number}</div>
                        </td>
                        <td style={{ padding: '1rem' }}>{item.category}</td>
                        <td style={{ padding: '1rem' }}>₹{item.cost}</td>
                        <td style={{ padding: '1rem' }}>₹{item.price}</td>
                        <td style={{ padding: '1rem' }}>{item.quantity} units</td>
                        <td style={{ padding: '1rem' }}>
                          <span style={{ 
                            padding: '0.25rem 0.6rem', 
                            borderRadius: '99px', 
                            fontSize: '0.75rem', 
                            fontWeight: 600,
                            background: item.quantity <= item.min_stock_level ? '#fee2e2' : '#dcfce7',
                            color: item.quantity <= item.min_stock_level ? '#991b1b' : '#166534'
                          }}>
                            {item.quantity <= item.min_stock_level ? 'Low Stock' : 'In Stock'}
                          </span>
                        </td>
                        <td style={{ padding: '1rem' }}>
                          <div style={{ display: 'flex', gap: '0.5rem' }}>
                            <button className="btn-outline" onClick={() => { setEditingInventory(item); setInventoryForm(item); setIsInventoryModalOpen(true); }} style={{ padding: '0.4rem', border: 'none', color: '#2563eb' }}>
                              <Pencil size={18} />
                            </button>
                            <button className="btn-outline" onClick={() => deleteInventory(item._id)} style={{ padding: '0.4rem', color: '#ef4444', border: 'none' }}>
                              <Trash2 size={18} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {view === 'reports' && (
          <Reports sales={allSales} inventory={inventory} />
        )}
      </main>

      {/* Customer Modal */}
      {isCustomerModalOpen && (
        <div className="modal-overlay">
          <div className="modal">
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
              <h2>{editingCustomer ? 'Edit Customer' : 'Add New Customer'}</h2>
              <button onClick={() => { setIsCustomerModalOpen(false); setEditingCustomer(null); setCustomerForm({ name: '', email: '', phone: '', address: '' }); }} style={{ background: 'none', border: 'none' }}><X /></button>
            </div>
            <form onSubmit={handleCustomerSubmit}>
              <div className="form-group">
                <label>Name</label>
                <input required value={customerForm.name} onChange={e => setCustomerForm({...customerForm, name: e.target.value})} />
              </div>
              <div className="form-group">
                <label>Email</label>
                <input type="email" value={customerForm.email} onChange={e => setCustomerForm({...customerForm, email: e.target.value})} />
              </div>
              <div className="form-group">
                <label>Phone</label>
                <input required value={customerForm.phone} onChange={e => setCustomerForm({...customerForm, phone: e.target.value})} />
              </div>
              <div className="form-group">
                <label>Address</label>
                <textarea rows="3" value={customerForm.address} onChange={e => setCustomerForm({...customerForm, address: e.target.value})} />
              </div>
              <button type="submit" className="btn-primary" style={{ width: '100%', marginTop: '1rem' }}>Save Customer</button>
            </form>
          </div>
        </div>
      )}

      {/* Inventory Modal */}
      {isInventoryModalOpen && (
        <div className="modal-overlay">
          <div className="modal">
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
              <h2>{editingInventory ? 'Edit Stock Item' : 'Add New Stock'}</h2>
              <button onClick={() => { setIsInventoryModalOpen(false); setEditingInventory(null); setInventoryForm({ brand: '', model_number: '', category: 'Laptops', cost: '', price: '', quantity: '', min_stock_level: 5, description: '' }); }} style={{ background: 'none', border: 'none' }}><X /></button>
            </div>
            <form onSubmit={handleInventorySubmit}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label>Brand</label>
                  <input required value={inventoryForm.brand} onChange={e => setInventoryForm({...inventoryForm, brand: e.target.value})} />
                </div>
                <div className="form-group">
                  <label>Model Number</label>
                  <input required value={inventoryForm.model_number} onChange={e => setInventoryForm({...inventoryForm, model_number: e.target.value})} />
                </div>
              </div>
              <div className="form-group">
                <label>Category</label>
                <select value={inventoryForm.category} onChange={e => setInventoryForm({...inventoryForm, category: e.target.value})}>
                  <option value="Laptops">Laptops</option>
                  <option value="Desktops">Desktops</option>
                  <option value="Monitors">Monitors</option>
                  <option value="Printers">Printers</option>
                  <option value="Accessories">Accessories</option>
                </select>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label>Cost Price (₹)</label>
                  <input type="number" required value={inventoryForm.cost} onChange={e => setInventoryForm({...inventoryForm, cost: e.target.value})} />
                </div>
                <div className="form-group">
                  <label>Selling Price (₹)</label>
                  <input type="number" required value={inventoryForm.price} onChange={e => setInventoryForm({...inventoryForm, price: e.target.value})} />
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label>Initial Quantity</label>
                  <input type="number" required value={inventoryForm.quantity} onChange={e => setInventoryForm({...inventoryForm, quantity: e.target.value})} />
                </div>
                <div className="form-group">
                  <label>Min Stock Level</label>
                  <input type="number" value={inventoryForm.min_stock_level} onChange={e => setInventoryForm({...inventoryForm, min_stock_level: e.target.value})} />
                </div>
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea rows="2" value={inventoryForm.description} onChange={e => setInventoryForm({...inventoryForm, description: e.target.value})} />
              </div>
              <button type="submit" className="btn-primary" style={{ width: '100%', marginTop: '1rem' }}>Save Stock Item</button>
            </form>
          </div>
        </div>
      )}

      {/* Appliance Modal */}
      {isApplianceModalOpen && (
        <div className="modal-overlay">
          <div className="modal">
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
              <h2>{editingAppliance ? 'Edit Sale Record' : 'Add Sale Records'}</h2>
              <button onClick={() => { setIsApplianceModalOpen(false); setEditingAppliance(null); setMultiAppliances([{ brand: '', model_number: '', serial_number: '', category: 'Laptops', price: '', cost: '', purchase_date: '', warranty_expiration: '' }]); }} style={{ background: 'none', border: 'none' }}><X /></button>
            </div>
            <form onSubmit={handleApplianceSubmit}>
              <div style={{ maxHeight: '60vh', overflowY: 'auto', paddingRight: '10px' }}>
                {multiAppliances.map((item, index) => (
                  <div key={index} style={{ marginBottom: '2rem', padding: '1rem', background: '#f8fafc', borderRadius: '12px', border: '1px solid #e2e8f0', position: 'relative' }}>
                    {multiAppliances.length > 1 && !editingAppliance && (
                      <button onClick={() => removeMultiItem(index)} style={{ position: 'absolute', top: '-10px', right: '-10px', background: '#ef4444', color: 'white', border: 'none', borderRadius: '50%', width: '24px', height: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', zIndex: 1 }}><X size={14} /></button>
                    )}
                    <div className="form-group">
                      <label>Brand</label>
                      <input required value={item.brand} onChange={e => updateMultiAppliance(index, 'brand', e.target.value)} />
                    </div>
                    <div className="form-group">
                      <label>Model Number</label>
                      <input required value={item.model_number} onChange={e => updateMultiAppliance(index, 'model_number', e.target.value)} />
                    </div>
                    <div className="form-group">
                      <label>Category</label>
                      <select value={item.category} onChange={e => updateMultiAppliance(index, 'category', e.target.value)}>
                        <option value="Laptops">Laptops</option>
                        <option value="Desktops">Desktops</option>
                        <option value="Monitors">Monitors</option>
                        <option value="Printers">Printers</option>
                        <option value="Accessories">Accessories</option>
                      </select>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                      <div className="form-group">
                        <label>Cost Price (₹)</label>
                        <input type="number" required value={item.cost} onChange={e => updateMultiAppliance(index, 'cost', e.target.value)} />
                      </div>
                      <div className="form-group">
                        <label>Selling Price (₹)</label>
                        <input type="number" required value={item.price} onChange={e => updateMultiAppliance(index, 'price', e.target.value)} />
                      </div>
                    </div>
                    <div className="form-group">
                      <label>Serial Number</label>
                      <input required value={item.serial_number} onChange={e => updateMultiAppliance(index, 'serial_number', e.target.value)} />
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                      <div className="form-group">
                        <label>Purchase Date</label>
                        <input type="date" required value={item.purchase_date?.split('T')[0]} onChange={e => updateMultiAppliance(index, 'purchase_date', e.target.value)} />
                      </div>
                      <div className="form-group">
                        <label>Warranty Expiration</label>
                        <input type="date" required value={item.warranty_expiration?.split('T')[0]} onChange={e => updateMultiAppliance(index, 'warranty_expiration', e.target.value)} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {!editingAppliance && (
                <button type="button" onClick={addAnotherItem} className="btn-outline" style={{ width: '100%', marginBottom: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                  <PlusCircle size={18} /> Add Another Item
                </button>
              )}
              
              <button type="submit" className="btn-primary" style={{ width: '100%' }}>
                {editingAppliance ? 'Save Changes' : `Save ${multiAppliances.length} Sale Record${multiAppliances.length > 1 ? 's' : ''}`}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
