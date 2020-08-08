import React from 'react';
import Chart from 'react-apexcharts';
// import './Chart.css';

const ColumnChart = ({ losses, wins }) => {
  let state = {
    series: [{ name: '', data: [wins, losses] }],
    options: {
      chart: {
        toolbar: {
          show: false,
        },
        height: 250,
        type: 'bar',
        events: {
          click: function (chart, w, e) {},
        },
      },
      plotOptions: {
        bar: {
          columnWidth: '45%',
          distributed: true,
        },
      },
      dataLabels: { enabled: false },
      legend: { show: false },
      xaxis: {
        categories: ['Wins', 'Loses'],
        labels: {
          style: { fontSize: '12px' },
        },
      },
    },
  };

  return (
    <div className='chart-app'>
      <Chart
        options={state.options}
        series={state.series}
        type='bar'
        width='350px'
      />
    </div>
  );
};

export default ColumnChart;
