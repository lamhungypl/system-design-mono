import { Tabs, TabsList, TabsTrigger } from "~/hr-port/components/base/tabs"
import { useFieldsInfo } from "~/hr-port/features/profiles/providers/FieldsInfoProvider"

import useOpenedSection from "../../hooks/use-opened-section"

export type SectionTabsProps = {
  tabs: SectionTabProps[]
}

export type SectionTabProps = {
  id: number | string
  label: string
}

export default function SectionTabs({ tabs }: SectionTabsProps) {
  const { openSection, openedSectionId } = useOpenedSection()
  const { visibleSectionMap } = useFieldsInfo()

  return (
    <div className="sticky top-0 left-0 z-10 overflow-auto bg-white">
      <Tabs
        className="w-full pb-1"
        defaultValue={tabs[0]?.id.toString()}
        onValueChange={(id) => openSection(id)}
        value={openedSectionId}
      >
        <TabsList className="w-fit items-end justify-between gap-1 p-0">
          {tabs
            .filter((tab) => visibleSectionMap?.[tab.id] !== false)
            .map(({ id, label }) => (
              <TabsTrigger
                key={id}
                value={id.toString()}
                className="flex-1 font-bold data-[state=active]:border-[#f19100] data-[state=active]:text-[#f19100]"
              >
                {label}
              </TabsTrigger>
            ))}
        </TabsList>
      </Tabs>
    </div>
  )
}
