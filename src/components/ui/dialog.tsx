import { forwardRef } from "react"

const Dialog = ({ open, onOpenChange, children }: { open: boolean; onOpenChange: (open: boolean) => void; children: React.ReactNode }) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black/50" onClick={() => onOpenChange(false)} />
      <div className="relative z-50">{children}</div>
    </div>
  );
};

const DialogContent = forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(function DialogContentComponent({ className = "", ...props }, ref) {
  return (
    <div
      ref={ref}
      className={`relative w-full max-w-lg rounded-lg border p-6 shadow-lg ${className}`}
      {...props}
    />
  );
});

const DialogHeader = function DialogHeaderComponent({
  className = "",
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={`flex flex-col space-y-1.5 text-center sm:text-left ${className}`}
      {...props}
    />
  );
};

const DialogTitle = forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(function DialogTitleComponent({ className = "", ...props }, ref) {
  return (
    <h2
      ref={ref}
      className={`text-lg font-semibold ${className}`}
      {...props}
    />
  );
});

const DialogDescription = forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(function DialogDescriptionComponent({ className = "", ...props }, ref) {
  return (
    <p
      ref={ref}
      className={`text-sm text-muted-foreground ${className}`}
      {...props}
    />
  );
});

const DialogFooter = ({
  className = "",
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => {
  return (
    <div
      className={`flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2 ${className}`}
      {...props}
    />
  );
};

export { Dialog, DialogContent, DialogHeader, DialogFooter, DialogTitle, DialogDescription };
