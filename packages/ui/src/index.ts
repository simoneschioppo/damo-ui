// Utilities
export { cn } from './lib/cn'

// Icons
export * from './icons'

// Foundations (Phase 3)
export { Box, type BoxProps, boxVariants, type BoxVariants } from './components/box'
export {
  Container,
  type ContainerProps,
  containerVariants,
  type ContainerVariants,
} from './components/container'
export { AspectRatio, type AspectRatioProps } from './components/aspect-ratio'
export {
  ScrollArea,
  ScrollBar,
  type ScrollAreaProps,
  type ScrollBarProps,
} from './components/scroll-area'
export {
  Separator,
  type SeparatorProps,
  separatorVariants,
  type SeparatorVariants,
} from './components/separator'
export { Ornament, type OrnamentProps } from './components/ornament'
export { FormField, type FormFieldProps } from './components/form-field'

// Tier 1 core (Phase 4)
export { Button, type ButtonProps, buttonVariants, type ButtonVariants } from './components/button'
export { IconButton, type IconButtonProps } from './components/icon-button'
export {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardBody,
  CardFooter,
  type CardProps,
  cardVariants,
  type CardVariants,
} from './components/card'
export {
  Dialog,
  DialogTrigger,
  DialogPortal,
  DialogClose,
  DialogOverlay,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
  type DialogContentProps,
} from './components/dialog'
export {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogPortal,
  AlertDialogOverlay,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogCancel,
  type AlertDialogContentProps,
} from './components/alert-dialog'
export {
  Drawer,
  DrawerTrigger,
  DrawerPortal,
  DrawerClose,
  DrawerOverlay,
  DrawerContent,
  DrawerHeader,
  DrawerBody,
  DrawerFooter,
  DrawerTitle,
  DrawerDescription,
  type DrawerContentProps,
} from './components/drawer'
export { Banner, type BannerProps, bannerVariants, type BannerVariants } from './components/banner'

export const __version = '0.0.2'
