import axios from 'axios';
import {Chart as ChartJs , LineElement, CategoryScale, LinearScale, PointElement} from 'chart.js';
import React, {useEffect, useState} from 'react';
import { Line } from 'react-chartjs-2';

import HeatMapComponent  from './HeatMap';

ChartJs.register(LineElement,CategoryScale,LinearScale, PointElement);


function Charts() {
    const [data, setData] = useState([]);
    const [dataType, setDataType] = useState('num_people');
   
    useEffect(() => {
    // Fetch data from backend API
        axios.get('http://localhost:9000/api/data')
            .then((response) => {
                setData(response.data);
            });
    }, []);

    // Get x-axis and y-axis data for the selected data type
    const getXData = () => {
        return data.map((d) => (new Date(d.timestamp)).toISOString().substring(14, 19));
    };

    const getYData = () => {
        if (dataType === 'num_people') {
            return data.map((d) => Object.keys(d.instances).length);
        } else if (dataType === 'x_pos') {
            return data.map((d) => d.instances[1]?.pos_x);
        }
    };

    // Chart configuration
    const chartData = {
        labels: getXData(),
        datasets: [
            {
                label: dataType,
                data: getYData(),
                fill: false,
                borderColor: 'rgba(75,192,192,1)',
                tension: 0.1,
            },
        ],
    };

    const chartOptions = {
        scales: {
            x: {
                // type: 'time',
                // time: {
                //     unit: 'minute',
                // },
            },
            y: {
                beginAtZero: true,
            },
        },
    };
    console.log(' x data ===> ', getXData());
    console.log('y data ===> ', getYData());
    console.log('data ===> ', data);
    //const heatMapData = data.map(d => ({x: d.instances[1]?.pos_x, y: d.instances[1]?.pos_y, value: Object.keys(d.instances).length, time: d.timestamp} ));
   
    return (
        <div>
            <div>
                <label>Data type:</label>
                <select onChange={(e) => setDataType(e.target.value)}>
                    <option value="num_people">Number of people</option>
                    <option value="x_pos">X position of human</option>
                </select>
            </div>
            <div>
                <Line data={chartData} options={chartOptions} />
            </div>
            <div>
                <HeatMapComponent data={data} />
            </div>
        </div>
    );
}

export default Charts;
