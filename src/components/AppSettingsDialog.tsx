import { X } from "lucide-react";

function ToggleRow({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}) {
  return (
    <label className="flex items-center justify-between gap-4 rounded-xl px-1 py-2 text-sm text-zinc-200">
      <span>{label}</span>
      <input
        type="checkbox"
        checked={checked}
        onChange={(event) => onChange(event.currentTarget.checked)}
        className="h-4 w-4 accent-white"
      />
    </label>
  );
}

export function AppSettingsDialog({
  sendWithEnter,
  showStatusBar,
  openParticipantsOnStart,
  openRoomInfoOnStart,
  onSendWithEnterChange,
  onShowStatusBarChange,
  onOpenParticipantsOnStartChange,
  onOpenRoomInfoOnStartChange,
  onClose,
}: {
  sendWithEnter: boolean;
  showStatusBar: boolean;
  openParticipantsOnStart: boolean;
  openRoomInfoOnStart: boolean;
  onSendWithEnterChange: (checked: boolean) => void;
  onShowStatusBarChange: (checked: boolean) => void;
  onOpenParticipantsOnStartChange: (checked: boolean) => void;
  onOpenRoomInfoOnStartChange: (checked: boolean) => void;
  onClose: () => void;
}) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-6"
      onClick={onClose}
    >
      <div
        className="w-[min(420px,100%)] rounded-2xl border border-white/10 bg-[#111111] p-5 shadow-[0_24px_70px_rgba(0,0,0,0.6)]"
        onClick={(event) => event.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modbots-settings-title"
      >
        <div className="flex items-center justify-between gap-4">
          <h2
            id="modbots-settings-title"
            className="text-sm font-semibold text-white"
          >
            Settings
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-zinc-500 hover:bg-white/[0.06] hover:text-white"
            aria-label="Close settings"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="mt-4 space-y-1">
          <ToggleRow
            label="Send with Enter"
            checked={sendWithEnter}
            onChange={onSendWithEnterChange}
          />
          <ToggleRow
            label="Show status bar"
            checked={showStatusBar}
            onChange={onShowStatusBarChange}
          />
          <ToggleRow
            label="Open participants at start"
            checked={openParticipantsOnStart}
            onChange={onOpenParticipantsOnStartChange}
          />
          <ToggleRow
            label="Open room information at start"
            checked={openRoomInfoOnStart}
            onChange={onOpenRoomInfoOnStartChange}
          />
        </div>
      </div>
    </div>
  );
}
