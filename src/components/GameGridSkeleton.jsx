import { Button, Card, CardContent, Grid, Skeleton } from '@mui/material'

const GameGridSkeleton = () => {
  const skeletonItems = Array.from({ length: 10 }, (_, index) => index + 1) // Adjust the number of skeleton items as needed

  return (
    <Grid container spacing={3}>
      {/* Header Skeleton */}
      <Grid item container alignItems='center' xs={12} spacing={3}>
        {/* Left side title skeleton */}
        <Grid item xs={6}>
          <Skeleton height={40} width='80%' />
        </Grid>

        {/* Right side Add Game button skeleton */}
        <Grid item xs={6} container justifyContent='flex-end'>
          <Button variant='contained' color='primary' disabled>
            Add Game
          </Button>
        </Grid>
      </Grid>

      {/* Game Cards Skeleton */}
      {skeletonItems.map(index => (
        <Grid item key={index}>
          <Card style={{ width: '216px' }}>
            <Skeleton variant='rect' height={216} />

            <CardContent>
              <Skeleton height={20} width='80%' />
              <Skeleton height={12} width='60%' />
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  )
}

export default GameGridSkeleton
