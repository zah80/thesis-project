import React from 'react';
import './MainContent.css';

const CustomerRow = ({ name, email, location, phone, signedUp }) => {
  return (
    <tr>
      <td>{name}</td>
      <td>{email}</td>
      <td>{location}</td>
      <td>{phone}</td>
      <td>{signedUp}</td>
    </tr>
  );
};

const MainContent = () => {
  const customers = [
    {
      name: 'Alcides Antonio',
      email: 'alcides.antonio@devias.io',
      location: 'Madrid, Comunidad de Madrid, Spain',
      phone: '908-691-3242',
      signedUp: 'Jul 29, 2024',
    },
    {
      name: 'Marcus Finn',
      email: 'marcus.finn@devias.io',
      location: 'Carson City, Nevada, USA',
      phone: '415-907-2647',
      signedUp: 'Jul 29, 2024',
    },
  ];

  return (
    <div className="main-content">
      <div className="customers-header">
        <h2>Customers</h2>
        <button className="add-button">Add</button>
      </div>
      <div className="customers-table">
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Location</th>
              <th>Phone</th>
              <th>Signed Up</th>
            </tr>
          </thead>
          <tbody>
            {customers.map((customer, index) => (
              <CustomerRow
                key={index}
                name={customer.name}
                email={customer.email}
                location={customer.location}
                phone={customer.phone}
                signedUp={customer.signedUp}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MainContent;
