"use client";

import { useEffect, useState } from "react";
import { Flex, Column, Text, Button, Spinner } from "@/once-ui/components";
import { diaryService } from "@/app/utils/diaryService";
import styles from "./DiaryCalendar.module.scss";

interface DiaryCalendarProps {
  onDateSelect?: (date: Date) => void;
  onMonthChange?: (year: number, month: number) => void;
}

export default function DiaryCalendar({
  onDateSelect,
  onMonthChange,
}: DiaryCalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [entriesInMonth, setEntriesInMonth] = useState<Set<number>>(new Set());
  const [loading, setLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  useEffect(() => {
    loadEntriesForMonth(year, month);
  }, [year, month]);

  const loadEntriesForMonth = async (y: number, m: number) => {
    setLoading(true);
    try {
      const entries = await diaryService.fetchEntriesByMonth(y, m + 1);
      const dates = new Set(
        entries.map((e) => new Date(e.entryDate).getDate())
      );
      setEntriesInMonth(dates);
    } catch (err) {
      console.error("Failed to load entries:", err);
    } finally {
      setLoading(false);
    }
  };

  const handlePrevMonth = () => {
    const newDate = new Date(year, month - 1);
    setCurrentDate(newDate);
    onMonthChange?.(newDate.getFullYear(), newDate.getMonth() + 1);
  };

  const handleNextMonth = () => {
    const newDate = new Date(year, month + 1);
    setCurrentDate(newDate);
    onMonthChange?.(newDate.getFullYear(), newDate.getMonth() + 1);
  };

  const handleDateClick = (date: number) => {
    const selectedDate = new Date(year, month, date);
    setSelectedDate(selectedDate);
    onDateSelect?.(selectedDate);
  };

  const handleTodayClick = () => {
    const today = new Date();
    setCurrentDate(today);
    setSelectedDate(today);
    onMonthChange?.(today.getFullYear(), today.getMonth() + 1);
  };

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = new Date(year, month, 1).getDay();

  const days = Array(firstDayOfMonth).fill(null).concat(
    Array.from({ length: daysInMonth }, (_, i) => i + 1)
  );

  const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const MONTHS = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const isToday = (date: number) => {
    const today = new Date();
    return (
      date === today.getDate() &&
      month === today.getMonth() &&
      year === today.getFullYear()
    );
  };

  const isSelected = (date: number) => {
    return (
      selectedDate &&
      date === selectedDate.getDate() &&
      month === selectedDate.getMonth() &&
      year === selectedDate.getFullYear()
    );
  };

  return (
    <Column fillWidth gap="16" className={styles.calendar}>
      {/* Header */}
      <Flex gap="16" align="center" horizontal="space-between">
        <Flex gap="8" align="center">
          <Button
            variant="secondary"
            size="s"
            onClick={handlePrevMonth}
          >
            ← Prev
          </Button>
          <Text variant="heading-default-m" style={{ minWidth: "200px", textAlign: "center" }}>
            {MONTHS[month]} {year}
          </Text>
          <Button
            variant="secondary"
            size="s"
            onClick={handleNextMonth}
          >
            Next →
          </Button>
        </Flex>
        <Button
          variant="secondary"
          size="s"
          onClick={handleTodayClick}
        >
          Today
        </Button>
      </Flex>

      {/* Calendar */}
      {loading ? (
        <Flex fillWidth horizontal="center" padding="32">
          <Spinner />
        </Flex>
      ) : (
        <div className={styles.calendarGrid}>
          {/* Weekday headers */}
          {WEEKDAYS.map((day) => (
            <div key={day} className={styles.weekdayHeader}>
              <Text variant="body-strong-m" align="center">
                {day}
              </Text>
            </div>
          ))}

          {/* Day cells */}
          {days.map((date, index) => (
            <button
              key={index}
              className={`${styles.dayCell} ${
                date === null ? styles.empty : ""
              } ${isToday(date!) ? styles.today : ""} ${
                isSelected(date!) ? styles.selected : ""
              } ${date && entriesInMonth.has(date) ? styles.hasEntry : ""}`}
              onClick={() => date && handleDateClick(date)}
              disabled={date === null}
            >
              {date && (
                <>
                  <span className={styles.dayNumber}>{date}</span>
                  {entriesInMonth.has(date) && (
                    <span className={styles.indicator} title="Has entry"></span>
                  )}
                </>
              )}
            </button>
          ))}
        </div>
      )}
    </Column>
  );
}
