/**
 * Official VIT Timetable Slot Mapping
 * Auto-generated from VIT timetable structure
 */

export interface SlotTime {
  day: 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday';
  startTime: string;
  endTime: string;
}

// Theory time slots (in order of columns)
const THEORY_TIMES = [
  '08:00-08:50',
  '09:00-09:50',
  '10:00-10:50',
  '11:00-11:50',
  '12:00-12:50',
  '', // Lunch placeholder
  '', // Lunch placeholder
  '14:00-14:50',
  '15:00-15:50',
  '16:00-16:50',
  '17:00-17:50',
  '18:00-18:50',
  '18:51-19:00',
  '19:01-19:50',
];

// Lab time slots (in order of columns)
const LAB_TIMES = [
  '08:00-08:50',
  '08:51-09:40',
  '09:51-10:40',
  '10:41-11:30',
  '11:40-12:30',
  '12:31-13:20',
  '', // Lunch placeholder
  '', // Lunch placeholder
  '14:00-14:50',
  '14:51-15:40',
  '15:51-16:40',
  '16:41-17:30',
  '17:40-18:30',
  '18:31-19:20',
];

// Theory slots mapped to their positions
const THEORY_SCHEDULE: Record<string, Array<{ day: string; col: number }>> = {
  // A slots
  A1: [
    { day: 'Monday', col: 0 },
    { day: 'Wednesday', col: 1 },
  ],
  A2: [
    { day: 'Monday', col: 7 },
    { day: 'Wednesday', col: 8 },
  ],

  // B slots
  B1: [
    { day: 'Tuesday', col: 0 },
    { day: 'Thursday', col: 1 },
  ],
  B2: [
    { day: 'Tuesday', col: 7 },
    { day: 'Thursday', col: 8 },
  ],

  // C slots
  C1: [
    { day: 'Wednesday', col: 0 },
    { day: 'Friday', col: 1 },
  ],
  C2: [
    { day: 'Wednesday', col: 7 },
    { day: 'Friday', col: 8 },
  ],

  // D slots
  D1: [
    { day: 'Monday', col: 2 },
    { day: 'Thursday', col: 0 },
  ],
  D2: [
    { day: 'Monday', col: 9 },
    { day: 'Thursday', col: 7 },
  ],

  // E slots
  E1: [
    { day: 'Tuesday', col: 2 },
    { day: 'Friday', col: 0 },
  ],
  E2: [
    { day: 'Tuesday', col: 9 },
    { day: 'Friday', col: 7 },
  ],

  // F slots
  F1: [
    { day: 'Monday', col: 1 },
    { day: 'Wednesday', col: 2 },
  ],
  F2: [
    { day: 'Monday', col: 8 },
    { day: 'Wednesday', col: 9 },
  ],

  // G slots
  G1: [
    { day: 'Tuesday', col: 1 },
    { day: 'Thursday', col: 2 },
  ],
  G2: [
    { day: 'Tuesday', col: 8 },
    { day: 'Thursday', col: 9 },
  ],

  // T-prefix slots (Tutorial)
  TA1: [{ day: 'Friday', col: 2 }],
  TA2: [{ day: 'Friday', col: 9 }],
  TB1: [{ day: 'Monday', col: 3 }],
  TB2: [{ day: 'Monday', col: 10 }],
  TC1: [{ day: 'Tuesday', col: 3 }],
  TC2: [{ day: 'Tuesday', col: 10 }],
  TD1: [{ day: 'Friday', col: 4 }],
  TD2: [{ day: 'Wednesday', col: 10 }],
  TE1: [{ day: 'Thursday', col: 3 }],
  TE2: [{ day: 'Thursday', col: 10 }],
  TF1: [{ day: 'Friday', col: 3 }],
  TF2: [{ day: 'Friday', col: 10 }],
  TG1: [{ day: 'Monday', col: 4 }],
  TG2: [{ day: 'Monday', col: 11 }],

  // Double-letter T slots
  TAA1: [{ day: 'Tuesday', col: 4 }],
  TAA2: [{ day: 'Tuesday', col: 11 }],
  TBB2: [{ day: 'Wednesday', col: 11 }],
  TCC1: [{ day: 'Thursday', col: 4 }],
  TCC2: [{ day: 'Thursday', col: 11 }],
  TDD2: [{ day: 'Friday', col: 11 }],

  // V slots (Special)
  V1: [{ day: 'Wednesday', col: 3 }],
  V2: [{ day: 'Wednesday', col: 4 }],
  V3: [{ day: 'Monday', col: 13 }],
  V4: [{ day: 'Tuesday', col: 13 }],
  V5: [{ day: 'Wednesday', col: 13 }],
  V6: [{ day: 'Thursday', col: 13 }],
  V7: [{ day: 'Friday', col: 13 }],
  V8: [{ day: 'Saturday', col: 0 }],
  V9: [{ day: 'Saturday', col: 13 }],
  V10: [{ day: 'Sunday', col: 0 }],
  V11: [{ day: 'Sunday', col: 13 }],

  // Weekend slots
  X11: [{ day: 'Saturday', col: 1 }, { day: 'Sunday', col: 3 }],
  X12: [{ day: 'Saturday', col: 2 }, { day: 'Sunday', col: 4 }],
  X21: [{ day: 'Saturday', col: 7 }, { day: 'Sunday', col: 9 }],
  Y11: [{ day: 'Saturday', col: 3 }, { day: 'Sunday', col: 1 }],
  Y12: [{ day: 'Saturday', col: 4 }, { day: 'Sunday', col: 2 }],
  Y21: [{ day: 'Saturday', col: 9 }, { day: 'Sunday', col: 7 }],
  Z21: [{ day: 'Saturday', col: 8 }, { day: 'Sunday', col: 8 }],
  W21: [{ day: 'Saturday', col: 10 }, { day: 'Sunday', col: 10 }],
  W22: [{ day: 'Saturday', col: 11 }, { day: 'Sunday', col: 11 }],
};

// Lab slots mapped to their day and time columns
const LAB_SCHEDULE: Record<string, { day: string; startCol: number; endCol: number }> = {};

// Generate Monday labs (L1-L6, L31-L36)
['L1', 'L2', 'L3', 'L4', 'L5', 'L6'].forEach((slot, i) => {
  LAB_SCHEDULE[slot] = { day: 'Monday', startCol: i, endCol: i };
});
['L31', 'L32', 'L33', 'L34', 'L35', 'L36'].forEach((slot, i) => {
  LAB_SCHEDULE[slot] = { day: 'Monday', startCol: 8 + i, endCol: 8 + i };
});

// Generate Tuesday labs (L7-L12, L37-L42)
['L7', 'L8', 'L9', 'L10', 'L11', 'L12'].forEach((slot, i) => {
  LAB_SCHEDULE[slot] = { day: 'Tuesday', startCol: i, endCol: i };
});
['L37', 'L38', 'L39', 'L40', 'L41', 'L42'].forEach((slot, i) => {
  LAB_SCHEDULE[slot] = { day: 'Tuesday', startCol: 8 + i, endCol: 8 + i };
});

// Generate Wednesday labs (L13-L18, L43-L48)
['L13', 'L14', 'L15', 'L16', 'L17', 'L18'].forEach((slot, i) => {
  LAB_SCHEDULE[slot] = { day: 'Wednesday', startCol: i, endCol: i };
});
['L43', 'L44', 'L45', 'L46', 'L47', 'L48'].forEach((slot, i) => {
  LAB_SCHEDULE[slot] = { day: 'Wednesday', startCol: 8 + i, endCol: 8 + i };
});

// Generate Thursday labs (L19-L24, L49-L54)
['L19', 'L20', 'L21', 'L22', 'L23', 'L24'].forEach((slot, i) => {
  LAB_SCHEDULE[slot] = { day: 'Thursday', startCol: i, endCol: i };
});
['L49', 'L50', 'L51', 'L52', 'L53', 'L54'].forEach((slot, i) => {
  LAB_SCHEDULE[slot] = { day: 'Thursday', startCol: 8 + i, endCol: 8 + i };
});

// Generate Friday labs (L25-L30, L55-L60)
['L25', 'L26', 'L27', 'L28', 'L29', 'L30'].forEach((slot, i) => {
  LAB_SCHEDULE[slot] = { day: 'Friday', startCol: i, endCol: i };
});
['L55', 'L56', 'L57', 'L58', 'L59', 'L60'].forEach((slot, i) => {
  LAB_SCHEDULE[slot] = { day: 'Friday', startCol: 8 + i, endCol: 8 + i };
});

// Generate Saturday labs (L71-L76, L77-L82)
['L71', 'L72', 'L73', 'L74', 'L75', 'L76'].forEach((slot, i) => {
  LAB_SCHEDULE[slot] = { day: 'Saturday', startCol: i, endCol: i };
});
['L77', 'L78', 'L79', 'L80', 'L81', 'L82'].forEach((slot, i) => {
  LAB_SCHEDULE[slot] = { day: 'Saturday', startCol: 8 + i, endCol: 8 + i };
});

// Generate Sunday labs (L83-L88, L89-L94)
['L83', 'L84', 'L85', 'L86', 'L87', 'L88'].forEach((slot, i) => {
  LAB_SCHEDULE[slot] = { day: 'Sunday', startCol: i, endCol: i };
});
['L89', 'L90', 'L91', 'L92', 'L93', 'L94'].forEach((slot, i) => {
  LAB_SCHEDULE[slot] = { day: 'Sunday', startCol: 8 + i, endCol: 8 + i };
});

/**
 * Resolve a single slot to its times
 */
function resolveSingleSlot(slot: string): SlotTime[] {
  // Check if it's a theory slot
  if (THEORY_SCHEDULE[slot]) {
    return THEORY_SCHEDULE[slot].map((entry) => {
      const timeRange = THEORY_TIMES[entry.col];
      if (!timeRange) return null;
      const [startTime, endTime] = timeRange.split('-');
      return {
        day: entry.day as SlotTime['day'],
        startTime,
        endTime,
      };
    }).filter((t): t is SlotTime => t !== null);
  }

  // Check if it's a lab slot
  if (LAB_SCHEDULE[slot]) {
    const { day, startCol, endCol } = LAB_SCHEDULE[slot];
    const startTimeRange = LAB_TIMES[startCol];
    const endTimeRange = LAB_TIMES[endCol];

    if (!startTimeRange || !endTimeRange) return [];

    const startTime = startTimeRange.split('-')[0];
    const endTime = endTimeRange.split('-')[1];

    return [
      {
        day: day as SlotTime['day'],
        startTime,
        endTime,
      },
    ];
  }

  return [];
}

/**
 * Resolve slot string (supports combined slots like E1+TE1, L47+L48)
 */
export function resolveSlot(slotString: string): SlotTime[] {
  if (!slotString || slotString === 'NIL' || slotString.trim() === '') {
    return [];
  }

  // Handle combined slots (e.g., E1+TE1, L47+L48)
  if (slotString.includes('+')) {
    const parts = slotString.split('+').map((s) => s.trim());
    const allTimes: SlotTime[] = [];

    // Resolve each part
    parts.forEach((part) => {
      allTimes.push(...resolveSingleSlot(part));
    });

    // Merge consecutive lab slots on same day
    return mergeSameDaySlots(allTimes);
  }

  return resolveSingleSlot(slotString);
}

/**
 * Merge consecutive slots on the same day into a single time range
 */
function mergeSameDaySlots(slots: SlotTime[]): SlotTime[] {
  if (slots.length <= 1) return slots;

  // Group by day
  const grouped = slots.reduce((acc, slot) => {
    if (!acc[slot.day]) acc[slot.day] = [];
    acc[slot.day].push(slot);
    return acc;
  }, {} as Record<string, SlotTime[]>);

  // Merge each day's slots
  const merged: SlotTime[] = [];

  Object.entries(grouped).forEach(([day, daySlots]) => {
    // Sort by start time
    daySlots.sort((a, b) => a.startTime.localeCompare(b.startTime));

    // Check if consecutive
    const isConsecutive = daySlots.every((slot, i) => {
      if (i === 0) return true;
      return slot.startTime === daySlots[i - 1].endTime;
    });

    if (isConsecutive && daySlots.length > 1) {
      // Merge into single slot
      merged.push({
        day: day as SlotTime['day'],
        startTime: daySlots[0].startTime,
        endTime: daySlots[daySlots.length - 1].endTime,
      });
    } else {
      // Keep separate
      merged.push(...daySlots);
    }
  });

  return merged;
}

/**
 * Get readable description of slot times
 */
export function getSlotDescription(slotString: string): string {
  const times = resolveSlot(slotString);
  if (times.length === 0) return 'No schedule';

  return times
    .map((t) => `${t.day.slice(0, 3)} ${t.startTime}-${t.endTime}`)
    .join(', ');
}
