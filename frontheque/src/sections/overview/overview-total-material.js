import PropTypes from 'prop-types';
import CircleStackIcon from '@heroicons/react/24/solid/CircleStackIcon';
import { Avatar, Card, CardContent, Stack, SvgIcon, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import config from 'src/utils/config';

export const OverviewTotalMaterials = (props) => {
  const { sx } = props;
  const [data, setData] = useState({
    total: 0,
    percentageDiff: 0,
    isPositive: false,
    isLoading: true,
    error: null
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${config.apiUrl}/materials/count`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const result = await response.json();
        setData({
          total: result.total_count,
          percentageDiff: result.percentage_diff,
          isPositive: result.is_positive,
          isLoading: false,
          error: null
        });
      } catch (error) {
        setData(prev => ({
          ...prev,
          isLoading: false,
          error: error.message
        }));
      }
    };

    fetchData();
  }, []);

  if (data.isLoading) {
    return (
      <Card sx={sx}>
        <CardContent>
          <Typography>Loading materials data...</Typography>
        </CardContent>
      </Card>
    );
  }

  if (data.error) {
    return (
      <Card sx={sx}>
        <CardContent>
          <Typography color="error">Error: {data.error}</Typography>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card sx={sx}>
      <CardContent>
        <Stack
          alignItems="flex-start"
          direction="row"
          justifyContent="space-between"
          spacing={3}
        >
          <Stack spacing={1}>
            <Typography
              color="text.secondary"
              variant="overline"
            >
              Nombre total de bouteilles
            </Typography>
            <Typography variant="h4">
              {data.total.toLocaleString() || 0} 
            </Typography>
          </Stack>
          <Avatar
            sx={{
              backgroundColor: 'primary.main',
              height: 56,
              width: 56
            }}
          >
            <SvgIcon>
              <CircleStackIcon />
            </SvgIcon>
          </Avatar>
        </Stack>
      </CardContent>
    </Card>
  );
};

OverviewTotalMaterials.propTypes = {
  sx: PropTypes.object
};