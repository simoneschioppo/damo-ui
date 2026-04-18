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

const players = [
  { rank: 1, name: 'Korai', elo: 2150, wins: 124, losses: 18 },
  { rank: 2, name: 'MarinaChess', elo: 1987, wins: 98, losses: 24 },
  { rank: 3, name: 'Andrea', elo: 1842, wins: 72, losses: 31 },
  { rank: 4, name: 'Damo42', elo: 1610, wins: 45, losses: 29 },
  { rank: 5, name: 'Pezzomatto', elo: 1498, wins: 38, losses: 42 },
]

export const Basic = () => (
  <div style={{ width: 640 }}>
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>#</TableHead>
          <TableHead>Nome</TableHead>
          <TableHead>ELO</TableHead>
          <TableHead>Vittorie</TableHead>
          <TableHead>Sconfitte</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {players.map((p) => (
          <TableRow key={p.rank}>
            <TableCell className="font-mono">{p.rank}</TableCell>
            <TableCell className="font-semibold">{p.name}</TableCell>
            <TableCell className="font-mono">{p.elo}</TableCell>
            <TableCell>{p.wins}</TableCell>
            <TableCell>{p.losses}</TableCell>
          </TableRow>
        ))}
      </TableBody>
      <TableFooter>
        <TableRow>
          <TableCell colSpan={3}>Totale partite</TableCell>
          <TableCell>377</TableCell>
          <TableCell>144</TableCell>
        </TableRow>
      </TableFooter>
    </Table>
  </div>
)

export const WithCaption = () => (
  <div style={{ width: 640 }}>
    <Table>
      <TableCaption>Classifica top 5 — stagione 2026-Q1</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Nome</TableHead>
          <TableHead>ELO</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {players.slice(0, 3).map((p) => (
          <TableRow key={p.rank}>
            <TableCell>{p.name}</TableCell>
            <TableCell>{p.elo}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  </div>
)
