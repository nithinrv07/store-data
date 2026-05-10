import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, Legend } from 'recharts';
import { TrendingUp, DollarSign, Package, ShoppingCart, ArrowUpRight, ArrowDownRight } from 'lucide-react';

const COLORS = ['#2563eb', '#7c3aed', '#db2777', '#ea580c', '#16a34a'];

const Reports = ({ sales, inventory = [] }) => {
  // Calculations
  const totalRevenue = sales.reduce((acc, curr) => acc + (curr.price || 0), 0);
  const totalCost = sales.reduce((acc, curr) => acc + (curr.cost || 0), 0);
  const totalProfit = totalRevenue - totalCost;
  const netProfitMargin = totalRevenue > 0 ? (totalProfit / totalRevenue) * 100 : 0;
  
  // Inventory Calculations
  const totalInventoryValue = inventory.reduce((acc, curr) => acc + ((curr.cost || 0) * (curr.quantity || 0)), 0);
  const lowStockItems = inventory.filter(item => item.quantity <= (item.min_stock_level || 5));

  // Category Data
  const categoryMap = sales.reduce((acc, curr) => {
    acc[curr.category] = (acc[curr.category] || 0) + (curr.price || 0);
    return acc;
  }, {});
  
  const categoryData = Object.keys(categoryMap).map(key => ({
    name: key,
    value: categoryMap[key]
  }));

  // Monthly Sales Analysis
  const salesByMonth = sales.reduce((acc, curr) => {
    const date = new Date(curr.purchase_date);
    const monthYear = date.toLocaleString('default', { month: 'short', year: 'numeric' });
    if (!acc[monthYear]) {
        acc[monthYear] = { name: monthYear, sales: 0, profit: 0, count: 0, timestamp: date.getTime() };
    }
    acc[monthYear].sales += curr.price || 0;
    acc[monthYear].profit += (curr.price || 0) - (curr.cost || 0);
    acc[monthYear].count += 1;
    return acc;
  }, {});

  // Sort by date
  const trendData = Object.values(salesByMonth).sort((a, b) => a.timestamp - b.timestamp);

  // Inventory Metrics
  const inventoryMetrics = [
    { label: 'Stock Value', value: `₹${totalInventoryValue.toLocaleString()}`, status: 'neutral' },
    { label: 'Low Stock Items', value: lowStockItems.length.toString(), status: lowStockItems.length > 0 ? 'down' : 'up' },
    { label: 'Total SKU', value: inventory.length.toString(), status: 'neutral' },
    { label: 'Avg Item Price', value: `₹${inventory.length > 0 ? (inventory.reduce((acc, c) => acc + (c.price || 0), 0) / inventory.length).toFixed(0) : 0}`, status: 'neutral' },
  ];

  // Top Sellers (Dynamic)
  const productSalesMap = sales.reduce((acc, curr) => {
    const key = `${curr.brand} ${curr.model_number}`;
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {});

  const topSellers = Object.keys(productSalesMap)
    .map(name => ({ name, count: productSalesMap[name] }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  return (
    <div className="reports-container" style={{ padding: '1rem 0', animation: 'fadeIn 0.5s ease-out' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.8rem', fontWeight: 700, marginBottom: '0.5rem' }}>Business Intelligence Report</h2>
        <p style={{ color: '#64748b' }}>Comprehensive monthly sales analysis and inventory health.</p>
      </div>

      {/* Executive Summary */}
      <div className="stats" style={{ marginBottom: '2rem' }}>
        <div className="stat-card" style={{ background: 'linear-gradient(135deg, #2563eb, #1d4ed8)', color: 'white' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h4>Total Revenue</h4>
            <DollarSign size={20} opacity={0.8} />
          </div>
          <div className="value" style={{ color: 'white' }}>₹{totalRevenue.toLocaleString()}</div>
          <p style={{ fontSize: '0.8rem', opacity: 0.9, marginTop: '0.5rem' }}>
            Lifetime sales value
          </p>
        </div>
        <div className="stat-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h4>Net Profit</h4>
            <TrendingUp size={20} color="#16a34a" />
          </div>
          <div className="value">₹{totalProfit.toLocaleString()}</div>
          <p style={{ fontSize: '0.8rem', color: '#16a34a', marginTop: '0.5rem' }}>
            Margin: {netProfitMargin.toFixed(1)}%
          </p>
        </div>
        <div className="stat-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h4>Total Transactions</h4>
            <ShoppingCart size={20} color="#7c3aed" />
          </div>
          <div className="value">{sales.length}</div>
          <p style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '0.5rem' }}>
            Avg Order: ₹{sales.length > 0 ? (totalRevenue / sales.length).toFixed(0) : 0}
          </p>
        </div>
        <div className="stat-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h4>Current Inventory</h4>
            <Package size={20} color="#ea580c" />
          </div>
          <div className="value" style={{ color: '#0f172a' }}>₹{totalInventoryValue.toLocaleString()}</div>
          <p style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '0.5rem' }}>
            Cost value of stock
          </p>
        </div>
      </div>

      <div className="dashboard-grid">
        {/* Sales Performance Metrics */}
        <div className="card">
          <h3 style={{ marginBottom: '1.5rem', fontSize: '1.1rem' }}>Monthly Sales Analysis</h3>
          <div style={{ height: '350px', width: '100%' }}>
            {trendData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={trendData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 10 }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 10 }} />
                  <Tooltip 
                    formatter={(value) => `₹${value.toLocaleString()}`}
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  />
                  <Legend iconType="circle" />
                  <Bar dataKey="sales" name="Total Sales" fill="#2563eb" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="profit" name="Net Profit" fill="#16a34a" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b', background: '#f8fafc', borderRadius: '8px' }}>
                Insufficient data for monthly analysis.
              </div>
            )}
          </div>
        </div>

        {/* Sales by Category */}
        <div className="card">
          <h3 style={{ marginBottom: '1.5rem', fontSize: '1.1rem' }}>Category Mix</h3>
          <div style={{ height: '350px', width: '100%' }}>
            {categoryData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => `₹${value.toLocaleString()}`} />
                  <Legend verticalAlign="bottom" height={36}/>
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b', background: '#f8fafc', borderRadius: '8px' }}>
                No category data.
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="dashboard-grid" style={{ marginTop: '2rem' }}>
        {/* Inventory Management */}
        <div className="card">
          <h3 style={{ marginBottom: '1.5rem', fontSize: '1.1rem' }}>Inventory Performance</h3>
          <div className="stats" style={{ margin: 0 }}>
            {inventoryMetrics.map((metric, i) => (
              <div key={i} style={{ padding: '1rem', background: '#f8fafc', borderRadius: '12px', border: '1px solid #f1f5f9' }}>
                <span style={{ fontSize: '0.8rem', color: '#64748b', display: 'block', marginBottom: '0.5rem' }}>{metric.label}</span>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '1rem', fontWeight: 700, color: '#0f172a' }}>{metric.value}</span>
                  {metric.status === 'up' ? (
                    <ArrowUpRight size={16} color="#16a34a" />
                  ) : metric.status === 'down' ? (
                    <ArrowDownRight size={16} color="#ef4444" />
                  ) : (
                    <span style={{ fontSize: '10px', color: '#94a3b8' }}>-</span>
                  )}
                </div>
              </div>
            ))}
          </div>
          
          <div style={{ marginTop: '1.5rem' }}>
            <h4 style={{ fontSize: '0.9rem', color: '#64748b', marginBottom: '1rem' }}>Best Selling Models</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {topSellers.length > 0 ? topSellers.map((item, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', padding: '0.5rem', background: i === 0 ? '#f0f7ff' : 'none', borderRadius: '6px' }}>
                  <span>{item.name}</span>
                  <span style={{ fontWeight: 600 }}>{item.count} units</span>
                </div>
              )) : (
                <p style={{ fontSize: '0.8rem', color: '#64748b' }}>No sales data available.</p>
              )}
            </div>
          </div>
        </div>

        {/* Action Items & Insights */}
        <div className="card" style={{ background: '#0f172a', color: 'white' }}>
          <h3 style={{ marginBottom: '1.5rem', fontSize: '1.1rem', color: 'white' }}>Inventory Alerts</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {lowStockItems.length > 0 ? (
              lowStockItems.map(item => (
                <div key={item.id} style={{ padding: '1rem', background: 'rgba(239, 68, 68, 0.1)', borderRadius: '10px', borderLeft: '4px solid #ef4444' }}>
                  <h4 style={{ fontSize: '0.9rem', marginBottom: '0.25rem', color: '#fca5a5' }}>Low Stock: {item.brand}</h4>
                  <p style={{ fontSize: '0.8rem', color: '#94a3b8' }}>{item.model_number} is running low ({item.quantity} left).</p>
                </div>
              ))
            ) : (
              <p style={{ fontSize: '0.8rem', color: '#94a3b8', textAlign: 'center', padding: '2rem' }}>
                All inventory levels are healthy.
              </p>
            )}
          </div>
          <button style={{ width: '100%', marginTop: '1.5rem', padding: '0.75rem', background: '#2563eb', border: 'none', borderRadius: '8px', color: 'white', fontWeight: 600, cursor: 'pointer' }}>
            Generate Procurement List
          </button>
        </div>
      </div>
    </div>
  );
};

export default Reports;
