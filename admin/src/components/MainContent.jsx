import React from 'react';
import './MainContent.css';

const MainContent = () => {
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
            <tr>
              <td>Alcides Antonio</td>
              <td>alcides.antonio@devias.io</td>
              <td>Madrid, Comunidad de Madrid, Spain</td>
              <td>908-691-3242</td>
              <td>Jul 29, 2024</td>
            </tr>
            <tr>
              <td>Marcus Finn</td>
              <td>marcus.finn@devias.io</td>
              <td>Carson City, Nevada, USA</td>
              <td>415-907-2647</td>
              <td>Jul 29, 2024</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MainContent;
