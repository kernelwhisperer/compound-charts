import DeleteIcon from "@mui/icons-material/Delete"
import FilterListIcon from "@mui/icons-material/FilterList"
import Box from "@mui/material/Box"
import Checkbox from "@mui/material/Checkbox"
import IconButton from "@mui/material/IconButton"
import { alpha } from "@mui/material/styles"
import Table from "@mui/material/Table"
import TableBody from "@mui/material/TableBody"
import TableCell from "@mui/material/TableCell"
import TableContainer from "@mui/material/TableContainer"
import TableHead from "@mui/material/TableHead"
import TablePagination from "@mui/material/TablePagination"
import TableRow from "@mui/material/TableRow"
import TableSortLabel from "@mui/material/TableSortLabel"
import Toolbar from "@mui/material/Toolbar"
import Tooltip from "@mui/material/Tooltip"
import Typography from "@mui/material/Typography"
import { visuallyHidden } from "@mui/utils"
import * as React from "react"
import { RobotoMonoFF, RobotoSerifFF } from "../theme"
import {
  TZ_OFFSET,
  formatHex,
  formatNumber,
  formatTime,
  formatTimeWithHour,
  formatUsdc,
  getExplorerLink,
} from "../utils/utils"
import { NETWORK_IMAGES, NETWORK_LABELS } from "../api/connections"
import { Avatar, Link, Stack } from "@mui/material"
import { LaunchRounded } from "@mui/icons-material"

function descendingComparator<T>(a: T, b: T, orderBy: keyof T) {
  if (b[orderBy] < a[orderBy]) {
    return -1
  }
  if (b[orderBy] > a[orderBy]) {
    return 1
  }
  return 0
}

type Order = "asc" | "desc"

function getComparator<Key extends keyof any>(
  order: Order,
  orderBy: Key
): (a: { [key in Key]: number | string }, b: { [key in Key]: number | string }) => number {
  return order === "desc"
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy)
}

function stableSort<T>(array: readonly T[], comparator: (a: T, b: T) => number) {
  const stabilizedThis = array.map((el, index) => [el, index] as [T, number])
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0])
    if (order !== 0) {
      return order
    }
    return a[1] - b[1]
  })
  return stabilizedThis.map((el) => el[0])
}

interface EnhancedTableHeadProps<T extends BaseObject> {
  headCells: readonly HeadCell<T>[]
  numSelected: number
  onRequestSort: (event: React.MouseEvent<unknown>, property: keyof T) => void
  onSelectAllClick: (event: React.ChangeEvent<HTMLInputElement>) => void
  order: Order
  orderBy: string
  rowCount: number
}

function EnhancedTableHead<T extends BaseObject>(props: EnhancedTableHeadProps<T>) {
  const { onSelectAllClick, headCells, order, orderBy, numSelected, rowCount, onRequestSort } =
    props
  const createSortHandler = (property: keyof T) => (event: React.MouseEvent<unknown>) => {
    onRequestSort(event, property)
  }

  return (
    <TableHead>
      <TableRow>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id as string}
            align={headCell.numeric ? "right" : "left"}
            padding={headCell.disablePadding ? "none" : "normal"}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : "asc"}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
              {orderBy === headCell.id ? (
                <Box component="span" sx={visuallyHidden}>
                  {order === "desc" ? "sorted descending" : "sorted ascending"}
                </Box>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  )
}

interface EnhancedTableToolbarProps {
  numSelected: number
}

function EnhancedTableToolbar(props: EnhancedTableToolbarProps) {
  const { numSelected } = props

  return (
    <Toolbar
      sx={{
        pl: { sm: 0 },
        pr: { sm: 1, xs: 1 },
        ...(numSelected > 0 && {
          bgcolor: (theme) =>
            alpha(theme.palette.primary.main, theme.palette.action.activatedOpacity),
        }),
      }}
    >
      <Typography
        sx={{ flex: "1 1 100%" }}
        variant="h6"
        id="tableTitle"
        component="div"
        fontFamily={RobotoSerifFF}
      >
        Explorer
      </Typography>
    </Toolbar>
  )
}

type BaseObject = Record<string, number | string> & {
  id: string | number
}

export interface HeadCell<T extends BaseObject> {
  disablePadding?: boolean
  id: keyof T
  label: string
  numeric?: boolean
}

type EnhancedTableProps<T extends BaseObject> = {
  headCells: readonly HeadCell<T>[]
  rows: T[]
}

export default function EnhancedTable<T extends BaseObject>(props: EnhancedTableProps<T>) {
  const { rows, headCells } = props
  const [order, setOrder] = React.useState<Order>("desc")
  const [orderBy, setOrderBy] = React.useState<keyof T>("timestamp")
  const [selected, setSelected] = React.useState<readonly string[]>([])
  const [page, setPage] = React.useState(0)
  const [dense, setDense] = React.useState(true)
  const [rowsPerPage, setRowsPerPage] = React.useState(10)

  const handleRequestSort = (event: React.MouseEvent<unknown>, property: keyof T) => {
    const isAsc = orderBy === property && order === "asc"
    setOrder(isAsc ? "desc" : "asc")
    setOrderBy(property)
  }

  const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const newSelected = rows.map((n) => n.id)
      setSelected(newSelected)
      return
    }
    setSelected([])
  }

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage)
  }

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10))
    setPage(0)
  }

  const handleChangeDense = (event: React.ChangeEvent<HTMLInputElement>) => {
    setDense(event.target.checked)
  }

  const isSelected = (name: string) => selected.indexOf(name) !== -1

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0

  const visibleRows = React.useMemo(
    () =>
      stableSort<T>(rows, getComparator(order, orderBy) as any).slice(
        page * rowsPerPage,
        page * rowsPerPage + rowsPerPage
      ),
    [rows, order, orderBy, page, rowsPerPage]
  )

  return (
    <Box sx={{ width: "100%" }}>
      <EnhancedTableToolbar numSelected={selected.length} />
      <TableContainer>
        <Table
          // sx={{ minWidth: 750 }}
          aria-labelledby="tableTitle"
          size={dense ? "small" : "medium"}
        >
          <EnhancedTableHead
            headCells={headCells}
            numSelected={selected.length}
            order={order}
            orderBy={orderBy as string}
            onSelectAllClick={handleSelectAllClick}
            onRequestSort={handleRequestSort}
            rowCount={rows.length}
          />
          <TableBody>
            {visibleRows.map((row, index) => {
              const isItemSelected = isSelected(row.id as string)
              const labelId = `enhanced-table-checkbox-${index}`

              return (
                <TableRow
                  hover
                  // onClick={(event) => handleClick(event, row.id as string)}
                  // role="checkbox"
                  aria-checked={isItemSelected}
                  tabIndex={-1}
                  key={row.id}
                  selected={isItemSelected}
                  sx={{ cursor: "external" }}
                >
                  {/* <TableCell padding="checkbox">
                    <Checkbox
                      color="primary"
                      checked={isItemSelected}
                      inputProps={{
                        "aria-labelledby": labelId,
                      }}
                    />
                  </TableCell> */}
                  {headCells.map((headCell) => (
                    <TableCell
                      key={headCell.id as string}
                      align={headCell.numeric ? "right" : "left"}
                      sx={{ fontFamily: headCell.numeric ? RobotoMonoFF : undefined }}
                    >
                      {!["Network", "Timestamp", "Tx hash", "Liquidator", "Collateral", "Liquidation price"].includes(
                        headCell.label
                      ) &&
                        (headCell.numeric
                          ? `${formatUsdc(row[headCell.id], 0, "compact")} USD`
                          : row[headCell.id])}
                      {headCell.label === "Liquidation price" && (
                        <>{formatNumber(row[headCell.id], 2, "standard")} USD</>
                      )}
                      {headCell.label === "Network" && (
                        <Stack direction="row" alignItems={"center"} gap={1}>
                          <Avatar
                            sx={{
                              width: 26,
                              height: 26,
                              "& > img ": {
                                transform: "scale(1.2)",
                              },
                              overflow: "hidden",
                            }}
                            src={NETWORK_IMAGES[row.networkIndex]}
                          />
                          {NETWORK_LABELS[row.networkIndex]}
                        </Stack>
                      )}
                      {headCell.label === "Timestamp" &&
                        formatTimeWithHour(row[headCell.id] * 1000 + TZ_OFFSET)}
                      {headCell.label === "Tx hash" && (
                        <Link
                          sx={{ "&:not(:hover)": { textDecoration: "none" } }}
                          target="_blank"
                          href={getExplorerLink(row.networkIndex, row[headCell.id], "tx")}
                          fontFamily={RobotoMonoFF}
                        >
                          <Stack direction="row" gap={0.5} alignItems={"center"}>
                            <span>{formatHex(row[headCell.id])}</span>
                            <LaunchRounded fontSize={"12px"} />
                          </Stack>
                        </Link>
                      )}
                      {headCell.label === "Liquidator" && (
                        <Link
                          sx={{ "&:not(:hover)": { textDecoration: "none" } }}
                          target="_blank"
                          href={getExplorerLink(row.networkIndex, row[headCell.id], "address")}
                          fontFamily={RobotoMonoFF}
                        >
                          <Stack direction="row" gap={0.5} alignItems={"center"}>
                            <span>{formatHex(row[headCell.id])}</span>
                            <LaunchRounded fontSize={"12px"} />
                          </Stack>
                        </Link>
                      )}
                      {headCell.label === "Collateral" && (
                        <Typography
                          key={index}
                          fontFamily={RobotoMonoFF}
                          variant="body2"
                          component="div"
                        >
                          {formatUsdc(
                            parseInt(row.amount) / 10 ** row.asset.token.decimals,
                            0,
                            "standard"
                          )}{" "}
                          <Stack
                            direction="row"
                            gap={0.5}
                            alignItems="baseline"
                            sx={{ display: "inline-flex" }}
                            component="span"
                          >
                            <Avatar
                              sx={{ width: 16, height: 16, alignSelf: "center" }}
                              src={`https://app.compound.finance/images/assets/asset_${row.asset.token.symbol
                                .replace("WBTC", "BTC")
                                .replace("ARB", "ARBITRUM")
                                .replace("WMATIC", "MATIC")}.svg`}
                            />
                            <span>{row.asset.token.symbol}</span>
                          </Stack>
                        </Typography>
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              )
            })}
            {emptyRows > 0 && (
              <TableRow
                style={{
                  height: (dense ? 33 : 53) * emptyRows,
                }}
              >
                <TableCell colSpan={6} />
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={rows.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Box>
  )
}
