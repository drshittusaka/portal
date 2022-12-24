
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Image from 'next/image';
import sunflower from '../public/sunflower.jpg'
import wintertree from '../public/wintertree.jpg'
import CardMedia from '@mui/material/CardMedia';



export default function BasicGrid() {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <Grid container spacing={0}>
        <Grid item xs={12} md={4}>
        <CardMedia
        component="img"
        height="200vh"
        image='/sunflower.jpg'
        alt="sunflower"
      />

      
        </Grid>
        <Grid item xs={12} md={8}>
        <CardMedia
        component="img"
        height="200vh"
        image='/wintertree.jpg'
        alt="wintertree"
      />
        </Grid>

        <Grid item ></Grid>
      
      </Grid>
    </Box>
  );
}
