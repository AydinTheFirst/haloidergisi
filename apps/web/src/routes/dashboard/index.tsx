import { Icon } from "@iconify/react";
import { createFileRoute } from "@tanstack/react-router";
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

  // Calculate totals
  const totalVisits = visits.items.reduce((sum, visit) => sum + visit.count, 0);
  const totalUsers = users.meta.total;
  const totalMessages = messages.meta.total;

  // Prepare chart data
  const visitsOverTime = groupVisitsByDate(visits.items);
  const usersOverTime = groupUsersByDate(users.items);
  const messagesOverTime = groupMessagesByDate(messages.items);
  const topPages = getTopPages(visits.items, 8);
  const pageCategories = categorizePageVisits(visits.items);

  return (
    <div className='space-y-6'>
      <div>
        <h1 className='mb-2 text-3xl font-bold'>Dashboard</h1>
        <p className='text-muted-foreground'>Genel bakış ve analitik veriler</p>
      </div>

      {/* Overview Cards */}
      <div className='grid grid-cols-1 gap-6 md:grid-cols-3'>
        <Surface className='p-6'>
          <div className='flex items-center justify-between'>
            <div>
              <p className='text-muted-foreground text-sm font-medium'>Toplam Ziyaret</p>
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
              <p className='text-muted-foreground text-sm font-medium'>Toplam Kullanıcı</p>
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
              <p className='text-muted-foreground text-sm font-medium'>Toplam Mesaj</p>
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
          description='Günlük ziyaret sayıları'
        >
          <ResponsiveContainer
            width='100%'
            height={300}
          >
            <LineChart data={visitsOverTime}>
              <CartesianGrid
                strokeDasharray='3 3'
                opacity={0.3}
              />
              <XAxis
                dataKey='date'
                tick={{ fontSize: 12 }}
              />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Legend />
              <Line
                type='monotone'
                dataKey='count'
                stroke={COLORS.primary}
                strokeWidth={2}
                name='Ziyaret'
                dot={{ fill: COLORS.primary }}
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* User Registrations Over Time */}
        <ChartCard
          title='Kullanıcı Kayıtları'
          description='Günlük kayıt sayıları'
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
                    stopOpacity={0.8}
                  />
                  <stop
                    offset='95%'
                    stopColor={COLORS.secondary}
                    stopOpacity={0.1}
                  />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray='3 3'
                opacity={0.3}
              />
              <XAxis
                dataKey='date'
                tick={{ fontSize: 12 }}
              />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Legend />
              <Area
                type='monotone'
                dataKey='count'
                stroke={COLORS.secondary}
                strokeWidth={2}
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
          description='İlk 8 sayfa'
        >
          <ResponsiveContainer
            width='100%'
            height={300}
          >
            <BarChart
              data={topPages}
              layout='vertical'
            >
              <CartesianGrid
                strokeDasharray='3 3'
                opacity={0.3}
              />
              <XAxis
                type='number'
                tick={{ fontSize: 12 }}
              />
              <YAxis
                dataKey='url'
                type='category'
                width={150}
                tick={{ fontSize: 11 }}
                tickFormatter={(value) => {
                  if (value.length > 20) return value.substring(0, 20) + "...";
                  return value;
                }}
              />
              <Tooltip />
              <Bar
                dataKey='count'
                fill={COLORS.primary}
                name='Ziyaret'
              />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Page Categories */}
        <ChartCard
          title='Sayfa Kategorileri'
          description='Yazılar vs diğer sayfalar'
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
                labelLine={false}
                label={({ name, percent }) => `${name}: ${((percent || 0) * 100).toFixed(0)}%`}
                outerRadius={100}
                fill='#8884d8'
                dataKey='value'
              >
                {pageCategories.map((_entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={PIE_COLORS[index % PIE_COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* Messages Over Time - Full Width */}
      <div className='grid grid-cols-1 gap-6'>
        <ChartCard
          title='Gelen Mesajlar'
          description='Günlük mesaj sayıları'
        >
          <ResponsiveContainer
            width='100%'
            height={300}
          >
            <BarChart data={messagesOverTime}>
              <CartesianGrid
                strokeDasharray='3 3'
                opacity={0.3}
              />
              <XAxis
                dataKey='date'
                tick={{ fontSize: 12 }}
              />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Legend />
              <Bar
                dataKey='count'
                fill={COLORS.success}
                name='Mesaj'
                radius={[8, 8, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Detailed Table */}
        <ChartCard
          title='Tüm Sayfa Ziyaretleri'
          description='Detaylı liste'
        >
          <div className='overflow-x-auto'>
            <table>
              <thead>
                <tr>
                  <th>Sayfa</th>
                  <th>Ziyaret Sayısı</th>
                </tr>
              </thead>
              <tbody>
                {visits.items
                  .sort((a, b) => b.count - a.count)
                  .map((visit) => (
                    <tr key={visit.url}>
                      <td>{visit.url}</td>
                      <td>{visit.count}</td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </ChartCard>
      </div>
    </div>
  );
}
