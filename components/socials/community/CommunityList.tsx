"use client"

import * as React from "react"
import { Check, ChevronsUpDown } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { useRouter } from "next/navigation"

interface Community {
  id: string
  name: string
  logo: string
  spaces: { id: string }[]
}

interface FormattedCommunity {
  value: string
  label: string
  logo: string
  spaces: { id: string }[]
}

interface CommunityListProps {
  communities: any[]
  setSelectedCommunity?: any;
}

const CommunityList = ({ communities, setSelectedCommunity }: CommunityListProps) => {
  const [open, setOpen] = React.useState(false)
  const [value, setValue] = React.useState("")
  const router = useRouter()

  const formattedCommunities = communities?.map((community) => ({
    value: community.id,
    label: community.name,
    logo: community.logo,
    spaces: community.spaces,
  }))

  React.useEffect(() => {
    if (formattedCommunities.length > 0 && !value) {
      const initialCommunity = formattedCommunities[0]
      setValue(initialCommunity.value)
      setSelectedCommunity?.(initialCommunity)
    }
  }, [formattedCommunities, setSelectedCommunity, value])

  const handleSelect = (communityValue: string) => {
    const selectedCommunity = formattedCommunities.find((c) => c.label === communityValue)
    if (selectedCommunity) {
      setValue(selectedCommunity.value)
      setSelectedCommunity?.(selectedCommunity)
      router.push(`/socials/community/${selectedCommunity.value}/${selectedCommunity.spaces[0]?.id}`)
      setOpen(false)
    }
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between border-none"
        >
          {value ? (
            <div className="flex items-center gap-2">
              <img
                src={
                  formattedCommunities.find((community) => community.value === value)?.logo ||
                  "/assets/community.svg"
                }
                alt="Community Avatar"
                className="rounded-full h-10 w-10 object-cover"
              />
              {formattedCommunities.find((community) => community.value === value)?.label}
            </div>
          ) : (
            "Select Community"
          )}
          <ChevronsUpDown className="opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full">
        <Command>
          <CommandInput placeholder="Search community..." />
          <CommandList>
            <CommandEmpty>No community found.</CommandEmpty>
            <CommandGroup>
              {formattedCommunities.map((community) => (
                <CommandItem
                  key={community.value}
                  value={community.value}
                  onSelect={handleSelect}
                  className="cursor-pointer"
                >
                  <img
                    src={community.logo || "/assets/community.svg"}
                    alt="Community Avatar"
                    className="rounded-full h-10 w-10 object-cover mr-2"
                  />
                  {community.label}
                  <Check
                    className={cn(
                      "ml-auto",
                      value === community.value ? "opacity-100" : "opacity-0"
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}

export default CommunityList