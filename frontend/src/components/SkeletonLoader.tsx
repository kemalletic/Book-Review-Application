import React from 'react';
import { Skeleton, Box, Card, CardContent, Grid } from '@mui/material';

interface SkeletonLoaderProps {
  type: 'book' | 'review' | 'profile' | 'list';
  count?: number;
}

const SkeletonLoader: React.FC<SkeletonLoaderProps> = ({ type, count = 1 }) => {
  const renderBookSkeleton = () => (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Skeleton variant="rectangular" height={200} />
      <CardContent>
        <Skeleton variant="text" height={32} width="80%" />
        <Skeleton variant="text" height={24} width="60%" />
        <Box sx={{ mt: 2 }}>
          <Skeleton variant="text" height={20} width="40%" />
        </Box>
      </CardContent>
    </Card>
  );

  const renderReviewSkeleton = () => (
    <Card sx={{ mb: 2 }}>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Skeleton variant="circular" width={40} height={40} />
          <Box sx={{ ml: 2, flex: 1 }}>
            <Skeleton variant="text" height={24} width="40%" />
            <Skeleton variant="text" height={20} width="30%" />
          </Box>
        </Box>
        <Skeleton variant="text" height={20} />
        <Skeleton variant="text" height={20} />
        <Skeleton variant="text" height={20} width="60%" />
      </CardContent>
    </Card>
  );

  const renderProfileSkeleton = () => (
    <Card>
      <CardContent>
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2 }}>
          <Skeleton variant="circular" width={120} height={120} />
          <Box sx={{ flex: 1 }}>
            <Skeleton variant="text" height={32} width="60%" />
            <Skeleton variant="text" height={24} width="40%" />
            <Box sx={{ mt: 2 }}>
              <Skeleton variant="text" height={20} width="80%" />
              <Skeleton variant="text" height={20} width="60%" />
            </Box>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );

  const renderListSkeleton = () => (
    <Grid container spacing={2}>
      {[...Array(count)].map((_, index) => (
        <Grid item xs={12} sm={6} md={4} key={index}>
          {renderBookSkeleton()}
        </Grid>
      ))}
    </Grid>
  );

  const renderContent = () => {
    switch (type) {
      case 'book':
        return renderBookSkeleton();
      case 'review':
        return renderReviewSkeleton();
      case 'profile':
        return renderProfileSkeleton();
      case 'list':
        return renderListSkeleton();
      default:
        return null;
    }
  };

  return (
    <Box sx={{ width: '100%' }}>
      {type === 'list' ? (
        renderContent()
      ) : (
        [...Array(count)].map((_, index) => (
          <Box key={index} sx={{ mb: type === 'review' ? 2 : 0 }}>
            {renderContent()}
          </Box>
        ))
      )}
    </Box>
  );
};

export default SkeletonLoader; 