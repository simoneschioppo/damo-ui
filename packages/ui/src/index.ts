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
// AlertDialog is gone — its behaviour folded into `<DialogContent severity="alert" tone="danger">`.
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

// Form inputs (Phase 5)
export { Input, type InputProps } from './components/input'
export { Textarea, type TextareaProps } from './components/textarea'
export { Label, type LabelProps } from './components/label'
export { Checkbox } from './components/checkbox'
export { RadioGroup, RadioGroupItem } from './components/radio-group'
export { Switch } from './components/switch'
export { Slider } from './components/slider'
export {
  SegmentedControl,
  SegmentedControlItem,
  type SegmentedControlProps,
} from './components/segmented-control'
export {
  Select,
  SelectGroup,
  SelectValue,
  SelectTrigger,
  SelectContent,
  SelectLabel,
  SelectItem,
  SelectSeparator,
  SelectScrollUpButton,
  SelectScrollDownButton,
} from './components/select'
export {
  Popover,
  PopoverTrigger,
  PopoverAnchor,
  PopoverClose,
  PopoverContent,
} from './components/popover'
export { DatePicker, type DatePickerProps } from './components/date-picker'
export { Combobox, type ComboboxOption, type ComboboxProps } from './components/combobox'

// Feedback (Phase 6)
export { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from './components/tooltip'
export {
  ToastProvider,
  ToastViewport,
  Toast,
  ToastTitle,
  ToastDescription,
  ToastAction,
  ToastClose,
  type ToastProps,
} from './components/toast'
export { Progress, type ProgressProps } from './components/progress'
export { Spinner, type SpinnerProps } from './components/spinner'
export { Skeleton, type SkeletonProps } from './components/skeleton'
export { Badge, type BadgeProps, badgeVariants, type BadgeVariants } from './components/badge'
export { Chip, type ChipProps, chipVariants, type ChipVariants } from './components/chip'
export { Hint, type HintProps } from './components/hint'

// Navigation (Phase 7)
export { Tabs, TabsList, TabsTrigger, TabsContent } from './components/tabs'
export {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuGroup,
  DropdownMenuPortal,
  DropdownMenuSub,
  DropdownMenuRadioGroup,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuCheckboxItem,
  DropdownMenuRadioItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
} from './components/dropdown-menu'
export {
  ContextMenu,
  ContextMenuTrigger,
  ContextMenuGroup,
  ContextMenuPortal,
  ContextMenuSub,
  ContextMenuRadioGroup,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuCheckboxItem,
  ContextMenuRadioItem,
  ContextMenuLabel,
  ContextMenuSeparator,
  ContextMenuShortcut,
  ContextMenuSubTrigger,
  ContextMenuSubContent,
} from './components/context-menu'
export {
  NavItem,
  type NavItemProps,
  navItemVariants,
  type NavItemVariants,
} from './components/nav-item'
export {
  Breadcrumbs,
  BreadcrumbItem,
  type BreadcrumbsProps,
  type BreadcrumbItemProps,
} from './components/breadcrumbs'
export {
  Pagination,
  type PaginationProps,
  type PaginationLabels,
  computePageWindow,
  type PageItem,
  type PageWindowOptions,
} from './components/pagination'
export {
  AttrToggleGroup,
  type AttrToggleGroupProps,
  type AttrToggleGroupVariant,
  type AttrToggleOption,
} from './components/attr-toggle-group'
// NOTE: SettingsMenu has been removed too — Popover with the Memphis chrome
// covers the same use case more generically. Compose Popover with whatever
// content (radio sections, AttrToggleGroup instances, action lists) the
// surface needs. Theme-specific preset switchers (ThemeSwitcher,
// PaletteSwitcher, DensitySwitcher, DisplaySettingsMenu) were removed in an
// earlier cycle for the same reason — keep the lib generic.

// Data display (Phase 8)
export {
  Avatar,
  AvatarImage,
  AvatarFallback,
  AvatarGroup,
  type AvatarProps,
  type AvatarGroupProps,
} from './components/avatar'
export {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from './components/accordion'
export {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableHead,
  TableRow,
  TableCell,
  TableCaption,
} from './components/table'
export { Stat, type StatProps } from './components/stat'
export { Medal, type MedalProps, type MedalRank } from './components/medal'

// General-purpose product cards + brand decoration. (DS-only widgets —
// ShowcaseCard, SubPanel, SectionHeader, TypeSpecimen, ColorScale,
// TokenSwatch, PatternSwatch, TooltipCard — were trimmed from the public
// API; consumers building a documentation site can copy them from
// `apps/web/app/_components/showcase` in this monorepo.)
export { ColorPicker, type ColorPickerProps } from './components/color-picker'
export * from './components/memphis-shape'
export { UserCard, type UserCardProps } from './components/user-card'
export { FeatureCard, type FeatureCardProps } from './components/feature-card'
export { ArticleCard, type ArticleCardProps } from './components/article-card'

// Hooks
export { useResolvedCssVars } from './hooks/use-resolved-css-vars'
export { usePersistedAttr } from './hooks/use-persisted-attr'

// Layout (Phase 9)
export { AppShell, type AppShellProps } from './components/app-shell'
export { AppTopBar, type AppTopBarProps } from './components/app-top-bar'
export { PageHeader, type PageHeaderProps } from './components/page-header'
export {
  Sidebar,
  SidebarHeader,
  SidebarBrand,
  SidebarSubtitle,
  SidebarBody,
  SidebarFooter,
  type SidebarProps,
  sidebarVariants,
  type SidebarVariants,
} from './components/sidebar'

export const __version = '0.1.0'
