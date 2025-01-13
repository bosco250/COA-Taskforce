import React, { useState } from 'react';

const Budget = () => {
  const [budgets, setBudgets] = useState([]);
  const [form, setForm] = useState({ category: '', amount: '', duration: 'weekly' });
  const [alerts, setAlerts] = useState([]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    const newBudget = { ...form, id: Date.now(), utilization: 0 };
    setBudgets([...budgets, newBudget]);
    setForm({ category: '', amount: '', duration: 'weekly' });
  };

  const handleUtilizationChange = (id, utilization) => {
    setBudgets(budgets.map(budget => 
      budget.id === id ? { ...budget, utilization } : budget
    ));
    if (utilization > 100) {
      setAlerts([...alerts, `Budget for ${budgets.find(b => b.id === id).category} exceeded!`]);
    }
  };

  return (
    <div className="font-sans text-sm p-4">
      <h1 className="text-xl font-semibold mb-4">Budget Management Page</h1>

      {/* Budget Form */}
      <form onSubmit={handleFormSubmit} className="space-y-4 mb-8">
        <div>
          <label className="block text-gray-700">Category:</label>
          <input 
            type="text" 
            name="category" 
            value={form.category} 
            onChange={handleInputChange} 
            required 
            className="mt-1 p-2 border border-gray-300 rounded-md w-full"
          />
        </div>
        <div>
          <label className="block text-gray-700">Amount:</label>
          <input 
            type="number" 
            name="amount" 
            value={form.amount} 
            onChange={handleInputChange} 
            required 
            className="mt-1 p-2 border border-gray-300 rounded-md w-full"
          />
        </div>
        <div>
          <label className="block text-gray-700">Duration:</label>
          <select 
            name="duration" 
            value={form.duration} 
            onChange={handleInputChange} 
            className="mt-1 p-2 border border-gray-300 rounded-md w-full"
          >
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
          </select>
        </div>
        <button type="submit" className="mt-4 bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600">Add Budget</button>
      </form>

      {/* Budget List */}
      <div>
        <h2 className="text-lg font-semibold mb-4">All Budgets</h2>
        {budgets.length === 0 ? (
          <p>No budgets added yet.</p>
        ) : (
          budgets.map(budget => (
            <div key={budget.id} className="border border-gray-300 p-4 mb-4 rounded-md shadow-md">
              <h3 className="font-semibold text-lg">{budget.category}</h3>
              <p>Amount: ${budget.amount}</p>
              <p>Duration: {budget.duration}</p>
              <div className="mt-4">
                <label className="block text-gray-700">Utilization: </label>
                <input 
                  type="number" 
                  value={budget.utilization} 
                  onChange={(e) => handleUtilizationChange(budget.id, parseInt(e.target.value))} 
                  className="mt-1 p-2 border border-gray-300 rounded-md w-full"
                />
                <div className="bg-gray-200 rounded-full overflow-hidden mt-2">
                  <div 
                    style={{ width: `${budget.utilization}%` }} 
                    className={`h-2 ${budget.utilization > 100 ? 'bg-red-500' : 'bg-green-500'}`}
                  />
                </div>
                {budget.utilization > 100 && <p className="text-red-500 mt-2">Budget exceeded!</p>}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Notifications */}
      <div>
        <h2 className="text-lg font-semibold mb-4">Notifications</h2>
        {alerts.length === 0 ? (
          <p>No notifications.</p>
        ) : (
          alerts.map((alert, index) => <p key={index} className="text-red-500">{alert}</p>)
        )}
      </div>
    </div>
  );
};

export default Budget;
