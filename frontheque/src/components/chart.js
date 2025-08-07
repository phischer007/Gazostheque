// import dynamic from 'next/dynamic';
// import { styled } from '@mui/material/styles';

// const ApexChart = dynamic(() => import('react-apexcharts'), {
//   ssr: false,
//   loading: () => null
// });

// export const Chart = styled(ApexChart)``;

import dynamic from 'next/dynamic';
import { styled } from '@mui/material/styles';

// Create a custom Chart component that only renders on client side
const ApexChart = dynamic(
  () => import('react-apexcharts'),
  { 
    ssr: false,
    loading: () => <div>Loading chart...</div>
  }
);

export const Chart = styled(ApexChart)``;