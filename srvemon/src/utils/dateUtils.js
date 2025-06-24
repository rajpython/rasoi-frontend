// utils/dateUtils.js
export function hundredYearsAgo() {
    const today = new Date();
    let year = today.getFullYear() - 100;
    let month = today.getMonth();
    let day = today.getDate();
  
    // Handle Feb 29 on non-leap years
    if (month === 1 && day === 29 && !isLeapYear(year)) {
      day = 28;
    }
  
    return new Date(year, month, day).toISOString().split("T")[0];
  }
  
  function isLeapYear(year) {
    return (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);
  }
  

// src/utils/date.js

// Returns today's date string in local timezone: "YYYY-MM-DD"
export const getLocalToday = () => {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
};
  
//   // Returns true if the given date string matches today's local date
// export const isToday = (dateStr) => {
//     const todayStr = getLocalToday();
//     return dateStr === todayStr;
// };
  

// src/utils/date.js

export const getSelectableStartDate = () => {
    const now = new Date();
  
    const cutoff = new Date();
    cutoff.setHours(20, 0, 0, 0); // 8:00 PM today
  
    const baseDate = now > cutoff ? new Date(now.setDate(now.getDate() + 1)) : now;
  
    const yyyy = baseDate.getFullYear();
    const mm = String(baseDate.getMonth() + 1).padStart(2, '0');
    const dd = String(baseDate.getDate()).padStart(2, '0');
  
    return `${yyyy}-${mm}-${dd}`;
  };
  
  export const isToday = (dateStr) => {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    const todayStr = `${yyyy}-${mm}-${dd}`;
    return dateStr === todayStr;
  };
  

  // src/utils/dateFormat.js

  export function formatDate(dateString) {
    if (!dateString) return "";
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
