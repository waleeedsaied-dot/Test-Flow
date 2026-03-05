import * as React from "react"
import { X } from "lucide-react"
import { cn } from "@/lib/utils"

const Dialog = React.forwardRef(({ ...props }, ref) => {
  return <DialogRoot {...props} ref={ref} />
})
Dialog.displayName = "Dialog"

const DialogTrigger = React.forwardRef(({ ...props }, ref) => {
  return <DialogTriggerPrimitive {...props} ref={ref} />
})
DialogTrigger.displayName = "DialogTrigger"

const DialogPortal = Dialog.Portal

const DialogClose = React.forwardRef(({ ...props }, ref) => {
  return <DialogClosePrimitive {...props} ref={ref} />
})
DialogClose.displayName = "DialogClose"

const DialogHeader = ({ className, ...props }) => (
  <div
    className={cn("flex flex-col space-y-1.5 text-center sm:text-left", className)}
    {...props}
  />
)
DialogHeader.displayName = "DialogHeader"

const DialogFooter = ({ className, ...props }) => (
  <div
    className={cn("flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2", className)}
    {...props}
  />
)
DialogFooter.displayName = "DialogFooter"

const DialogTitle = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("text-lg font-semibold leading-none tracking-tight", className)}
    {...props}
  />
))
DialogTitle.displayName = "DialogTitle"

const DialogDescription = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
))
DialogDescription.displayName = "DialogDescription"

const DialogContent = React.forwardRef(({ className, children, ...props }, ref) => (
  <DialogPortal>
    <DialogOverlay />
    <DialogPrimitive ref={ref} className={cn("fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg", className)} {...props}>
      {children}
      <DialogClose className="absolute right-4 top-4 opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
        <X className="h-4 w-4" />
        <span className="sr-only">Close</span>
      </DialogClose>
    </DialogPrimitive>
  </DialogPortal>
))
DialogContent.displayName = "DialogContent"

// Simple Dialog implementation without Radix
function DialogRoot({ open, onOpenChange, children }) {
  const [isOpen, setIsOpen] = React.useState(open || false)
  
  React.useEffect(() => {
    if (open !== undefined) setIsOpen(open)
  }, [open])
  
  React.useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])
  
  const handleOpenChange = (open) => {
    setIsOpen(open)
    onOpenChange?.(open)
  }
  
  return (
    <>
      {React.Children.map(children, child => {
        if (child?.type?.displayName === 'DialogTrigger') {
          return React.cloneElement(child, { onClick: () => handleOpenChange(true) })
        }
        return null
      })}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div 
            className="fixed inset-0 bg-black/80" 
            onClick={() => handleOpenChange(false)}
          />
          {React.Children.map(children, child => {
            if (child?.type?.displayName === 'DialogContent') {
              return React.cloneElement(child, { 
                onClose: () => handleOpenChange(false)
              })
            }
            return null
          })}
        </div>
      )}
    </>
  )
}

const DialogTriggerPrimitive = ({ children, onClick, ...props }) => {
  return (
    <button onClick={onClick} {...props}>
      {children}
    </button>
  )
}
DialogTriggerPrimitive.displayName = 'DialogTrigger'

const DialogClosePrimitive = ({ children, onClick, ...props }) => {
  return (
    <button onClick={onClick} {...props}>
      {children}
    </button>
  )
}
DialogClosePrimitive.displayName = 'DialogClose'

const DialogOverlay = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("fixed inset-0 z-50 bg-black/80 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0", className)}
    {...props}
  />
))
DialogOverlay.displayName = "DialogOverlay"

const DialogPrimitive = React.forwardRef(({ className, children, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200",
      className
    )}
    {...props}
  >
    {children}
  </div>
))
DialogPrimitive.displayName = "DialogPrimitive"

Dialog.Trigger = DialogTrigger
Dialog.Portal = DialogPortal
Dialog.Close = DialogClose
Dialog.Header = DialogHeader
Dialog.Footer = DialogFooter
Dialog.Title = DialogTitle
Dialog.Description = DialogDescription
Dialog.Content = DialogContent

export {
  Dialog,
  DialogPortal,
  DialogOverlay,
  DialogTrigger,
  DialogClose,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
  DialogContent,
}
