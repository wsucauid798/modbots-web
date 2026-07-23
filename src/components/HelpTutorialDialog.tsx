import { X } from "lucide-react";

const tutorialItems = [
  {
    title: "Join",
    body: "Use the start screen to enter as a registered user or a guest.",
  },
  {
    title: "Send",
    body: "Write in the message box and send text, images, audio, video, or files.",
  },
  {
    title: "Address",
    body: "Type @ to address the room or a participant before sending.",
  },
  {
    title: "Reply",
    body: "Use the reply action on a message to keep the response connected.",
  },
  {
    title: "Inspect",
    body: "Use View to show participants, room information, rules, and activity.",
  },
];

export function HelpTutorialDialog({ onClose }: { onClose: () => void }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-6"
      onClick={onClose}
    >
      <div
        className="w-[min(460px,100%)] rounded-2xl border border-white/10 bg-[#111111] p-5 shadow-[0_24px_70px_rgba(0,0,0,0.6)]"
        onClick={(event) => event.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modbots-tutorial-title"
      >
        <div className="flex items-center justify-between gap-4">
          <h2
            id="modbots-tutorial-title"
            className="text-sm font-semibold text-white"
          >
            Tutorial
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-zinc-500 hover:bg-white/[0.06] hover:text-white"
            aria-label="Close tutorial"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <ol className="mt-4 space-y-3">
          {tutorialItems.map((item, index) => (
            <li key={item.title} className="flex gap-3">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-white/[0.04] text-[11px] font-semibold text-zinc-300">
                {index + 1}
              </span>
              <span className="min-w-0">
                <span className="block text-sm font-semibold text-zinc-100">
                  {item.title}
                </span>
                <span className="mt-0.5 block text-sm leading-5 text-zinc-400">
                  {item.body}
                </span>
              </span>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}
