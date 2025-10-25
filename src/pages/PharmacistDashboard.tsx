import React, { useEffect, useState } from 'react';
import { api, setAuthToken } from '../api/api';
import { useNavigate } from 'react-router-dom';

interface Prescription {
  _id: string;
  patientName: string;
  medication: string;
  dosage: string;
  status: string;
}

interface InventoryItem {
  _id: string;
  name: string;
  stock: number;
}

export default function PharmacistDashboard() {
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }
    setAuthToken(token);

    // Fetch prescriptions
    api.get('/pharmacist/prescriptions')
      .then((res) => setPrescriptions(res.data))
      .catch(() =>
        setPrescriptions([
          { _id: '1', patientName: 'John Doe', medication: 'Amoxicillin', dosage: '500mg', status: 'Pending' },
          { _id: '2', patientName: 'Mary Wambui', medication: 'Paracetamol', dosage: '1g', status: 'Dispensed' },
        ])
      );

    // Fetch inventory
    api.get('/pharmacist/inventory')
      .then((res) => setInventory(res.data))
      .catch(() =>
        setInventory([
          { _id: '1', name: 'Paracetamol', stock: 120 },
          { _id: '2', name: 'Amoxicillin', stock: 45 },
        ])
      );
  }, [navigate]);

  const updateStock = (id: string) => {
    alert(`Stock updated for item ID: ${id}`);
  };

  return (
    <div className="container">
      <header className="header">
        <h2>Pharmacist Dashboard</h2>
        <div className="nav">
          <div className="userIcon">P</div>
        </div>
      </header>

      <section>
        <h3>💊 Prescriptions</h3>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ textAlign: 'left', borderBottom: '2px solid #ddd' }}>
              <th>Patient</th>
              <th>Medication</th>
              <th>Dosage</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {prescriptions.map((p) => (
              <tr key={p._id} style={{ borderBottom: '1px solid #eee' }}>
                <td>{p.patientName}</td>
                <td>{p.medication}</td>
                <td>{p.dosage}</td>
                <td>{p.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section style={{ marginTop: 32 }}>
        <h3>📦 Inventory</h3>
        <div className="grid">
          {inventory.map((item) => (
            <div className="card" key={item._id}>
              <h4>{item.name}</h4>
              <p>Stock: {item.stock}</p>
              <button className="btn" onClick={() => updateStock(item._id)}>
                Update Stock
              </button>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
