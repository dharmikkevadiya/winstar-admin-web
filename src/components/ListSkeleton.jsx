import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Skeleton from '@mui/material/Skeleton'

const ListSkeleton = () => {
  // You can adjust the number of skeletons and their appearance based on your UI requirements
  const skeletonCount = 5

  return (
    <Card>
      <CardContent>
        <Skeleton height={40} width={150} animation='wave' style={{ marginBottom: 20 }} />

        {Array.from({ length: skeletonCount }).map((_, index) => (
          <Skeleton key={index} height={60} animation='wave' variant='rectangular' style={{ marginBottom: 10 }} />
        ))}

        {/* Pagination Skeleton */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 20 }}>
          <Skeleton width={80} height={30} animation='wave' style={{ marginRight: 10 }} />
          <Skeleton width={80} height={30} animation='wave' style={{ marginRight: 10 }} />
          {/* Add more pagination skeleton components based on your design */}
        </div>
      </CardContent>
    </Card>
  )
}

export default ListSkeleton
