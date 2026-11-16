import { Suspense } from "react";
import { Countdown } from "@/components/countdown";
import { RegistrationForm } from "@/components/registration-form";
import { LANDING_THEMES } from "@/lib/demo-data";
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

  return (
    <div
      style={{ "--accent": theme.accent, "--soft": theme.soft } as React.CSSProperties}
    >
      <header className="sticky top-0 z-20 border-b border-[#F3F0FA] bg-white/90 backdrop-blur">
        <div className="mx-auto flex w-full max-w-5xl items-center justify-between gap-3 px-5 py-3">
          <div className="flex items-center gap-2">
            <span className="grid size-7 place-items-center rounded-lg bg-[var(--accent)] text-xs font-semibold text-white">
              E
            </span>
            <span className="text-sm font-semibold tracking-tight">Eventom</span>
          </div>
          <a
            href="#daftar"
            className="rounded-full bg-[var(--accent)] px-4 py-2 text-sm font-medium text-white hover:opacity-90"
          >
            {data.registration.cta}
          </a>
        </div>
      </header>

      <section className="mx-auto grid w-full max-w-5xl gap-8 px-5 py-10 md:grid-cols-[1.1fr_1fr] md:py-14">
        <div>
          <span className="inline-flex items-center gap-2 rounded-full bg-[var(--soft)] px-3 py-1 text-xs font-medium text-[var(--accent)]">
            {data.event.format} · {data.registration.price}
          </span>

          <h1 className="mt-4 text-3xl font-semibold leading-tight tracking-tight md:text-4xl">
            {data.event.name}
          </h1>

          <p className="mt-3 text-[15px] leading-relaxed text-[#5B5568]">
            {data.event.tagline}
          </p>

          <dl className="mt-6 space-y-1.5 text-sm text-[#4B4657]">
            <div className="flex gap-2">
              <dt className="text-[#8F8A9E]">Tanggal</dt>
              <dd>{dateLabel(data.event.date)}</dd>
            </div>
            <div className="flex gap-2">
              <dt className="text-[#8F8A9E]">Waktu</dt>
              <dd>
                {data.event.startTime}–{data.event.endTime} WIB
              </dd>
            </div>
            <div className="flex gap-2">
              <dt className="text-[#8F8A9E]">Lokasi</dt>
              <dd>{data.event.location}</dd>
            </div>
          </dl>

          <a
            href="#daftar"
            className="mt-6 inline-block rounded-xl bg-[var(--accent)] px-5 py-3 text-sm font-medium text-white hover:opacity-90"
          >
            {data.registration.cta}
          </a>

          {data.sections.quota && (
            <p className="mt-3 text-xs text-[#8F8A9E]">
              Kuota tersisa {seatsLeft} dari {data.registration.quota} peserta
            </p>
          )}

          {data.sections.countdown && (
            <div className="mt-5">
              <Countdown date={data.event.date} time={data.event.startTime} />
            </div>
          )}
        </div>

        {data.event.banner ? (
          // eslint-disable-next-line @next/next/no-img-element -- URL dinamis dari Storage
          <img
            src={data.event.banner}
            alt={`Banner ${data.event.name}`}
            className="aspect-[4/3] w-full rounded-2xl border border-[#EDE9F7] object-cover"
          />
        ) : (
          <div className="grid aspect-[4/3] place-items-center rounded-2xl border border-dashed border-[#D9CFEF] bg-[var(--soft)]">
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
            <h2 className="text-2xl font-semibold tracking-tight">Amankan kursimu</h2>
            <p className="mt-2 text-sm leading-relaxed text-[#5B5568]">
              Pendaftaran ditutup {dateLabel(data.registration.deadline)}. Kuota{" "}
              {data.registration.quota} peserta.
            </p>

            <ul className="mt-4 space-y-1.5 text-sm text-[#4B4657]">
              <li>Harga: {data.registration.price}</li>
              <li>Format: {data.event.format}</li>
              {data.registration.whatsapp && (
                <li>Info: WhatsApp {data.registration.whatsapp}</li>
              )}
            </ul>

            {data.sections.quota && (
              <p className="mt-4 text-xs font-medium text-[var(--accent)]">
                Tersisa {seatsLeft} kursi
              </p>
            )}
          </div>

          <div className="rounded-2xl border border-[#EDE9F7] bg-white p-5">
            <RegistrationForm
              slug={event.slug}
              fields={data.fields}
              cta={data.registration.cta}
            />
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
