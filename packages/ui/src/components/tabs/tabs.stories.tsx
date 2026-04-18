import { Tabs, TabsList, TabsTrigger, TabsContent } from './tabs'

export const Basic = () => (
  <div style={{ width: 420 }}>
    <Tabs defaultValue="overview">
      <TabsList>
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="details">Dettagli</TabsTrigger>
        <TabsTrigger value="history">Storia</TabsTrigger>
      </TabsList>
      <TabsContent value="overview">Contenuto Overview</TabsContent>
      <TabsContent value="details">Contenuto Dettagli</TabsContent>
      <TabsContent value="history">Contenuto Storia</TabsContent>
    </Tabs>
  </div>
)

export const Disabled = () => (
  <div style={{ width: 420 }}>
    <Tabs defaultValue="a">
      <TabsList>
        <TabsTrigger value="a">Attivo</TabsTrigger>
        <TabsTrigger value="b" disabled>
          Disabled
        </TabsTrigger>
        <TabsTrigger value="c">Altro</TabsTrigger>
      </TabsList>
      <TabsContent value="a">A</TabsContent>
      <TabsContent value="c">C</TabsContent>
    </Tabs>
  </div>
)
