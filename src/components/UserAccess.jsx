import {
  Card,
  CardContent,
  Checkbox,
  FormControlLabel,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Typography
} from '@mui/material'
import { Box } from '@mui/system'

export default function UserAccess({ accessData, setAccessData }) {
  const togglePermission = (index, subIndex, SubSubidx, checked) => {
    accessData[index].children[subIndex].permissions[SubSubidx].allowed = checked
    setAccessData(o => [...o])
  }

  return (
    <Card>
      <CardContent>
        <Box justifyContent={'space-between'} display={'flex'}>
          <Typography variant='h4' mb={2}>
            Role Permissions
          </Typography>
        </Box>
        <TableContainer>
          <Table size='small'>
            <TableBody>
              {accessData?.map((item, idx) => {
                // const id = i.toLowerCase().split(' ').join('-')
                return (
                  <TableRow key={idx}>
                    <TableCell
                      sx={{
                        fontWeight: 600,
                        whiteSpace: 'nowrap',
                        fontSize: theme => theme.typography.h6.fontSize
                      }}
                    >
                      {item.title}
                    </TableCell>
                    {item.children.map((subItem, subIdx) => (
                      <TableRow key={subIdx}>
                        <TableCell
                          sx={{
                            fontWeight: 600,
                            width: 300,
                            whiteSpace: 'nowrap',
                            fontSize: theme => theme.typography.h6.fontSize
                          }}
                        >
                          {subItem.title}
                        </TableCell>

                        <TableCell>
                          {subItem.permissions.map((subSubItem, SubSubidx) => (
                            <FormControlLabel
                              key={SubSubidx}
                              label={subSubItem.name}
                              sx={{ '& .MuiTypography-root': { color: 'text.secondary' } }}
                              control={
                                <Checkbox
                                  size='small'
                                  onChange={({ target: { checked } }) =>
                                    togglePermission(idx, subIdx, SubSubidx, checked)
                                  }
                                  checked={subSubItem.allowed}
                                />
                              }
                            />
                          ))}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </CardContent>
    </Card>
  )
}
