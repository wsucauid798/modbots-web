import {
  ArrowUpRight,
  Camera,
  MessageSquare,
  Shield,
  UserRound,
  X,
} from "lucide-react";
import type { FormEvent, ReactNode } from "react";
import { useEffect, useState } from "react";

export type SettingsSection = "account" | "chat";

export interface AccountSettingsSummary {
  display: string;
  alias: string;
  accountLabel: string;
  registered: boolean;
  identityLabel: string;
  memberSinceLabel: string;
  profilePictureSummary: string;
  healthSummary: string;
  latestModerationLabel: string | null;
  bio: string | null;
  pronouns: string | null;
  location: string | null;
  links: string[];
}

function RegisteredMark({ className = "h-3.5 w-3.5" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 20 20"
      aria-hidden="true"
      className={className}
      fill="none"
    >
      <path
        d="M7 3H5a2 2 0 0 0-2 2v2m10-4h2a2 2 0 0 1 2 2v2M7 17H5a2 2 0 0 1-2-2v-2m10 4h2a2 2 0 0 0 2-2v-2"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        d="m6.5 10 2.25 2.25 4.75-5"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

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
    <label className="flex items-center justify-between gap-4 rounded-2xl border border-white/[0.08] bg-white/[0.02] px-4 py-3 text-sm text-zinc-200">
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

function SectionButton({
  label,
  icon,
  active,
  onClick,
}: {
  label: string;
  icon: ReactNode;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex w-full items-center gap-2.5 rounded-2xl px-3 py-2.5 text-left text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40 ${
        active
          ? "bg-white/[0.08] text-white"
          : "text-zinc-400 hover:bg-white/[0.04] hover:text-zinc-200"
      }`}
    >
      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border border-white/[0.08] bg-black/20">
        {icon}
      </span>
      <span className="min-w-0 flex-1 truncate font-medium">{label}</span>
    </button>
  );
}

function DetailCard({
  title,
  icon,
  children,
  action,
}: {
  title: string;
  icon: ReactNode;
  children: ReactNode;
  action?: ReactNode;
}) {
  return (
    <section className="rounded-[22px] border border-white/[0.08] bg-[linear-gradient(180deg,rgba(255,255,255,0.04),rgba(255,255,255,0.02))] p-4">
      <div className="flex items-start gap-3">
        <span className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-white/[0.08] bg-black/20 text-zinc-300">
          {icon}
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-zinc-500">
            {title}
          </p>
          <div className="mt-2 text-[13px] leading-6 text-zinc-200">
            {children}
          </div>
        </div>
      </div>
      {action !== undefined ? <div className="mt-4">{action}</div> : null}
    </section>
  );
}

export function SettingsDialog({
  section,
  onSectionChange,
  account,
  accountAvatar,
  sendWithEnter,
  onSendWithEnterChange,
  onOpenAccountPage,
  onManageProfilePicture,
  onSaveProfile,
  profileSaving,
  profileError,
  onClose,
}: {
  section: SettingsSection;
  onSectionChange: (section: SettingsSection) => void;
  account: AccountSettingsSummary | null;
  accountAvatar: ReactNode;
  sendWithEnter: boolean;
  onSendWithEnterChange: (checked: boolean) => void;
  onOpenAccountPage: () => void;
  onManageProfilePicture: () => void;
  onSaveProfile: (profile: {
    bio: string | null;
    pronouns: string | null;
    location: string | null;
    links: string[];
  }) => void;
  profileSaving: boolean;
  profileError: string | null;
  onClose: () => void;
}) {
  const [bio, setBio] = useState("");
  const [pronouns, setPronouns] = useState("");
  const [location, setLocation] = useState("");
  const [links, setLinks] = useState("");

  useEffect(() => {
    setBio(account?.bio ?? "");
    setPronouns(account?.pronouns ?? "");
    setLocation(account?.location ?? "");
    setLinks(account?.links?.join("\n") ?? "");
  }, [account?.bio, account?.location, account?.pronouns, account?.links]);

  const submitProfile = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSaveProfile({
      bio: bio.trim() || null,
      pronouns: pronouns.trim() || null,
      location: location.trim() || null,
      links: links
        .split("\n")
        .map((link) => link.trim())
        .filter((link) => link.length > 0),
    });
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-6"
      onClick={onClose}
    >
      <div
        className="w-[min(780px,100%)] rounded-[28px] border border-white/10 bg-[#111111] shadow-[0_24px_70px_rgba(0,0,0,0.6)]"
        onClick={(event) => event.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modbots-settings-title"
      >
        <div className="flex items-center justify-between gap-4 border-b border-white/[0.08] px-5 py-4">
          <div>
            <h2
              id="modbots-settings-title"
              className="text-sm font-semibold text-white"
            >
              Settings
            </h2>
            <p className="mt-1 text-xs text-zinc-500">
              Account first, chat controls second.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl p-2 text-zinc-500 hover:bg-white/[0.06] hover:text-white"
            aria-label="Close settings"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="grid gap-0 md:grid-cols-[220px_minmax(0,1fr)]">
          <aside className="border-b border-white/[0.08] p-4 md:border-b-0 md:border-r">
            <nav className="space-y-2">
              <SectionButton
                label="Account"
                icon={<UserRound className="h-4 w-4" />}
                active={section === "account"}
                onClick={() => onSectionChange("account")}
              />
              <SectionButton
                label="Chat"
                icon={<MessageSquare className="h-4 w-4" />}
                active={section === "chat"}
                onClick={() => onSectionChange("chat")}
              />
            </nav>
          </aside>

          <div className="max-h-[min(78vh,760px)] overflow-y-auto p-5">
            {section === "account" ? (
              account === null ? null : (
                <div>
                  <section className="rounded-[24px] border border-white/[0.08] bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.08),transparent_46%)] p-4">
                    <div className="flex items-start gap-4">
                      <div className="relative shrink-0">
                        {accountAvatar}
                        <button
                          type="button"
                          onClick={onManageProfilePicture}
                          className="absolute -bottom-1 -right-1 flex h-8 w-8 items-center justify-center rounded-full border border-white/[0.1] bg-[#181818] text-zinc-300 shadow-[0_10px_22px_rgba(0,0,0,0.35)] transition-colors hover:border-white/20 hover:bg-[#202020] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
                          aria-label="Change profile picture"
                          title="Change profile picture"
                        >
                          <Camera className="h-3.5 w-3.5" />
                        </button>
                      </div>
                      <div className="min-w-0 flex-1 pt-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <p className="truncate text-[15px] font-semibold text-zinc-50">
                            {account.display}
                          </p>
                          {account.registered ? (
                            <RegisteredMark className="h-3.5 w-3.5 shrink-0 text-emerald-400" />
                          ) : null}
                          <span className="inline-flex h-4 items-center text-[13px] font-medium leading-none text-zinc-400">
                            {account.accountLabel}
                          </span>
                        </div>
                        <p className="mt-1 truncate text-[14px] text-zinc-400">
                          {account.alias}
                        </p>
                        <p className="mt-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-zinc-600">
                          {account.identityLabel}
                        </p>
                      </div>
                    </div>
                  </section>

                  <form
                    onSubmit={submitProfile}
                    className="mt-4 rounded-[22px] border border-white/[0.08] bg-white/[0.02] p-4"
                  >
                    <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-zinc-500">
                      Profile
                    </p>
                    <div className="mt-3 grid gap-3 sm:grid-cols-2">
                      <label className="sm:col-span-2">
                        <span className="text-[11px] font-medium text-zinc-300">
                          About
                        </span>
                        <textarea
                          value={bio}
                          onChange={(event) => setBio(event.target.value)}
                          maxLength={160}
                          rows={3}
                          className="mt-1.5 w-full resize-none rounded-xl border border-white/[0.08] bg-black/20 px-3 py-2 text-[13px] text-zinc-100 outline-none transition focus:border-white/20 focus:ring-2 focus:ring-white/10"
                        />
                      </label>
                      <label>
                        <span className="text-[11px] font-medium text-zinc-300">
                          Pronouns
                        </span>
                        <input
                          value={pronouns}
                          onChange={(event) => setPronouns(event.target.value)}
                          maxLength={40}
                          className="mt-1.5 w-full rounded-xl border border-white/[0.08] bg-black/20 px-3 py-2 text-[13px] text-zinc-100 outline-none transition focus:border-white/20 focus:ring-2 focus:ring-white/10"
                        />
                      </label>
                      <label>
                        <span className="text-[11px] font-medium text-zinc-300">
                          Location
                        </span>
                        <input
                          value={location}
                          onChange={(event) => setLocation(event.target.value)}
                          maxLength={80}
                          className="mt-1.5 w-full rounded-xl border border-white/[0.08] bg-black/20 px-3 py-2 text-[13px] text-zinc-100 outline-none transition focus:border-white/20 focus:ring-2 focus:ring-white/10"
                        />
                      </label>
                      <label className="sm:col-span-2">
                        <span className="text-[11px] font-medium text-zinc-300">
                          Links
                        </span>
                        <textarea
                          value={links}
                          onChange={(event) => setLinks(event.target.value)}
                          rows={3}
                          className="mt-1.5 w-full resize-none rounded-xl border border-white/[0.08] bg-black/20 px-3 py-2 text-[13px] text-zinc-100 outline-none transition focus:border-white/20 focus:ring-2 focus:ring-white/10"
                        />
                      </label>
                    </div>
                    {profileError !== null ? (
                      <p className="mt-3 text-[11px] text-red-300">
                        {profileError}
                      </p>
                    ) : null}
                    <button
                      type="submit"
                      disabled={profileSaving}
                      className="mt-4 rounded-xl bg-white px-4 py-2 text-[12px] font-semibold text-black transition hover:bg-zinc-200 disabled:cursor-wait disabled:opacity-50"
                    >
                      {profileSaving ? "Saving..." : "Save profile"}
                    </button>
                  </form>

                  <div className="mt-4 grid gap-3 lg:grid-cols-2">
                    <DetailCard
                      title="Profile picture"
                      icon={<Camera className="h-4 w-4" />}
                      action={
                        <button
                          type="button"
                          onClick={onManageProfilePicture}
                          className="inline-flex items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.04] px-3 py-1.5 text-[11px] font-semibold text-zinc-200 transition-colors hover:border-white/15 hover:bg-white/[0.08] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
                        >
                          Manage picture
                          <ArrowUpRight className="h-3.5 w-3.5" />
                        </button>
                      }
                    >
                      <p>{account.profilePictureSummary}</p>
                      <p className="mt-1 text-[11px] text-zinc-500">
                        Profile pictures are served through UPPS.
                      </p>
                    </DetailCard>

                    <DetailCard
                      title="Account health"
                      icon={<Shield className="h-4 w-4" />}
                    >
                      <p>{account.healthSummary}</p>
                      <p className="mt-1 text-[11px] text-zinc-500">
                        {account.latestModerationLabel ??
                          "No recent mod bot action is attached to this account."}
                      </p>
                    </DetailCard>
                  </div>

                  <div className="mt-4 rounded-[22px] border border-white/[0.08] bg-white/[0.02] p-4">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-zinc-500">
                      Member since
                    </p>
                    <p className="mt-2 text-[13px] text-zinc-200">
                      {account.memberSinceLabel}
                    </p>
                    <button
                      type="button"
                      onClick={onOpenAccountPage}
                      className="mt-4 inline-flex items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.04] px-3 py-1.5 text-[11px] font-semibold text-zinc-200 transition-colors hover:border-white/15 hover:bg-white/[0.08] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
                    >
                      Open full account page
                      <ArrowUpRight className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              )
            ) : (
              <div>
                <section className="rounded-[24px] border border-white/[0.08] bg-[linear-gradient(180deg,rgba(255,255,255,0.04),rgba(255,255,255,0.02))] p-4">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-zinc-500">
                    Chat settings
                  </p>
                  <p className="mt-2 text-sm text-zinc-400">
                    Keep room-specific controls here and leave account state in
                    the account section.
                  </p>
                </section>

                <div className="mt-4 space-y-3">
                  <ToggleRow
                    label="Send with Enter"
                    checked={sendWithEnter}
                    onChange={onSendWithEnterChange}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
