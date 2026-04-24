import {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableHead,
  TableRow,
  TableCell,
  TableCaption,
} from './table'

const users = [
  { id: 1, name: 'Korai', role: 'Designer', projects: 12, status: 'Active' },
  { id: 2, name: 'Marina', role: 'Engineer', projects: 9, status: 'Active' },
  { id: 3, name: 'Andrea', role: 'PM', projects: 7, status: 'Away' },
  { id: 4, name: 'Damo42', role: 'Engineer', projects: 5, status: 'Active' },
  { id: 5, name: 'Giulia', role: 'Designer', projects: 4, status: 'Offline' },
]

export const Basic = () => (
  <div style={{ width: 640 }}>
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>#</TableHead>
          <TableHead>Nome</TableHead>
          <TableHead>Ruolo</TableHead>
          <TableHead>Progetti</TableHead>
          <TableHead>Stato</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {users.map((u) => (
          <TableRow key={u.id}>
            <TableCell className="font-mono">{u.id}</TableCell>
            <TableCell className="font-semibold">{u.name}</TableCell>
            <TableCell>{u.role}</TableCell>
            <TableCell className="font-mono">{u.projects}</TableCell>
            <TableCell>{u.status}</TableCell>
          </TableRow>
        ))}
      </TableBody>
      <TableFooter>
        <TableRow>
          <TableCell colSpan={3}>Totale progetti</TableCell>
          <TableCell>37</TableCell>
          <TableCell>—</TableCell>
        </TableRow>
      </TableFooter>
    </Table>
  </div>
)

export const WithCaption = () => (
  <div style={{ width: 640 }}>
    <Table>
      <TableCaption>Team — Q1 2026</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Nome</TableHead>
          <TableHead>Ruolo</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {users.slice(0, 3).map((u) => (
          <TableRow key={u.id}>
            <TableCell>{u.name}</TableCell>
            <TableCell>{u.role}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  </div>
)
