import React, { useMemo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { DayPlan } from '../../types/planner';
import { getNext7Days, isDateInNext7Days } from '../../utils/dateUtils';

interface CalendarProps {
  currentMonth: Date;
  selectedDate: Date;
  weekPlan: any;
  onDateSelect: (date: Date) => void;
  onMonthChange: (direction: number) => void;
}

const Calendar: React.FC<CalendarProps> = ({
  currentMonth,
  selectedDate,
  weekPlan,
  onDateSelect,
  onMonthChange,
}) => {
  const monthNames = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];

  const weekDays = ['D', 'L', 'M', 'M', 'J', 'V', 'S'];

  const suggestedDays = useMemo(() => getNext7Days(), []);

  const isSuggestedDay = (day: number): boolean => {
    const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    return isDateInNext7Days(date, suggestedDays);
  };

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    return { firstDay, daysInMonth };
  };

  const hasRecipesForDate = (day: number): boolean => {
    if (!weekPlan?.days) return false;
    
    const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    const dateString = date.toISOString().split('T')[0];
    
    const dayPlan = weekPlan.days.find((d: DayPlan) => d.date === dateString);
    return Boolean(dayPlan?.breakfast || dayPlan?.lunch || dayPlan?.dinner);
  };

  const isDateSelected = (day: number): boolean => {
    return selectedDate.getDate() === day &&
           selectedDate.getMonth() === currentMonth.getMonth() &&
           selectedDate.getFullYear() === currentMonth.getFullYear();
  };

  const { firstDay, daysInMonth } = getDaysInMonth(currentMonth);

  const renderCalendar = () => {
    const days = [];

    for (let i = 0; i < firstDay; i++) {
      days.push(<View key={`empty-${i}`} style={styles.dayCell} />);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const hasRecipes = hasRecipesForDate(day);
      const isSelected = isDateSelected(day);
      const isSuggested = isSuggestedDay(day);

      days.push(
        <TouchableOpacity
          key={day}
          style={styles.dayCell}
          activeOpacity={0.7}
          onPress={() => {
            const newDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
            onDateSelect(newDate);
          }}
        >
          <View
            style={[
              styles.dayContent,
              hasRecipes && styles.dayWithRecipes,
              isSuggested && !hasRecipes && styles.suggestedDay,
              isSelected && styles.selectedDay,
            ]}
          >
            <Text
              style={[
                styles.dayText,
                isSelected && styles.selectedDayText,
              ]}
            >
              {day}
            </Text>
          </View>
        </TouchableOpacity>
      );
    }

    return days;
  };

  return (
    <View style={styles.container}>
      {/* Month Navigation */}
      <View style={styles.monthNavigation}>
        <TouchableOpacity onPress={() => onMonthChange(-1)} activeOpacity={0.7}>
          <Feather name="chevron-left" size={24} color="#D97706" />
        </TouchableOpacity>
        <Text style={styles.monthText}>
          {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
        </Text>
        <TouchableOpacity onPress={() => onMonthChange(1)} activeOpacity={0.7}>
          <Feather name="chevron-right" size={24} color="#D97706" />
        </TouchableOpacity>
      </View>

      {/* Calendar */}
      <View style={styles.calendarContainer}>
        {/* Week days header */}
        <View style={styles.weekDaysRow}>
          {weekDays.map((day, index) => (
            <View key={index} style={styles.weekDayCell}>
              <Text style={styles.weekDayText}>{day}</Text>
            </View>
          ))}
        </View>

        {/* Calendar grid */}
        <View style={styles.calendarGrid}>{renderCalendar()}</View>

        {/* Legend */}
        <View style={styles.legend}>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, styles.recipeDot]} />
            <Text style={styles.legendText}>Días con recetas</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, styles.suggestedDot]} />
            <Text style={styles.legendText}>Días sugeridos</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, styles.selectedDot]} />
            <Text style={styles.legendText}>Día seleccionado</Text>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 15,
  },
  monthNavigation: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  monthText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
  },
  calendarContainer: {
    backgroundColor: '#FEF3C7',
    borderRadius: 20,
    padding: 20,
  },
  weekDaysRow: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  weekDayCell: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
  },
  weekDayText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
  },
  calendarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  dayCell: {
    width: '14.28%',
    aspectRatio: 1,
    padding: 2,
  },
  dayContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
  },
  dayWithRecipes: {
    backgroundColor: '#FDE68A',
    borderWidth: 2,
    borderColor: '#F59E0B',
  },
  suggestedDay: {
    backgroundColor: '#FEF3C7',
    borderWidth: 1,
    borderColor: '#D97706',
    borderStyle: 'dashed',
  },
  selectedDay: {
    backgroundColor: '#F59E0B',
  },
  dayText: {
    fontSize: 16,
    color: '#1F2937',
  },
  selectedDayText: {
    color: '#FFF',
    fontWeight: '600',
  },
  legend: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 20,
    marginTop: 15,
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: '#F59E0B',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  legendDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  recipeDot: {
    backgroundColor: '#FDE68A',
    borderWidth: 2,
    borderColor: '#F59E0B',
  },
  suggestedDot: {
    backgroundColor: '#FEF3C7',
    borderWidth: 1,
    borderColor: '#D97706',
  },
  selectedDot: {
    backgroundColor: '#F59E0B',
  },
  legendText: {
    fontSize: 12,
    color: '#6B7280',
  },
});

export default Calendar;