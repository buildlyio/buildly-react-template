import React from 'react'
import { Line } from 'react-chartjs-2'
import { Chart as ChartJS } from 'chart.js/auto'
import { Chart } from 'react-chartjs-2'
import makeStyles from '@mui/styles/makeStyles';

const useStyles = makeStyles((theme) => ({
    canvas: {
        position: "relative",
        top: "58px",
        [theme.breakpoints.up('md')]: {
            width: "70vw",
            left: "255px"
        },
    },
}));

const BarChart = () => {
    const classes = useStyles();

    const state = {
        labels: ['Jan 3rd', 'Jan 10th', 'Jan 17th',
            'Jan 24th', 'Jan 31st'],
        datasets: [
            {
                label: 'Backlog',
                fill: false,
                lineTension: 0.5,
                backgroundColor: '#bf8700',
                borderColor: 'rgba(0,0,0,1)',
                borderWidth: 2,
                data: [140, 142, 155, 159, 160]
            },
            {
                label: 'Sprint Ready',
                fill: false,
                lineTension: 0.5,
                backgroundColor: '#ec6547',
                borderColor: 'rgba(0,0,0,1)',
                borderWidth: 2,
                data: [110, 112, 115, 121, 123]
            },
            {
                label: 'In Progress',
                fill: false,
                lineTension: 0.5,
                backgroundColor: '#2da44e',
                borderColor: 'rgba(0,0,0,1)',
                borderWidth: 2,
                data: [100, 105, 111, 114, 120]
            },
            {
                label: 'Review In Progress',
                fill: false,
                lineTension: 0.5,
                backgroundColor: '#3485e1',
                borderColor: 'rgba(0,0,0,1)',
                borderWidth: 2,
                data: [97, 100, 104, 107, 111]
            },
            {
                label: 'Done',
                fill: false,
                lineTension: 0.5,
                backgroundColor: '#bf9fef',
                borderColor: 'rgba(0,0,0,1)',
                borderWidth: 2,
                data: [100, 105, 110, 115, 117]
            }
        ]
    }

    return (
        <div className={classes.canvas}>
            <Line
                data={state}
                options={{
                    maintainAspectRatio: true,
                    responsive: true,
                    tooltips: {
                        enabled: true,
                    },
                    legend: {
                        display: true,
                        position: 'right'
                    },
                    layout: {
                        padding: "50px 250px",
                    },
                }}
            />
        </div>
    );
}

export default BarChart

