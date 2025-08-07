import PropTypes from 'prop-types';
import {
  Box,
  Button,
  Card,
  CardContent,
  Stack,
  Typography
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { Chart } from 'src/components/chart';
import { useEffect, useState } from 'react';
import config from 'src/utils/config';

// ----------------------------------------------------------------- //

export const OverviewBarChart = (props) => {
  const { sx } = props;
  const theme = useTheme();
  const [chartData, setChartData] = useState({ 
    series: [], 
    years: [] 
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${config.apiUrl}/materials/bar-chart`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        console.log('Received data:', data);
        setChartData(data);
      } catch (error) {
        console.error('Error fetching material data:', error);
        setError(error.message)
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleRefresh = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${config.apiUrl}/materials/bar-chart/`);
      const data = await response.json();
      setChartData(data);
    } catch (error) {
      console.error('Error refreshing data:', error);
    } finally {
      setIsLoading(false);
    }
  };  

  const chartOptions = {
    chart: {
      type: 'bar',
      background: 'transparent',
      stacked: false,
      toolbar: { show: false },
      zoom: { enabled: false }
    },
    plotOptions: {
      bar: {
        horizontal: false,
        borderRadius: 4,
        columnWidth: '45%',
      },
    },
    dataLabels: { enabled: false },
    stroke: {
      show: true,
      width: 2,
      colors: ['transparent']
    },
    xaxis: {
      categories: chartData.years,
      title: { text: 'Année' },
      axisBorder: {
        show: true,
        color: theme.palette.divider
      },
      axisTicks: {
        show: true,
        color: theme.palette.divider
      },
      labels: {
        style: {
          colors: theme.palette.text.secondary
        }
      }
    },
    yaxis: {
      title: { text: 'Nombre de bouteilles' },
      min: 0,
      labels: {
        style: {
          colors: theme.palette.text.secondary
        }
      }
    },
    fill: { 
      opacity: 1,
      colors: [theme.palette.primary.light, theme.palette.success.main]
    },
    colors: [theme.palette.primary.light, theme.palette.success.main],
    legend: {
      position: 'top',
      horizontalAlign: 'right',
      labels: {
        colors: theme.palette.text.secondary
      }
    },
    tooltip: {
      y: {
        formatter: (val) => `${val} Bouteille${val !== 1 ? 's' : ''}`
      }
    },
    grid: {
      borderColor: theme.palette.divider,
      strokeDashArray: 2,
      xaxis: {
        lines: {
          show: false
        }
      },
      yaxis: {
        lines: {
          show: true
        }
      }
    }
  };

  if (isLoading) {
    return (
      <Card sx={sx}>
        <CardContent>
          <Typography>Aucune donnée disponible...</Typography>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card sx={sx}>
        <CardContent>
          <Typography color="error">Erreur: {error}</Typography>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card sx={sx}>
      <CardContent>
        <Stack spacing={2}>
          {/* Header row with title and button */}
          <Stack 
            direction="row" 
            justifyContent="space-between" 
            alignItems="center"
          >
            <Typography 
              color="text.secondary" 
              variant="overline"
            >
              Distribution annuelle de bouteilles par le laboratoire
            </Typography>
            
            <Button
              color="inherit"
              size="small"
              onClick={handleRefresh}
              disabled={isLoading}
            >
              {isLoading ? 'Chargement...' : 'Rafraîchi'}
            </Button>
          </Stack>

          {/* Chart with full width */}
          <Box sx={{ width: '100%', height: '100%' }}>
            <Chart
              height={450}
              options={chartOptions}
              series={chartData.series}
              type="bar"
              width="100%"
            />
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );
};

OverviewBarChart.propTypes = {
  sx: PropTypes.object
};