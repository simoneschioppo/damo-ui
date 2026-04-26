import {
  Drawer,
  DrawerTrigger,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerBody,
  DrawerFooter,
  DrawerClose,
} from './drawer'
import { Button } from '../button/button'

export const Right = () => (
  <Drawer>
    <DrawerTrigger asChild>
      <Button>Apri da destra</Button>
    </DrawerTrigger>
    <DrawerContent side="right">
      <DrawerHeader>
        <DrawerTitle>Drawer destro</DrawerTitle>
        <DrawerDescription>Default side.</DrawerDescription>
      </DrawerHeader>
      <DrawerBody>
        <p style={{ fontSize: 14 }}>Contenuto laterale con scroll interno se serve.</p>
      </DrawerBody>
      <DrawerFooter>
        <DrawerClose asChild>
          <Button variant="ghost">Chiudi</Button>
        </DrawerClose>
      </DrawerFooter>
    </DrawerContent>
  </Drawer>
)

export const Left = () => (
  <Drawer>
    <DrawerTrigger asChild>
      <Button variant="ghost">Apri da sinistra</Button>
    </DrawerTrigger>
    <DrawerContent side="left">
      <DrawerHeader>
        <DrawerTitle>Navigation</DrawerTitle>
        <DrawerDescription>Menu laterale</DrawerDescription>
      </DrawerHeader>
      <DrawerBody>Voci di menu qui.</DrawerBody>
    </DrawerContent>
  </Drawer>
)

export const Top = () => (
  <Drawer>
    <DrawerTrigger asChild>
      <Button variant="secondary">Apri dall'alto</Button>
    </DrawerTrigger>
    <DrawerContent side="top">
      <DrawerHeader>
        <DrawerTitle>Notifica</DrawerTitle>
      </DrawerHeader>
      <DrawerBody>Banner a schermo intero dall'alto.</DrawerBody>
    </DrawerContent>
  </Drawer>
)

export const Bottom = () => (
  <Drawer>
    <DrawerTrigger asChild>
      <Button variant="destructive">Apri dal basso</Button>
    </DrawerTrigger>
    <DrawerContent side="bottom">
      <DrawerHeader>
        <DrawerTitle>Filtri</DrawerTitle>
        <DrawerDescription>Pannello filtri mobile-friendly.</DrawerDescription>
      </DrawerHeader>
      <DrawerBody>Contenuto filtri qui.</DrawerBody>
      <DrawerFooter>
        <DrawerClose asChild>
          <Button variant="ghost">Annulla</Button>
        </DrawerClose>
        <DrawerClose asChild>
          <Button>Applica</Button>
        </DrawerClose>
      </DrawerFooter>
    </DrawerContent>
  </Drawer>
)
