import { Suspense } from "react";
import { Countdown } from "@/components/countdown";
import { RegistrationForm } from "@/components/registration-form";
import { LANDING_THEMES } from "@/lib/demo-data";
import { registrationWindow } from "@/lib/landing";
import { getPublicEvent } from "@/lib/supabase/queries/public";

function dateLabel(value: string) {
  return new Intl.DateTimeFormat("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${value}T00:00:00Z`));
}

function initials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2);
}

function PageShell({ children }: { children: React.ReactNode }) {
  return (
    <main className="min-h-screen bg-white text-[#241F31]">{children}</main>
  );
}

async function LandingContent({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const event = await getPublicEvent(slug);

  if (!event) {
    return (
      <PageShell>
        <div className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-5 text-center">
          <h1 className="text-xl font-semibold tracking-tight">
            Acara tidak ditemukan
          </h1>
          <p className="mt-2 text-sm leading-relaxed text-[#6B6578]">
            Link ini mungkin salah, atau pendaftaran acaranya belum dibuka panitia.
          </p>
        </div>
      </PageShell>
    );
  }

  const data = event.landing;
  const theme =
    LANDING_THEMES.find((item) => item.id === data.theme) ?? LANDING_THEMES[0];
  const learn = data.about.learn.split("\n").filter(Boolean);
  const seatsLeft = Math.max(0, data.registration.quota - event.registered);
  const status = registrationWindow(data);

  return (
    <div
      className="overflow-x-hidden"
      style={{ "--accent": theme.accent, "--soft": theme.soft } as React.CSSProperties}
    >
      <header className="sticky top-0 z-20 border-b border-[#F3F0FA] bg-white/90 backdrop-blur">
        <div className="mx-auto flex w-full max-w-5xl items-center justify-between gap-3 px-5 py-3">
          <div className="flex min-w-0 items-center gap-2">
            <span className="grid size-7 shrink-0 place-items-center rounded-lg bg-[var(--accent)] text-xs font-semibold text-white">
              E
            </span>
            <span className="truncate text-sm font-semibold tracking-tight">Eventom</span>
          </div>
          {status.open ? (
            <a
              href="#daftar"
              className="shrink-0 whitespace-nowrap rounded-full bg-[var(--accent)] px-3.5 py-2 text-[13px] font-medium text-white hover:opacity-90 sm:px-4 sm:text-sm"
            >
              {data.registration.cta}
            </a>
          ) : (
            <span className="shrink-0 whitespace-nowrap rounded-full bg-[#F4F1FB] px-3.5 py-2 text-[13px] font-medium text-[#8F8A9E] sm:px-4 sm:text-sm">
              Pendaftaran ditutup
            </span>
          )}
        </div>
      </header>

      <section className="mx-auto grid w-full max-w-5xl gap-8 px-5 py-8 sm:py-10 md:grid-cols-[1.1fr_1fr] md:py-14">
        <div className="min-w-0">
          <span className="inline-flex max-w-full items-center gap-2 rounded-full bg-[var(--soft)] px-3 py-1 text-xs font-medium text-[var(--accent)]">
            {data.event.format} · {data.registration.price}
          </span>

          <h1 className="mt-4 text-balance text-[27px] font-semibold leading-tight tracking-tight sm:text-3xl md:text-4xl">
            {data.event.name}
          </h1>

          <p className="mt-3 text-[15px] leading-relaxed text-[#5B5568]">
            {data.event.tagline}
          </p>

          <dl className="mt-6 grid grid-cols-[auto_1fr] gap-x-3 gap-y-1.5 text-sm text-[#4B4657]">
            <dt className="text-[#8F8A9E]">Tanggal</dt>
            <dd className="min-w-0 break-words">{dateLabel(data.event.date)}</dd>
            <dt className="text-[#8F8A9E]">Waktu</dt>
            <dd className="min-w-0 break-words">
              {data.event.startTime}–{data.event.endTime} WIB
            </dd>
            <dt className="text-[#8F8A9E]">Lokasi</dt>
            <dd className="min-w-0 break-words">{data.event.location}</dd>
          </dl>

          {status.open ? (
            <a
              href="#daftar"
              className="mt-6 block w-full rounded-xl bg-[var(--accent)] px-5 py-3 text-center text-sm font-medium text-white hover:opacity-90 sm:inline-block sm:w-auto"
            >
              {data.registration.cta}
            </a>
          ) : (
            <p className="mt-6 rounded-xl bg-[#F4F1FB] px-5 py-3 text-center text-sm font-medium text-[#6B6578] sm:text-left">
              {status.message}
            </p>
          )}

          {status.open && data.sections.quota && (
            <p className="mt-3 text-xs text-[#8F8A9E]">
              Kuota tersisa {seatsLeft} dari {data.registration.quota} peserta
            </p>
          )}

          {data.sections.countdown && (
            <div className="mt-5">
              <Countdown
                date={data.event.date}
                time={data.event.startTime}
                endTime={data.event.endTime}
              />
            </div>
          )}
        </div>

        {data.event.banner ? (
          // eslint-disable-next-line @next/next/no-img-element -- URL dinamis dari Storage
          <img
            src={data.event.banner}
            alt={`Banner ${data.event.name}`}
            className="aspect-[4/3] w-full min-w-0 max-w-full rounded-2xl border border-[#EDE9F7] object-cover"
          />
        ) : (
          <div className="grid aspect-[4/3] min-w-0 place-items-center rounded-2xl border border-dashed border-[#D9CFEF] bg-[var(--soft)]">
            <div className="text-center">
              <span className="mx-auto mb-2 grid size-10 place-items-center rounded-xl bg-white text-sm font-semibold text-[var(--accent)]">
                {initials(data.event.name)}
              </span>
              <p className="text-xs text-[#8F8A9E]">Banner acara belum diunggah</p>
            </div>
          </div>
        )}
      </section>

      <section className="border-t border-[#F3F0FA]">
        <div className="mx-auto grid w-full max-w-5xl gap-6 px-5 py-10 md:grid-cols-[1.25fr_1fr]">
          <div>
            <h2 className="text-lg font-semibold tracking-tight">Tentang event ini</h2>
            <p className="mt-3 text-sm leading-relaxed text-[#4B4657]">
              {data.about.description}
            </p>
          </div>

          {learn.length > 0 && (
            <div className="rounded-2xl bg-[var(--soft)] p-5">
              <p className="text-sm font-semibold">Yang akan dipelajari</p>
              <ul className="mt-3 space-y-2 text-sm text-[#4B4657]">
                {learn.map((item) => (
                  <li key={item} className="flex gap-2">
                    <span className="text-[var(--accent)]">•</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </section>

      {(data.sections.speaker || data.sections.agenda) && (
        <section className="border-t border-[#F3F0FA]">
          <div className="mx-auto grid w-full max-w-5xl gap-6 px-5 py-10 md:grid-cols-[0.85fr_1.15fr]">
            {data.sections.speaker && (
              <div>
                <h2 className="text-lg font-semibold tracking-tight">Pembicara</h2>
                <div className="mt-3 rounded-2xl border border-[#F1EDFA] p-5">
                  <span className="grid size-10 place-items-center rounded-full bg-[var(--soft)] text-sm font-semibold text-[var(--accent)]">
                    {initials(data.speaker.name)}
                  </span>
                  <p className="mt-3 text-sm font-semibold">{data.speaker.name}</p>
                  <p className="text-xs text-[#8F8A9E]">{data.speaker.role}</p>
                  <p className="mt-2 text-sm leading-relaxed text-[#5B5568]">
                    {data.speaker.bio}
                  </p>
                </div>
              </div>
            )}

            {data.sections.agenda && (
              <div>
                <h2 className="text-lg font-semibold tracking-tight">Agenda</h2>
                <ul className="mt-3 divide-y divide-[#F3F0FA]">
                  {data.agenda.map((session) => (
                    <li
                      key={session.id}
                      className="flex items-baseline gap-3 py-2.5 text-sm"
                    >
                      <span className="w-24 shrink-0 tabular-nums text-[#8F8A9E]">
                        {session.start}–{session.end}
                      </span>
                      <span>{session.title}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </section>
      )}

      <section className="border-t border-[#F3F0FA]">
        <div className="mx-auto w-full max-w-5xl px-5 py-10">
          <h2 className="text-lg font-semibold tracking-tight">Lokasi</h2>
          <p className="mt-2 text-sm font-medium">{data.event.location}</p>
          <p className="text-sm text-[#8F8A9E]">
            {dateLabel(data.event.date)} · {data.event.startTime}–{data.event.endTime} WIB
          </p>
        </div>
      </section>

      <section id="daftar" className="border-t border-[#F3F0FA] bg-[#FBFAFE]">
        <div className="mx-auto grid w-full max-w-5xl gap-6 px-5 py-10 md:grid-cols-[1fr_1.1fr] md:py-14">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight">
              {status.open ? "Amankan kursimu" : "Pendaftaran ditutup"}
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-[#5B5568]">
              {status.open
                ? `Pendaftaran ditutup ${dateLabel(data.registration.deadline)}. Kuota ${data.registration.quota} peserta.`
                : status.message}
            </p>

            <ul className="mt-4 space-y-1.5 text-sm text-[#4B4657]">
              <li>Harga: {data.registration.price}</li>
              <li>Format: {data.event.format}</li>
              {data.registration.whatsapp && (
                <li>Info: WhatsApp {data.registration.whatsapp}</li>
              )}
            </ul>

            {status.open && data.sections.quota && (
              <p className="mt-4 text-xs font-medium text-[var(--accent)]">
                Tersisa {seatsLeft} kursi
              </p>
            )}
          </div>

          <div className="rounded-2xl border border-[#EDE9F7] bg-white p-5">
            {status.open ? (
              <RegistrationForm
                slug={event.slug}
                fields={data.fields}
                cta={data.registration.cta}
              />
            ) : (
              <div className="py-6 text-center">
                <span className="mx-auto grid size-11 place-items-center rounded-full bg-[#F4F1FB] text-[#8F8A9E]">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={1.7}
                    className="size-5"
                    aria-hidden
                  >
                    <path d="M7 11V8a5 5 0 0 1 10 0v3M5.5 11h13v9h-13z" />
                  </svg>
                </span>
                <p className="mt-3 text-sm font-medium">{status.message}</p>
                <p className="mx-auto mt-1 max-w-xs text-xs leading-relaxed text-[#8F8A9E]">
                  Formulir pendaftaran sudah tidak menerima peserta baru.
                  {data.registration.whatsapp
                    ? ` Hubungi panitia di WhatsApp ${data.registration.whatsapp} kalau butuh bantuan.`
                    : ""}
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      <footer className="border-t border-[#F3F0FA] py-6">
        <p className="text-center text-xs text-[#A8A3B5]">
          Diselenggarakan dengan Eventom
        </p>
      </footer>
    </div>
  );
}

export default function PublicLandingPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  return (
    <PageShell>
      <Suspense
        fallback={
          <div className="mx-auto w-full max-w-5xl animate-pulse px-5 py-14">
            <div className="h-4 w-40 rounded-full bg-[#F1EDFA]" />
            <div className="mt-4 h-9 w-3/4 rounded-xl bg-[#F1EDFA]" />
            <div className="mt-3 h-4 w-1/2 rounded-full bg-[#F1EDFA]" />
            <div className="mt-8 h-64 rounded-2xl bg-[#F1EDFA]" />
          </div>
        }
      >
        <LandingContent params={params} />
      </Suspense>
    </PageShell>
  );
}
