// === Run on Page Load ===
window.onload = () => {
  loadTasks();
  loadMood();
  showDailyQuote();
  loadHabits();
};

// === Task Manager ===
function addTask() {
  const taskInput = document.getElementById('taskInput');
  const taskTime = document.getElementById('taskTime');
  const taskText = taskInput.value.trim();
  const timeValue = taskTime.value;

  if (!taskText || !timeValue) {
    alert("Please enter both task and time.");
    return;
  }

  const task = {
    id: Date.now(),
    text: taskText,
    time: timeValue
  };

  let tasks = JSON.parse(localStorage.getItem("dailyroots_tasks")) || [];
  tasks.push(task);
  localStorage.setItem("dailyroots_tasks", JSON.stringify(tasks));

  taskInput.value = "";
  taskTime.value = "";
  loadTasks();
}

function loadTasks() {
  const taskList = document.getElementById("taskList");
  taskList.innerHTML = "";
  const tasks = JSON.parse(localStorage.getItem("dailyroots_tasks")) || [];

  if (tasks.length === 0) {
    taskList.innerHTML = `<li style="color: #777;">No tasks added yet.</li>`;
    return;
  }

  tasks.forEach(task => {
    const li = document.createElement("li");
    li.innerHTML = `
      <span><strong>${task.time}</strong> - ${task.text}</span>
      <button onclick="deleteTask(${task.id})">&times;</button>
    `;
    taskList.appendChild(li);
  });
}

function deleteTask(id) {
  let tasks = JSON.parse(localStorage.getItem("dailyroots_tasks")) || [];
  tasks = tasks.filter(task => task.id !== id);
  localStorage.setItem("dailyroots_tasks", JSON.stringify(tasks));
  loadTasks();
}

// === Mood Tracker ===
function saveMood() {
  const mood = document.getElementById("moodSelect").value;
  const today = new Date().toISOString().split("T")[0];
  localStorage.setItem("mood_" + today, mood);
}

function loadMood() {
  const today = new Date().toISOString().split("T")[0];
  const savedMood = localStorage.getItem("mood_" + today);
  if (savedMood) {
    document.getElementById("moodSelect").value = savedMood;
  }
}

// === Daily Habit Tracker ===
const defaultHabits = ["Drink Water", "Read Book", "Meditate", "Exercise"];

function loadHabits() {
  const today = new Date().toISOString().split("T")[0];
  let saved = JSON.parse(localStorage.getItem("habits_" + today)) || {};
  const habitList = document.getElementById("habitList");
  habitList.innerHTML = "";

  const allHabits = [...new Set([...defaultHabits, ...Object.keys(saved)])];
  allHabits.forEach(habit => {
    const isChecked = saved[habit] || false;
    const li = document.createElement("li");
    li.innerHTML = `
      <label style="display:flex;align-items:center;gap:10px;">
        <input type="checkbox" ${isChecked ? "checked" : ""} onchange="toggleHabit('${habit}', this.checked)">
        ${habit}
      </label>
    `;
    habitList.appendChild(li);
  });
}

function toggleHabit(habit, checked) {
  const today = new Date().toISOString().split("T")[0];
  let saved = JSON.parse(localStorage.getItem("habits_" + today)) || {};
  saved[habit] = checked;
  localStorage.setItem("habits_" + today, JSON.stringify(saved));
}

function addCustomHabit() {
  const input = document.getElementById("newHabitInput");
  const habit = input.value.trim();
  if (!habit) return;
  input.value = "";

  const today = new Date().toISOString().split("T")[0];
  let saved = JSON.parse(localStorage.getItem("habits_" + today)) || {};
  saved[habit] = false;
  localStorage.setItem("habits_" + today, JSON.stringify(saved));
  loadHabits();
}

// === Daily Quote ===
const quotes = [
  { text: "Discipline is doing what needs to be done, even when you don’t feel like doing it.", author: "Unknown", theme: "productivity" },
  { text: "Success doesn't come from what you do occasionally. It comes from what you do consistently.", author: "Marie Forleo", theme: "productivity" },
  { text: "You don’t need to be perfect. You just need to start.", author: "Unknown", theme: "productivity" },
  { text: "The best way to get something done is to begin.", author: "Unknown", theme: "productivity" },
  { text: "Your future is created by what you do today, not tomorrow.", author: "Robert Kiyosaki", theme: "productivity" },
  { text: "Don’t wait. The time will never be just right.", author: "Napoleon Hill", theme: "productivity" },
  { text: "The journey of a thousand miles begins with one step.", author: "Lao Tzu", theme: "growth" },
  { text: "Little by little, a little becomes a lot.", author: "Tanzanian Proverb", theme: "growth" },
  { text: "One day or day one. You decide.", author: "Unknown", theme: "mindset" },
  { text: "Don’t limit your challenges. Challenge your limits.", author: "Jerry Dunn", theme: "mindset" },
  { text: "The expert in anything was once a beginner.", author: "Helen Hayes", theme: "study" },
  { text: "A little progress each day adds up to big results.", author: "Unknown", theme: "study" },
  { text: "The secret of getting ahead is getting started.", author: "Mark Twain", theme: "study" },
  { text: "There are no shortcuts to any place worth going.", author: "Beverly Sills", theme: "study" },
  { text: "Work hard in silence. Let your success make the noise.", author: "Frank Ocean", theme: "study" },
  { text: "Education is the most powerful weapon which you can use to change the world.", author: "Nelson Mandela", theme: "study" },
  { text: "Success is no accident. It is hard work and learning.", author: "Pelé", theme: "study" },
  { text: "Take care of your body. It’s the only place you have to live.", author: "Jim Rohn", theme: "health" },
  { text: "Rest and self-care are so important.", author: "Eleanor Brown", theme: "health" },
  { text: "You can’t pour from an empty cup. Take care of yourself first.", author: "Unknown", theme: "health" },
  { text: "Health is not just about what you eat, but also what you think.", author: "Unknown", theme: "health" },
  { text: "Mental health is just as important as physical health.", author: "Unknown", theme: "health" },
  { text: "Success is the sum of small efforts, repeated daily.", author: "Robert Collier", theme: "success" },
  { text: "Great things never come from comfort zones.", author: "Unknown", theme: "success" },
  { text: "Be stronger than your excuses.", author: "Unknown", theme: "success" },
  { text: "We are what we repeatedly do. Excellence, then, is not an act but a habit.", author: "Aristotle", theme: "habit" },
  { text: "Habits are the compound interest of self-improvement.", author: "James Clear", theme: "habit" },
  { text: "Your habits will determine your future.", author: "Jack Canfield", theme: "habit" },
  { text: "Success doesn’t rush. The greatest reward is lasting change.", author: "Unknown", theme: "habit" },
  { text: "Motivation gets you going, but discipline keeps you growing.", author: "John C. Maxwell", theme: "habit" },
  { text: "വിജയം നമ്മിൽ നിന്നാണ് ആരംഭിക്കുന്നത്.", author: "A. P. J. അബ്ദുൽ കലാം", theme: "success" },
  { text: "നിങ്ങളുടെ സ്വപ്നങ്ങൾ ഭീതിയേക്കാൾ വലിയവാകട്ടെ.", author: "ധീരുബായി അംബാനി", theme: "mindset" },
  { text: "നിങ്ങൾ ചെയ്യുന്ന ചെറിയ കാര്യങ്ങൾ വലിയ വിജയങ്ങളിലേക്കുള്ള പടിയാകാം.", author: "Unknown", theme: "habit" },
  { text: "നിന്റെ ലക്ഷ്യം വലിയതായിരിക്കണം, അതിനായി നീ എപ്പോഴും പ്രാപ്തനാകണം.", author: "Swami Vivekananda", theme: "success" },
  { text: "ദൈനംദിനമായി നീ ചെയ്യുന്ന ചെറിയ ശ്രമങ്ങൾ ജീവിതത്തെ മാറ്റും.", author: "Unknown", theme: "habit" },
  { text: "ശ്രമം എല്ലായ്പ്പോഴും വിജയത്തിലേക്കുള്ള വാതിലാണ്.", author: "Unknown", theme: "mindset" },
  { text: "Be the energy you want to attract.", author: "Unknown", theme: "mindset" },
  { text: "Stay focused. Your breakthrough is coming.", author: "Unknown", theme: "growth" },
  { text: "When you feel like quitting, remember why you started.", author: "Unknown", theme: "discipline" },
  { text: "ദിവസം എങ്ങനെ ആരംഭിക്കുകയാണ്, അതുപോലെ ആയിരിക്കും അതിന്റെ ഗതി.", author: "Unknown", theme: "routine" },
  { text: "Wake up with determination, go to bed with satisfaction.", author: "Unknown", theme: "routine" }
];

function showDailyQuote() {
  const today = new Date().toISOString().split("T")[0];
  let index;

  if (localStorage.getItem("quote_day") === today) {
    index = localStorage.getItem("quote_index");
  } else {
    index = Math.floor(Math.random() * quotes.length);
    localStorage.setItem("quote_day", today);
    localStorage.setItem("quote_index", index);
  }

  const quote = quotes[index];
  document.getElementById("dailyQuote").innerHTML = `
    “${quote.text}”<br><small>– ${quote.author}</small>
  `;
}
