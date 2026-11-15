"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

export type DonutSegment = { name: string; value: number; color: string };

export function SparkBars({ data }: { data: number[] }) {
  const rows = data.map((total, i) => ({ i, total }));

  return (
    <div className="h-12 w-28 shrink-0">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={rows} barCategoryGap="30%">
          <Bar dataKey="total" radius={[3, 3, 0, 0]} isAnimationActive={false}>
            {rows.map((row) => (
              <Cell
                key={row.i}
                fill={row.i === rows.length - 1 ? "#6D4AFF" : "#DACBFF"}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export function AttendanceDonut({
  segments,
  rate,
}: {
  segments: DonutSegment[];
  rate: number;
}) {
  return (
    <div className="relative size-32 shrink-0">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={segments}
            dataKey="value"
            innerRadius="72%"
            outerRadius="100%"
            startAngle={90}
            endAngle={-270}
            stroke="none"
            paddingAngle={2}
            isAnimationActive={false}
          >
            {segments.map((segment) => (
              <Cell key={segment.name} fill={segment.color} />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
      <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-2xl font-semibold leading-none">{rate}%</span>
        <span className="mt-1 text-[11px] text-[#8F8A9E]">hadir</span>
      </div>
    </div>
  );
}

export function EnrollmentTrend({
  data,
}: {
  data: { day: string; total: number }[];
}) {
  return (
    <div className="h-56 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{ top: 8, right: 0, bottom: 0, left: 0 }}
          barCategoryGap="28%"
        >
          <CartesianGrid vertical={false} strokeDasharray="4 6" stroke="#EDEAF5" />
          <XAxis
            dataKey="day"
            tickLine={false}
            axisLine={false}
            dy={8}
            tick={{ fill: "#9A94A8", fontSize: 12 }}
          />
          <YAxis
            ticks={[0, 10, 20, 30]}
            tickLine={false}
            axisLine={false}
            width={30}
            tick={{ fill: "#9A94A8", fontSize: 12 }}
          />
          <Tooltip
            cursor={{ fill: "#F4F0FE" }}
            contentStyle={{
              borderRadius: 12,
              border: "1px solid #EDE9F7",
              fontSize: 12,
            }}
          />
          <Bar dataKey="total" radius={[6, 6, 0, 0]} isAnimationActive={false}>
            {data.map((row, i) => (
              <Cell
                key={row.day}
                fill={i === data.length - 1 ? "#6D4AFF" : "#D8C9FF"}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
