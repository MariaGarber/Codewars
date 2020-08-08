import React from 'react';
import './ResultTable.css';

const ResultTable = ({ x }) => {
  return (
    <div>
      <table className='report-table'>
        <tr>
          <th>Tested values</th>
          <th>Users answer</th>
          <th>Expected answer</th>
          <th>Test Status</th>
        </tr>
        {x.o.map((element, index) => {
          return (
            <tr key={index}>
              <td> {element[0]} </td>
              <td> {element[1]}</td>
              <td> {element[2]}</td>
              <td> {element[3]}</td>
            </tr>
          );
        })}
      </table>
    </div>
  );
};

export default ResultTable;
