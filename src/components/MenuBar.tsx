"use client";

import type { LucideIcon } from "lucide-react";
import {
  BookOpen,
  Bug,
  Camera,
  ChevronLeft,
  ChevronRight,
  CircleHelp,
  ClipboardPaste,
  Copy,
  Download,
  FileText,
  Info,
  Lightbulb,
  Maximize2,
  Menu as MenuIcon,
  Minimize2,
  Monitor,
  Palette,
  Printer,
  Redo2,
  RefreshCw,
  RotateCcw,
  Scissors,
  Search,
  Settings2,
  SwatchBook,
  TextSelect,
  Undo2,
  Wrench,
  X,
  ZoomIn,
  ZoomOut,
} from "lucide-react";
import type { KeyboardEvent as ReactKeyboardEvent } from "react";
import { useEffect, useRef, useState } from "react";

type MenuId = "file" | "edit" | "view" | "tools" | "help";

type MenuItemSpec =
  | {
      kind: "separator";
      id: string;
    }
  | {
      kind?: "action";
      id: string;
      label: string;
      onSelect?: () => void;
      disabled?: boolean;
      icon: LucideIcon;
      shortcut?: string;
    }
  | {
      kind: "submenu";
      id: string;
      label: string;
      items: MenuItemSpec[];
      icon: LucideIcon;
    };

interface MenuSpec {
  id: MenuId;
  label: string;
  items: MenuItemSpec[];
  icon: LucideIcon;
}

const menuOrder: MenuId[] = ["file", "edit", "view", "tools", "help"];

function MenuItems({
  items,
  onAction,
}: {
  items: MenuItemSpec[];
  onAction: (action?: () => void) => void;
}) {
  const [openSubmenu, setOpenSubmenu] = useState<string | null>(null);

  return items.map((item) => {
    if (item.kind === "separator") {
      return (
        <hr
          key={item.id}
          className="my-1 border-0 border-t border-white/[0.08]"
        />
      );
    }

    if (item.kind === "submenu") {
      const submenuOpen = openSubmenu === item.id;
      const ItemIcon = item.icon;

      return (
        <div
          key={item.id}
          role="none"
          className="relative"
          onMouseEnter={() => setOpenSubmenu(item.id)}
          onMouseLeave={() =>
            setOpenSubmenu((current) => (current === item.id ? null : current))
          }
        >
          <button
            type="button"
            role="menuitem"
            aria-haspopup="menu"
            aria-expanded={submenuOpen}
            onClick={() =>
              setOpenSubmenu((current) =>
                current === item.id ? null : item.id,
              )
            }
            onKeyDown={(event) => {
              if (event.key === "ArrowRight") {
                event.preventDefault();
                event.stopPropagation();
                setOpenSubmenu(item.id);
              } else if (event.key === "ArrowLeft" && submenuOpen) {
                event.preventDefault();
                event.stopPropagation();
                setOpenSubmenu(null);
              }
            }}
            className="group flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-[clamp(11px,calc(1.364vw+2px),14px)] text-zinc-300 hover:bg-white/[0.07] hover:text-white focus-visible:bg-white/[0.07] focus-visible:text-white focus-visible:outline-none"
          >
            <ItemIcon className="h-3.5 w-3.5 shrink-0 text-zinc-500 group-hover:text-zinc-300" />
            <span className="flex-1 whitespace-nowrap">{item.label}</span>
            <ChevronRight className="h-3 w-3 shrink-0 text-zinc-500" />
          </button>

          {submenuOpen ? (
            <div
              role="menu"
              aria-label={item.label}
              className="absolute left-full top-0 z-50 ml-0.5 min-w-[224px] rounded-lg border border-white/10 bg-[#151515] p-1 shadow-[0_16px_50px_rgba(0,0,0,0.5)]"
            >
              <MenuItems items={item.items} onAction={onAction} />
            </div>
          ) : null}
        </div>
      );
    }

    const ItemIcon = item.icon;

    return (
      <button
        key={item.id}
        type="button"
        role="menuitem"
        disabled={item.disabled}
        onMouseDown={(event) => event.preventDefault()}
        onClick={() => onAction(item.onSelect)}
        className="group flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-[clamp(11px,calc(1.364vw+2px),14px)] text-zinc-300 hover:bg-white/[0.07] hover:text-white focus-visible:bg-white/[0.07] focus-visible:text-white focus-visible:outline-none disabled:cursor-not-allowed disabled:text-zinc-600 disabled:hover:bg-transparent"
      >
        <ItemIcon className="h-3.5 w-3.5 shrink-0 text-zinc-500 group-hover:text-zinc-300" />
        <span className="flex-1 whitespace-nowrap">{item.label}</span>
        {item.shortcut !== undefined ? (
          <span className="ml-4 shrink-0 text-[clamp(10px,calc(1.25vw+2px),13px)] tabular-nums text-zinc-600">
            {item.shortcut}
          </span>
        ) : null}
      </button>
    );
  });
}

function MobileMenu({
  menus,
  onAction,
}: {
  menus: MenuSpec[];
  onAction: (action?: () => void) => void;
}) {
  const [path, setPath] = useState<
    Array<{ id: string; label: string; items: MenuItemSpec[] }>
  >([]);
  const current = path.at(-1);
  const items: MenuItemSpec[] =
    current?.items ??
    menus.map((menu) => ({
      kind: "submenu",
      id: menu.id,
      label: menu.label,
      items: menu.items,
      icon: menu.icon,
    }));

  return (
    <div
      role="menu"
      aria-label={current?.label ?? "Application menu"}
      className="w-full p-1"
    >
      {current !== undefined ? (
        <div className="mb-1 flex h-8 items-center border-b border-white/[0.08] px-1">
          <button
            type="button"
            aria-label="Back"
            title="Back"
            onClick={() => setPath((currentPath) => currentPath.slice(0, -1))}
            className="flex h-7 w-7 shrink-0 items-center justify-center rounded text-zinc-400 hover:bg-white/[0.07] hover:text-white focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white/40"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <span className="min-w-0 flex-1 truncate px-1 text-[14px] font-semibold text-zinc-200">
            {current.label}
          </span>
        </div>
      ) : null}

      {items.map((item) => {
        if (item.kind === "separator") {
          return (
            <hr
              key={item.id}
              className="my-1 border-0 border-t border-white/[0.08]"
            />
          );
        }

        if (item.kind === "submenu") {
          const ItemIcon = item.icon;

          return (
            <button
              key={item.id}
              type="button"
              role="menuitem"
              onClick={() =>
                setPath((currentPath) => [
                  ...currentPath,
                  { id: item.id, label: item.label, items: item.items },
                ])
              }
              className="group flex h-9 w-full items-center gap-2.5 rounded px-2 text-left text-[14px] font-medium text-zinc-200 hover:bg-white/[0.08] focus-visible:bg-white/[0.08] focus-visible:outline-none"
            >
              <ItemIcon className="h-4 w-4 shrink-0 text-zinc-500 group-hover:text-zinc-300" />
              <span className="min-w-0 flex-1 truncate">{item.label}</span>
              <ChevronRight className="h-3.5 w-3.5 shrink-0 text-zinc-500" />
            </button>
          );
        }

        const ItemIcon = item.icon;

        return (
          <button
            key={item.id}
            type="button"
            role="menuitem"
            disabled={item.disabled}
            onClick={() => onAction(item.onSelect)}
            className="group flex min-h-9 w-full items-center gap-2.5 rounded px-2 py-1.5 text-left text-[14px] font-medium text-zinc-200 hover:bg-white/[0.08] focus-visible:bg-white/[0.08] focus-visible:outline-none disabled:cursor-not-allowed disabled:text-zinc-600 disabled:hover:bg-transparent"
          >
            <ItemIcon className="h-4 w-4 shrink-0 text-zinc-500 group-hover:text-zinc-300" />
            <span className="min-w-0 flex-1 truncate">{item.label}</span>
            {item.shortcut !== undefined ? (
              <span className="shrink-0 text-[12px] font-normal tabular-nums text-zinc-600">
                {item.shortcut}
              </span>
            ) : null}
          </button>
        );
      })}
    </div>
  );
}

export function MenuBar({
  onFindInChat,
  onOpenPreferences,
  onRefreshChatroom,
  onTakeScreenshot,
  onExportChatLog,
}: {
  onFindInChat: () => void;
  onOpenPreferences: () => void;
  onRefreshChatroom: () => void;
  onTakeScreenshot: () => void;
  onExportChatLog: () => void;
}) {
  const [openMenu, setOpenMenu] = useState<MenuId | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const menuBarRef = useRef<HTMLDivElement>(null);
  const editTargetRef = useRef<HTMLElement | null>(null);
  const menuButtonRefs = useRef<
    Partial<Record<MenuId, HTMLButtonElement | null>>
  >({});

  const rememberEditTarget = (candidate: EventTarget | null) => {
    if (
      candidate instanceof HTMLElement &&
      (candidate.matches("input, textarea") || candidate.isContentEditable)
    ) {
      editTargetRef.current = candidate;
    }
  };

  const runEditCommand = (
    command: "undo" | "redo" | "cut" | "copy" | "paste" | "selectAll",
  ) => {
    editTargetRef.current?.focus();
    document.execCommand(command);
  };

  const menus: MenuSpec[] = [
    {
      id: "file",
      label: "File",
      icon: FileText,
      items: [
        {
          id: "print",
          label: "Print",
          icon: Printer,
          shortcut: "Ctrl+P",
          onSelect: () => window.print(),
        },
        {
          id: "preferences",
          label: "Preferences",
          icon: Settings2,
          shortcut: "Ctrl+,",
          onSelect: onOpenPreferences,
        },
        { kind: "separator", id: "file-close" },
        {
          id: "close",
          label: "Close",
          icon: X,
          shortcut: "Ctrl+W",
          onSelect: () => window.close(),
        },
      ],
    },
    {
      id: "edit",
      label: "Edit",
      icon: TextSelect,
      items: [
        {
          id: "undo",
          label: "Undo",
          icon: Undo2,
          shortcut: "Ctrl+Z",
          onSelect: () => runEditCommand("undo"),
        },
        {
          id: "redo",
          label: "Redo",
          icon: Redo2,
          shortcut: "Ctrl+Y",
          onSelect: () => runEditCommand("redo"),
        },
        { kind: "separator", id: "edit-history" },
        {
          id: "cut",
          label: "Cut",
          icon: Scissors,
          shortcut: "Ctrl+X",
          onSelect: () => runEditCommand("cut"),
        },
        {
          id: "copy",
          label: "Copy",
          icon: Copy,
          shortcut: "Ctrl+C",
          onSelect: () => runEditCommand("copy"),
        },
        {
          id: "paste",
          label: "Paste",
          icon: ClipboardPaste,
          shortcut: "Ctrl+V",
          onSelect: () => runEditCommand("paste"),
        },
        {
          id: "select-all",
          label: "Select All",
          icon: TextSelect,
          shortcut: "Ctrl+A",
          onSelect: () => runEditCommand("selectAll"),
        },
        { kind: "separator", id: "edit-find" },
        {
          id: "find-in-chat",
          label: "Find in Chat",
          icon: Search,
          shortcut: "Ctrl+F",
          onSelect: onFindInChat,
        },
      ],
    },
    {
      id: "view",
      label: "View",
      icon: Monitor,
      items: [
        {
          kind: "submenu",
          id: "documentation",
          label: "Documentation",
          icon: BookOpen,
          items: [
            {
              id: "release-notes",
              label: "Release Notes",
              icon: FileText,
            },
            {
              id: "terms-and-conditions",
              label: "Terms and Conditions",
              icon: FileText,
            },
          ],
        },
        {
          kind: "submenu",
          id: "appearance",
          label: "Appearance",
          icon: Palette,
          items: [
            {
              kind: "submenu",
              id: "theme",
              label: "Theme",
              icon: SwatchBook,
              items: [
                { id: "preset-theme", label: "Preset", icon: Palette },
                { id: "custom-theme", label: "Custom", icon: Settings2 },
              ],
            },
            {
              kind: "submenu",
              id: "zoom",
              label: "Zoom",
              icon: ZoomIn,
              items: [
                {
                  id: "zoom-in",
                  label: "Zoom In",
                  icon: ZoomIn,
                  shortcut: "Ctrl++",
                },
                {
                  id: "zoom-out",
                  label: "Zoom Out",
                  icon: ZoomOut,
                  shortcut: "Ctrl+-",
                },
                {
                  id: "reset-zoom",
                  label: "Reset Zoom",
                  icon: RotateCcw,
                  shortcut: "Ctrl+0",
                },
              ],
            },
          ],
        },
        {
          kind: "submenu",
          id: "window",
          label: "Window",
          icon: Monitor,
          items: [
            { id: "minimize", label: "Minimize", icon: Minimize2 },
            { id: "restore", label: "Restore", icon: RotateCcw },
            { id: "maximize", label: "Maximize", icon: Maximize2 },
          ],
        },
      ],
    },
    {
      id: "tools",
      label: "Tools",
      icon: Wrench,
      items: [
        {
          id: "refresh-chatroom",
          label: "Refresh the Chatroom",
          icon: RefreshCw,
          onSelect: onRefreshChatroom,
        },
        {
          id: "take-screenshot",
          label: "Take a Screenshot",
          icon: Camera,
          onSelect: onTakeScreenshot,
        },
        {
          id: "export-chat-log",
          label: "Export Chat Log",
          icon: Download,
          onSelect: onExportChatLog,
        },
      ],
    },
    {
      id: "help",
      label: "Help",
      icon: CircleHelp,
      items: [
        { id: "getting-started", label: "Getting Started", icon: BookOpen },
        { id: "report-problem", label: "Report a Problem", icon: Bug },
        {
          id: "request-feature",
          label: "Request a Feature",
          icon: Lightbulb,
        },
        {
          id: "check-updates",
          label: "Check for Updates",
          icon: RefreshCw,
        },
        { kind: "separator", id: "help-about" },
        { id: "about", label: "About Mod Bots", icon: Info },
      ],
    },
  ];

  const focusMenuItem = (menuId: MenuId, edge: "first" | "last" = "first") => {
    requestAnimationFrame(() => {
      const menu = menuBarRef.current?.querySelector<HTMLElement>(
        `#modbots-menu-${menuId}`,
      );
      const items = Array.from(
        menu?.querySelectorAll<HTMLButtonElement>(
          '[role^="menuitem"]:not(:disabled)',
        ) ?? [],
      );
      const item = edge === "first" ? items[0] : items.at(-1);
      item?.focus();
    });
  };

  const openAndFocus = (menuId: MenuId, edge: "first" | "last" = "first") => {
    setOpenMenu(menuId);
    focusMenuItem(menuId, edge);
  };

  const adjacentMenu = (menuId: MenuId, direction: -1 | 1): MenuId => {
    const currentIndex = menuOrder.indexOf(menuId);
    return menuOrder[
      (currentIndex + direction + menuOrder.length) % menuOrder.length
    ];
  };

  const handleMenuButtonKeyDown = (
    event: ReactKeyboardEvent<HTMLButtonElement>,
    menuId: MenuId,
  ) => {
    if (
      event.key === "ArrowDown" ||
      event.key === "Enter" ||
      event.key === " "
    ) {
      event.preventDefault();
      openAndFocus(menuId);
      return;
    }

    if (event.key === "ArrowUp") {
      event.preventDefault();
      openAndFocus(menuId, "last");
      return;
    }

    if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
      event.preventDefault();
      const direction = event.key === "ArrowLeft" ? -1 : 1;
      const nextMenu = adjacentMenu(menuId, direction);
      menuButtonRefs.current[nextMenu]?.focus();

      if (openMenu !== null) {
        setOpenMenu(nextMenu);
      }
    }
  };

  const handleMenuKeyDown = (
    event: ReactKeyboardEvent<HTMLDivElement>,
    menuId: MenuId,
  ) => {
    const items = Array.from(
      event.currentTarget.querySelectorAll<HTMLButtonElement>(
        '[role^="menuitem"]:not(:disabled)',
      ),
    );
    const currentIndex = items.indexOf(
      document.activeElement as HTMLButtonElement,
    );

    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault();
      const direction = event.key === "ArrowDown" ? 1 : -1;
      const nextIndex =
        (currentIndex + direction + items.length) % items.length;
      items[nextIndex]?.focus();
      return;
    }

    if (event.key === "Home" || event.key === "End") {
      event.preventDefault();
      items[event.key === "Home" ? 0 : items.length - 1]?.focus();
      return;
    }

    if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
      event.preventDefault();
      const direction = event.key === "ArrowLeft" ? -1 : 1;
      openAndFocus(adjacentMenu(menuId, direction));
      return;
    }

    if (event.key === "Escape") {
      event.preventDefault();
      setOpenMenu(null);
      menuButtonRefs.current[menuId]?.focus();
      return;
    }

    if (event.key === "Tab") {
      setOpenMenu(null);
    }
  };

  useEffect(() => {
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape" && (openMenu !== null || mobileOpen)) {
        setOpenMenu(null);
        setMobileOpen(false);

        if (openMenu !== null) {
          menuButtonRefs.current[openMenu]?.focus();
        }
      }
    };

    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [mobileOpen, openMenu]);

  return (
    <>
      {openMenu !== null || mobileOpen ? (
        <button
          type="button"
          tabIndex={-1}
          aria-label="Close menu"
          className="fixed inset-0 z-20"
          onMouseDown={() => {
            setOpenMenu(null);
            setMobileOpen(false);
          }}
        />
      ) : null}

      <div
        ref={menuBarRef}
        className="relative z-30 flex h-11 shrink-0 items-center border-b border-white/[0.08] bg-[#101010] px-2 shadow-[0_1px_0_rgba(0,0,0,0.45)] sm:h-8 sm:bg-[#0a0a0a] sm:px-2.5 sm:shadow-none"
      >
        <button
          type="button"
          aria-label="Open application menu"
          title="Menu"
          aria-haspopup="menu"
          aria-expanded={mobileOpen}
          onFocus={(event) => rememberEditTarget(event.relatedTarget)}
          onMouseDown={() => rememberEditTarget(document.activeElement)}
          onClick={() => {
            setOpenMenu(null);
            setMobileOpen((open) => !open);
          }}
          className="flex h-9 w-9 items-center justify-center rounded text-zinc-400 hover:bg-white/[0.07] hover:text-white focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white/40 sm:hidden"
        >
          <MenuIcon className="h-[18px] w-[18px]" />
        </button>
        <span className="ml-1 text-[12px] font-semibold text-zinc-200 sm:hidden">
          Mod Bots
        </span>

        {mobileOpen ? (
          <div className="absolute left-2 top-full z-40 mt-1 w-[min(19rem,calc(100vw-1rem))] overflow-hidden rounded-md border border-white/[0.11] bg-[#181818]/[0.98] shadow-[0_16px_44px_rgba(0,0,0,0.6)] ring-1 ring-black/40 backdrop-blur-xl sm:hidden">
            <MobileMenu
              menus={menus}
              onAction={(action) => {
                setMobileOpen(false);
                action?.();
              }}
            />
          </div>
        ) : null}

        <div
          role="menubar"
          aria-label="Application menu"
          className="hidden h-full items-center gap-0.5 sm:flex"
        >
          {menus.map((menu) => (
            <div key={menu.id} className="relative">
              <button
                ref={(element) => {
                  menuButtonRefs.current[menu.id] = element;
                }}
                type="button"
                role="menuitem"
                aria-haspopup={menu.items.length > 0 ? "menu" : undefined}
                aria-expanded={
                  menu.items.length > 0 ? openMenu === menu.id : undefined
                }
                aria-controls={
                  menu.items.length > 0 ? `modbots-menu-${menu.id}` : undefined
                }
                onFocus={(event) => rememberEditTarget(event.relatedTarget)}
                onMouseDown={(event) => {
                  rememberEditTarget(document.activeElement);
                  event.preventDefault();
                }}
                onClick={() => {
                  if (menu.items.length > 0) {
                    setOpenMenu((current) =>
                      current === menu.id ? null : menu.id,
                    );
                  }
                }}
                onKeyDown={(event) => {
                  if (menu.items.length > 0) {
                    handleMenuButtonKeyDown(event, menu.id);
                  }
                }}
                onMouseEnter={() => {
                  if (openMenu !== null && menu.items.length > 0) {
                    setOpenMenu(menu.id);
                  }
                }}
                className={`rounded-md px-2.5 py-1 text-[clamp(11px,calc(1.364vw+2px),14px)] transition ${
                  openMenu === menu.id
                    ? "bg-white/[0.1] text-white"
                    : "text-zinc-400 hover:bg-white/[0.06] hover:text-zinc-100"
                }`}
              >
                {menu.label}
              </button>

              {openMenu === menu.id ? (
                <div
                  id={`modbots-menu-${menu.id}`}
                  role="menu"
                  aria-label={menu.label}
                  onKeyDown={(event) => handleMenuKeyDown(event, menu.id)}
                  className="absolute left-0 top-full z-40 mt-0.5 min-w-[224px] rounded-lg border border-white/10 bg-[#151515] p-1 shadow-[0_16px_50px_rgba(0,0,0,0.5)]"
                >
                  <MenuItems
                    items={menu.items}
                    onAction={(action) => {
                      setOpenMenu(null);
                      action?.();
                    }}
                  />
                </div>
              ) : null}
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
