import React from 'react';
import TimelineComponent from '@components/Timeline/TimelineComponent';
import Card from '@mui/material/Card';
import PieChartComponent from '@components/charts/PieChart/PieChartComponent';
import { CardActionArea } from '@mui/material';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';

const Report = ({ product }) => {
  const data = [];
  return (
    <>
      <div>
        <Card sx={{ maxWidth: '45%', marginTop: 5, height: 400 }}>
          <CardActionArea>
            <CardContent>
              <Typography gutterBottom variant="h5" component="div">
                Cost estimate
              </Typography>
              <Typography>
                <PieChartComponent />
              </Typography>
            </CardContent>
          </CardActionArea>
        </Card>
        <Card sx={{ maxWidth: '100%', marginTop: 5, marginBottom: 5 }}>
          <CardActionArea>
            <CardContent>
              <Typography gutterBottom variant="h5" component="div">
                Timeline
              </Typography>
              <TimelineComponent />
            </CardContent>
          </CardActionArea>
        </Card>
      </div>
    </>
  );
};

export default Report;
