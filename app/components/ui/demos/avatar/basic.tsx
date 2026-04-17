import { Avatar, AvatarGroup } from "~/components/ui/avatar"
import { DemoSection } from "~/components/ui/demo-block"

function UserIcon() {
  return (
    <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="8" cy="5.5" r="2.5" />
      <path d="M2 13.5c0-3 2.686-5.5 6-5.5s6 2.5 6 5.5" />
    </svg>
  )
}

export default function AvatarBasicDemo() {
  return (
    <div className="flex flex-col gap-6">
      <DemoSection label="Sizes">
        <div className="flex items-end gap-3">
          <Avatar size="small">SM</Avatar>
          <Avatar>AB</Avatar>
          <Avatar size="large">LG</Avatar>
          <Avatar size={56}>56</Avatar>
        </div>
      </DemoSection>
      <DemoSection label="Shapes & image">
        <div className="flex items-center gap-3">
          <Avatar src="https://i.pravatar.cc/40?img=1" alt="User 1" />
          <Avatar icon={<UserIcon />} />
          <Avatar shape="square">SQ</Avatar>
          <Avatar shape="square" src="https://i.pravatar.cc/40?img=2" alt="User 2" />
        </div>
      </DemoSection>
      <DemoSection label="Group">
        <AvatarGroup max={4}>
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Avatar key={i} src={`https://i.pravatar.cc/40?img=${i}`} alt={`User ${i}`} />
          ))}
        </AvatarGroup>
      </DemoSection>
    </div>
  )
}
