import { Check, X } from "lucide-react"

import IconButton from "~/hr-port/components/ui/icon-button/icon-button"

interface ButtonsProp {
  onCancelClick: (event: React.MouseEvent<HTMLElement>) => void
}
const Buttons = ({ onCancelClick }: ButtonsProp) => {
  return (
    <div className="flex items-center gap-1 bg-white p-0.5 pt-2 shadow-buttons-bar">
      <IconButton
        type="submit"
        className="rounded-[2px] bg-[#f2f2f2] hover:bg-[#091e4221]"
      >
        <Check className="h-4 w-4" />
      </IconButton>
      <IconButton
        onClick={onCancelClick}
        className="rounded-[2px] bg-[#f2f2f2] hover:bg-[#091e4221]"
      >
        <X className="h-4 w-4" />
      </IconButton>
    </div>
  )
}

export default Buttons
