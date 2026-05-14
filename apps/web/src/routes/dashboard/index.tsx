import { Icon } from "@iconify/react";
import { createFileRoute } from "@tanstack/react-router";
import { subDays, isWithinInterval, startOfDay, endOfDay } from "date-fns";
import { useState, useMemo } from "react";
import { DateRange } from "react-day-picker";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

import { ChartCard, Surface } from "@/components/chart-card";
import { DatePickerWithRange } from "@/components/date-range-picker";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import apiClient from "@/lib/api-client";
import { List, PageVisit, User, Message } from "@/types";
import {
  groupVisitsByDate,
  groupUsersByDate,
  groupMessagesByDate,
  getTopPages,
  categorizePageVisits,
  formatNumber,
} from "@/utils/chart-helpers";

export const Route = createFileRoute("/dashboard/")({
  component: RouteComponent,
  loader: async () => {
    const { data: visits } = await apiClient.get<List<PageVisit>>("/analytics/page-visits", {
      params: { limit: -1 },
    });
    const { data: users } = await apiClient.get<List<User>>("/users", {
      params: { limit: -1 },
    });
    const { data: messages } = await apiClient.get<List<Message>>("/messages", {
      params: { limit: -1 },
    });
    return { visits, users, messages };
  },
});

const COLORS = {
  primary: "#3b82f6",
  secondary: "#8b5cf6",
  success: "#10b981",
  warning: "#f59e0b",
  danger: "#ef4444",
  posts: "#3b82f6",
  other: "#8b5cf6",
};

const PIE_COLORS = [COLORS.posts, COLORS.other];

function RouteComponent() {
  const { visits, users, messages } = Route.useLoaderData();
  const [date, setDate] = useState<DateRange | undefined>({
    from: subDays(new Date(), 30),
    to: new Date(),
  });

  const filteredData = useMemo(() => {
    if (!date?.from || !date?.to) {
      return {
        visits: visits.items,
        users: users.items,
        messages: messages.items,
      };
    }

    const interval = {
      start: startOfDay(date.from),
      end: endOfDay(date.to),
    };

    return {
      visits: visits.items.filter((v) => isWithinInterval(new Date(v.date), interval)),
      users: users.items.filter((u) => isWithinInterval(new Date(u.createdAt!), interval)),
      messages: messages.items.filter((m) => isWithinInterval(new Date(m.createdAt!), interval)),
    };
  }, [visits, users, messages, date]);

  // Calculate totals
  const totalVisits = filteredData.visits.reduce((sum, visit) => sum + visit.count, 0);
  const totalUsers = filteredData.users.length;
  const totalMessages = filteredData.messages.length;

  // Prepare chart data
  const visitsOverTime = groupVisitsByDate(filteredData.visits);
  const usersOverTime = groupUsersByDate(filteredData.users);
  const messagesOverTime = groupMessagesByDate(filteredData.messages);
  const topPages = getTopPages(filteredData.visits, 8);
  const pageCategories = categorizePageVisits(filteredData.visits);

  return (
    <div className='space-y-6'>
      <div className='flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
        <div>
          <h1 className='text-3xl font-bold tracking-tight'>Dashboard</h1>
          <p className='text-muted-foreground'>
            Uygulamanızın genel istatistikleri ve performans verileri.
          </p>
        </div>
        <div className='flex items-center space-x-2'>
          <DatePickerWithRange
            date={date}
            setDate={setDate}
          />
        </div>
      </div>

      {/* Overview Cards */}
      <div className='grid grid-cols-1 gap-6 md:grid-cols-3'>
        <Surface className='p-6'>
          <div className='flex items-center justify-between'>
            <div>
              <p className='text-muted-foreground text-sm font-medium'>Seçili Dönem Ziyaretleri</p>
              <h3 className='mt-2 text-3xl font-bold'>{formatNumber(totalVisits)}</h3>
            </div>
            <div className='bg-primary/10 flex h-12 w-12 items-center justify-center rounded-full'>
              <Icon
                icon='mdi:eye'
                className='text-primary h-6 w-6'
              />
            </div>
          </div>
        </Surface>

        <Surface className='p-6'>
          <div className='flex items-center justify-between'>
            <div>
              <p className='text-muted-foreground text-sm font-medium'>Yeni Kullanıcılar</p>
              <h3 className='mt-2 text-3xl font-bold'>{formatNumber(totalUsers)}</h3>
            </div>
            <div className='bg-secondary/10 flex h-12 w-12 items-center justify-center rounded-full'>
              <Icon
                icon='mdi:account-group'
                className='text-secondary h-6 w-6'
              />
            </div>
          </div>
        </Surface>

        <Surface className='p-6'>
          <div className='flex items-center justify-between'>
            <div>
              <p className='text-muted-foreground text-sm font-medium'>Gelen Mesajlar</p>
              <h3 className='mt-2 text-3xl font-bold'>{formatNumber(totalMessages)}</h3>
            </div>
            <div className='bg-success/10 flex h-12 w-12 items-center justify-center rounded-full'>
              <Icon
                icon='mdi:message'
                className='text-success h-6 w-6'
              />
            </div>
          </div>
        </Surface>
      </div>

      {/* Charts Grid */}
      <div className='grid grid-cols-1 gap-6 xl:grid-cols-2'>
        {/* Page Visits Over Time */}
        <ChartCard
          title='Sayfa Ziyaretleri'
          description='Seçili dönemdeki günlük ziyaret eğilimi'
        >
          <ResponsiveContainer
            width='100%'
            height={300}
          >
            <LineChart data={visitsOverTime}>
              <CartesianGrid
                strokeDasharray='3 3'
                vertical={false}
                opacity={0.3}
              />
              <XAxis
                dataKey='date'
                tick={{ fontSize: 12 }}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                tick={{ fontSize: 12 }}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `${value}`}
              />
              <Tooltip
                contentStyle={{
                  borderRadius: "8px",
                  border: "none",
                  boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                }}
              />
              <Legend iconType='circle' />
              <Line
                type='monotone'
                dataKey='count'
                stroke={COLORS.primary}
                strokeWidth={3}
                name='Ziyaret'
                dot={false}
                activeDot={{ r: 6, fill: COLORS.primary }}
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* User Registrations Over Time */}
        <ChartCard
          title='Kullanıcı Kayıtları'
          description='Seçili dönemdeki yeni kayıt olan kullanıcılar'
        >
          <ResponsiveContainer
            width='100%'
            height={300}
          >
            <AreaChart data={usersOverTime}>
              <defs>
                <linearGradient
                  id='colorUsers'
                  x1='0'
                  y1='0'
                  x2='0'
                  y2='1'
                >
                  <stop
                    offset='5%'
                    stopColor={COLORS.secondary}
                    stopOpacity={0.4}
                  />
                  <stop
                    offset='95%'
                    stopColor={COLORS.secondary}
                    stopOpacity={0.0}
                  />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray='3 3'
                vertical={false}
                opacity={0.3}
              />
              <XAxis
                dataKey='date'
                tick={{ fontSize: 12 }}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                tick={{ fontSize: 12 }}
                tickLine={false}
                axisLine={false}
              />
              <Tooltip
                contentStyle={{
                  borderRadius: "8px",
                  border: "none",
                  boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                }}
              />
              <Legend iconType='circle' />
              <Area
                type='monotone'
                dataKey='count'
                stroke={COLORS.secondary}
                strokeWidth={3}
                fillOpacity={1}
                fill='url(#colorUsers)'
                name='Kayıt'
              />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Top Pages */}
        <ChartCard
          title='En Çok Ziyaret Edilen Sayfalar'
          description='Seçili dönemde en popüler 8 sayfa'
        >
          <ResponsiveContainer
            width='100%'
            height={300}
          >
            <BarChart
              data={topPages}
              layout='vertical'
              margin={{ left: 20 }}
            >
              <CartesianGrid
                strokeDasharray='3 3'
                horizontal={false}
                opacity={0.3}
              />
              <XAxis
                type='number'
                tick={{ fontSize: 12 }}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                dataKey='url'
                type='category'
                width={120}
                tick={{ fontSize: 11 }}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => {
                  if (value.length > 18) return value.substring(0, 18) + "...";
                  return value;
                }}
              />
              <Tooltip
                contentStyle={{
                  borderRadius: "8px",
                  border: "none",
                  boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                }}
                cursor={{ fill: "rgba(0,0,0,0.05)" }}
              />
              <Bar
                dataKey='count'
                fill={COLORS.primary}
                name='Ziyaret'
                radius={[0, 4, 4, 0]}
                barSize={20}
              />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Page Categories */}
        <ChartCard
          title='Sayfa Kategorileri Dağılımı'
          description='Yazılar vs diğer sayfaların oransal gösterimi'
        >
          <ResponsiveContainer
            width='100%'
            height={300}
          >
            <PieChart>
              <Pie
                data={pageCategories}
                cx='50%'
                cy='50%'
                innerRadius={60}
                outerRadius={100}
                paddingAngle={5}
                dataKey='value'
                label={({ name, percent }) => `${name} (${((percent || 0) * 100).toFixed(0)}%)`}
                labelLine={false}
              >
                {pageCategories.map((_entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={PIE_COLORS[index % PIE_COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  borderRadius: "8px",
                  border: "none",
                  boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                }}
              />
              <Legend iconType='circle' />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* Messages & Table */}
      <div className='grid grid-cols-1 gap-6 xl:grid-cols-2'>
        <ChartCard
          title='Gelen Mesaj Aktivitesi'
          description='Seçili dönemdeki günlük mesaj hacmi'
        >
          <ResponsiveContainer
            width='100%'
            height={300}
          >
            <BarChart data={messagesOverTime}>
              <CartesianGrid
                strokeDasharray='3 3'
                vertical={false}
                opacity={0.3}
              />
              <XAxis
                dataKey='date'
                tick={{ fontSize: 12 }}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                tick={{ fontSize: 12 }}
                tickLine={false}
                axisLine={false}
              />
              <Tooltip
                contentStyle={{
                  borderRadius: "8px",
                  border: "none",
                  boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                }}
                cursor={{ fill: "rgba(0,0,0,0.05)" }}
              />
              <Legend iconType='circle' />
              <Bar
                dataKey='count'
                fill={COLORS.success}
                name='Mesaj'
                radius={[4, 4, 0, 0]}
                barSize={30}
              />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Detailed Table */}
        <ChartCard
          title='Detaylı Sayfa Ziyaretleri'
          description='Seçili döneme ait sayfa başına ziyaret istatistikleri'
        >
          <div className='max-h-[300px] overflow-auto'>
            <Table>
              <TableHeader className='bg-background/95 sticky top-0 backdrop-blur'>
                <TableRow>
                  <TableHead>Sayfa</TableHead>
                  <TableHead className='text-right'>Ziyaret Sayısı</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredData.visits
                  .sort((a, b) => b.count - a.count)
                  .map((visit) => (
                    <TableRow key={visit.url}>
                      <TableCell className='text-sm font-medium'>{visit.url}</TableCell>
                      <TableCell className='text-right'>{visit.count}</TableCell>
                    </TableRow>
                  ))}
                {filteredData.visits.length === 0 && (
                  <TableRow>
                    <TableCell
                      colSpan={2}
                      className='text-muted-foreground h-24 text-center'
                    >
                      Bu tarih aralığında ziyaret verisi bulunamadı.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </ChartCard>
      </div>
    </div>
  );
}
