import { clsx, type ClassValue } from "clsx"
import { extendTailwindMerge } from "tailwind-merge"

const twMerge = extendTailwindMerge({
  extend: {
    theme: {
      shadow: ["tile", "tile-hover", "card", "panel"],
      font: ["heading"],
      animate: ["enter"],
      ease: ["enter"],
    },
  },
})

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
