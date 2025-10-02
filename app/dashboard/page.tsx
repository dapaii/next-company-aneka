import { getSession } from "@/lib/auth/auth";
import FadeIn from "@/components/motion/FadeIn";
import { fetchEvents } from "@/services/events";
import { countByStatus, nextUpcoming, averageDurationHours, publicationRate, upcomingThisWeek, recentActivity, build7DayTrend, buildSparklinePath,} from "@/lib/dashboard/stats";
import { StatCardRow } from "@/components/dashboard/cards/StatCardRow";
import { PublicationRateCard } from "@/components/dashboard/cards/PublicationRateCard";
import { AvgDurationCard } from "@/components/dashboard/cards/AvgDurationCard";
import { Trend7DaysCard } from "@/components/dashboard/cards/Trend7DaysCard";
import { CalendarCard } from "@/components/dashboard/CalendarCard";
import { NextUpCard } from "@/components/dashboard/sidebar/NextUpCard";
import { WeekListCard } from "@/components/dashboard/sidebar/WeekListCard";
import { RecentActivityCard } from "@/components/dashboard/sidebar/RecentActivityCard";

export default async function DashboardPage() {
  const sess = await getSession();
  const events = await fetchEvents();

  const stats = countByStatus(events);
  const upcoming = nextUpcoming(events);
  const weekly = upcomingThisWeek(events);
  const recent = recentActivity(events);
  const avgHours = averageDurationHours(events);
  const pubRate = publicationRate(events);
  const trendData = build7DayTrend(events);
  const sparkPath = buildSparklinePath(trendData.map((d) => d.value));

  return (
    <main className="px-3 py-4 sm:px-4 md:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-6xl md:max-w-7xl space-y-3 sm:space-y-4 lg:space-y-6">
        {/* Header */}
        <FadeIn>
          <section className="rounded-xl border bg-card p-4 sm:p-5">
            <div className="flex flex-col gap-1 min-w-0">
              <h1 className="text-lg sm:text-xl md:text-2xl font-semibold tracking-tight truncate">
                Halo {sess?.email} 👋
              </h1>
              <p className="text-xs sm:text-sm text-muted-foreground">
                Ringkasan cepat status event & kalender.
              </p>
            </div>
          </section>
        </FadeIn>

        {/* Stats (komponen ini sudah responsif: sm:2 lg:3) */}
        <div className="min-w-0">
          <StatCardRow
            published={stats.published}
            draft={stats.draft}
            archived={stats.archived}
          />
        </div>

        {/* Middle row: bikin 2 kolom di md (lebih lega), 3 kolom di lg */}
        <section className="grid gap-4 sm:gap-5 lg:gap-6 md:grid-cols-2 lg:grid-cols-3 auto-rows-[1fr] min-w-0">
          <div className="min-w-0">
            <PublicationRateCard
              pubRate={pubRate}
              published={stats.published}
              total={stats.total}
            />
          </div>
          <div className="min-w-0">
            <AvgDurationCard hours={avgHours} />
          </div>
          <div className="min-w-0">
            <Trend7DaysCard
              labels={trendData.map((d) => d.label)}
              values={trendData.map((d) => d.value)}
              path={sparkPath}
            />
          </div>
        </section>

        {/* Bottom: Calendar + Sidebar */}
        {/* Di tablet: pecah 7 kolom (4|3). Di desktop: 12 kolom (8|4) */}
        <section className="grid gap-4 sm:gap-5 lg:gap-6 md:grid-cols-7 lg:grid-cols-12">
          {/* Calendar */}
          <div className="md:col-span-4 lg:col-span-8 min-w-0">
            <CalendarCard events={events} total={stats.total} />
          </div>

          {/* Sidebar */}
          <div className="md:col-span-3 lg:col-span-4 space-y-2 sm:space-y-3 min-w-0">
            <div className="min-w-0">
              <NextUpCard upcoming={upcoming} />
            </div>
            <div className="min-w-0">
              <WeekListCard weekly={weekly} />
            </div>
            <div className="min-w-0">
              <RecentActivityCard items={recent} />
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
