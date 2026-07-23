import { Check } from "lucide-react";

export type MenuItemSpec =
  | {
      kind: "separator";
      id: string;
    }
  | {
      kind?: "action";
      id?: string;
      label: string;
      shortcut?: string;
      onSelect?: () => void;
      disabled?: boolean;
      checked?: boolean;
      title?: string;
    };

export interface MenuSpec<TMenuId extends string = string> {
  id: TMenuId;
  label: string;
  items: MenuItemSpec[];
}

export function MenuBar<TMenuId extends string>({
  menus,
  openMenu,
  onOpenMenu,
}: {
  menus: Array<MenuSpec<TMenuId>>;
  openMenu: TMenuId | null;
  onOpenMenu: (menu: TMenuId | null) => void;
}) {
  return (
    <div className="relative z-30 flex h-8 shrink-0 items-center gap-0.5 border-b border-white/[0.08] bg-[#0a0a0a] px-2.5">
      {menus.map((menu) => (
        <div key={menu.id} className="relative">
          <button
            type="button"
            onMouseDown={(event) => event.preventDefault()}
            onClick={() => onOpenMenu(openMenu === menu.id ? null : menu.id)}
            onMouseEnter={() => {
              if (openMenu !== null) {
                onOpenMenu(menu.id);
              }
            }}
            className={`rounded-md px-2.5 py-1 text-[12px] transition ${
              openMenu === menu.id
                ? "bg-white/[0.1] text-white"
                : "text-zinc-400 hover:bg-white/[0.06] hover:text-zinc-100"
            }`}
          >
            {menu.label}
          </button>
          {openMenu === menu.id ? (
            <div className="absolute left-0 top-full z-40 mt-0.5 min-w-[232px] rounded-lg border border-white/10 bg-[#151515] p-1 shadow-[0_16px_50px_rgba(0,0,0,0.5)]">
              {menu.items.map((item) =>
                item.kind === "separator" ? (
                  <div
                    key={item.id}
                    className="my-1 h-px bg-white/[0.08]"
                    role="separator"
                  />
                ) : (
                  <button
                    key={item.id ?? item.label}
                    type="button"
                    onMouseDown={(event) => event.preventDefault()}
                    disabled={item.disabled}
                    title={item.title}
                    onClick={() => {
                      onOpenMenu(null);
                      item.onSelect?.();
                    }}
                    className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-[12px] text-zinc-300 hover:bg-white/[0.07] hover:text-white disabled:cursor-not-allowed disabled:text-zinc-600 disabled:hover:bg-transparent"
                  >
                    <span className="flex w-4 shrink-0 justify-center text-zinc-400">
                      {item.checked ? <Check className="h-3.5 w-3.5" /> : null}
                    </span>
                    <span className="flex-1 truncate">{item.label}</span>
                    {item.shortcut ? (
                      <span className="text-[11px] tabular-nums text-zinc-600">
                        {item.shortcut}
                      </span>
                    ) : null}
                  </button>
                ),
              )}
            </div>
          ) : null}
        </div>
      ))}
    </div>
  );
}
