

import ApexCharts from 'apexcharts';
import React from 'react';

const  HeatMapComponent = ({data = []})=>  {
    
    const newSeries =data.map(e => ({name: e.timestamp.substr(14,16), data: [19, 78, 6, 21, 62, 6, 27]}));
    console.log('heatMapData ====>  ', newSeries);
    var options = {
        series: newSeries,
        chart: {
            height: 350,
            type: 'heatmap',
        },
        dataLabels: {
            enabled: false
        },
        colors: ['#18D8D8',
            '#A9D794',
            '#46AF78',
            '#A93F55',
            '#8C5E58',
            '#2176FF',
            '#33A1FD',
            '#7A918D',
            '#BAFF29'],
        xaxis: {
            type: 'category',
            categories: [
                '10:00',
                '10:30',
                '11:00',
                '11:30',
                '12:00',
                '12:30',
                '01:00',
            ]
        },
        grid: {
            padding: {
                right: 20
            }
        },
        title: {
            text: 'HeatMap Chart (Single color)'
        },
    };

    var chart = new ApexCharts(document.querySelector('#chart'), options);
   
    chart.render();
    return  (<div>
        <h1>heatMap</h1>
        <div id="chart"></div>
    
       
    </div>);
  
};

export default HeatMapComponent;

