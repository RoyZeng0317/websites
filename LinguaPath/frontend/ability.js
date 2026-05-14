const SKILL_KEYS = [
  'grammar',
  'vocabulary',
  'reading',
  'listening',
  'speaking',
  'writing',
];

const SKILL_NAMES = {
  grammar: 'Grammar',
  vocabulary: 'Vocabulary',
  reading: 'Reading',
  listening: 'Listening',
  speaking: 'Speaking',
  writing: 'Writing',
};

const SKILL_COLORS = {
  grammar: '#e8c97e',
  vocabulary: '#7eb8e8',
  reading: '#7ec8a0',
  listening: '#c87ee8',
  speaking: '#e8a07e',
  writing: '#e87e9e',
};

const COURSE_SKILL_WEIGHTS = {
  'beginner-foundations': {
    grammar: 30,
    vocabulary: 40,
    reading: 30,
    listening: 20,
    speaking: 10,
    writing: 10,
  },
  'everyday-conversations': {
    grammar: 10,
    vocabulary: 20,
    reading: 10,
    listening: 30,
    speaking: 40,
    writing: 5,
  },
  'grammar-essentials': {
    grammar: 50,
    vocabulary: 15,
    reading: 20,
    listening: 5,
    speaking: 5,
    writing: 30,
  },
  'advanced-fluency': {
    grammar: 20,
    vocabulary: 25,
    reading: 20,
    listening: 15,
    speaking: 20,
    writing: 30,
  },
};

const COURSE_TOTALS = {
  'beginner-foundations': 8,
  'everyday-conversations': 7,
  'grammar-essentials': 9,
  'advanced-fluency': 8,
};

function computeSkills(progress = {}) {
  const raw = {};
  const max = {};

  SKILL_KEYS.forEach((skill) => {
    raw[skill] = 0;
    max[skill] = 0;
  });

  Object.entries(COURSE_SKILL_WEIGHTS).forEach(([courseId, weights]) => {
    const total = COURSE_TOTALS[courseId] || 1;
    const completed = progress[courseId]
      ? Object.values(progress[courseId]).filter(Boolean).length
      : 0;
    const ratio = Math.min(completed / total, 1);

    SKILL_KEYS.forEach((skill) => {
      raw[skill] += weights[skill] * ratio;
      max[skill] += weights[skill];
    });
  });

  return SKILL_KEYS.reduce((scores, skill) => {
    scores[skill] = max[skill] > 0 ? Math.round((raw[skill] / max[skill]) * 100) : 0;
    return scores;
  }, {});
}

function polarToCartesian(cx, cy, radius, angle) {
  return {
    x: cx + radius * Math.cos(angle),
    y: cy + radius * Math.sin(angle),
  };
}

function drawRadar(scores) {
  const canvas = document.getElementById('skills-radar');
  if (!canvas) return;

  const parentWidth = canvas.parentElement?.offsetWidth || 360;
  const dpr = window.devicePixelRatio || 1;
  const size = Math.min(parentWidth * 0.9, 360);

  canvas.width = size * dpr;
  canvas.height = size * dpr;
  canvas.style.width = `${size}px`;
  canvas.style.height = `${size}px`;

  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  ctx.clearRect(0, 0, size, size);

  const cx = size / 2;
  const cy = size / 2;
  const radius = size * 0.33;
  const startAngle = -Math.PI / 2;
  const step = (Math.PI * 2) / SKILL_KEYS.length;

  for (let ring = 1; ring <= 4; ring += 1) {
    const ringRadius = (radius * ring) / 4;
    ctx.beginPath();
    SKILL_KEYS.forEach((_, index) => {
      const point = polarToCartesian(cx, cy, ringRadius, startAngle + step * index);
      index === 0 ? ctx.moveTo(point.x, point.y) : ctx.lineTo(point.x, point.y);
    });
    ctx.closePath();
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
    ctx.lineWidth = 1;
    ctx.stroke();
  }

  SKILL_KEYS.forEach((skill, index) => {
    const angle = startAngle + step * index;
    const axis = polarToCartesian(cx, cy, radius, angle);
    const label = polarToCartesian(cx, cy, radius + 28, angle);

    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.lineTo(axis.x, axis.y);
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
    ctx.stroke();

    ctx.fillStyle = '#e8e6e0';
    ctx.font = "500 12px 'DM Sans', sans-serif";
    ctx.textAlign = label.x < cx - 5 ? 'right' : label.x > cx + 5 ? 'left' : 'center';
    ctx.textBaseline = label.y < cy - 5 ? 'bottom' : label.y > cy + 5 ? 'top' : 'middle';
    ctx.fillText(SKILL_NAMES[skill], label.x, label.y);
  });

  ctx.beginPath();
  SKILL_KEYS.forEach((skill, index) => {
    const value = Math.max(0, Math.min(scores[skill] || 0, 100));
    const point = polarToCartesian(cx, cy, radius * (value / 100), startAngle + step * index);
    index === 0 ? ctx.moveTo(point.x, point.y) : ctx.lineTo(point.x, point.y);
  });
  ctx.closePath();
  ctx.fillStyle = 'rgba(232, 201, 126, 0.18)';
  ctx.strokeStyle = '#e8c97e';
  ctx.lineWidth = 2;
  ctx.fill();
  ctx.stroke();

  SKILL_KEYS.forEach((skill, index) => {
    const value = Math.max(0, Math.min(scores[skill] || 0, 100));
    const point = polarToCartesian(cx, cy, radius * (value / 100), startAngle + step * index);
    ctx.beginPath();
    ctx.arc(point.x, point.y, 4, 0, Math.PI * 2);
    ctx.fillStyle = SKILL_COLORS[skill];
    ctx.fill();
  });
}

function renderLegend(scores) {
  const legend = document.getElementById('skills-legend');
  if (!legend) return;

  legend.innerHTML = SKILL_KEYS.map((skill) => `
    <div class="radar-legend-item">
      <span class="radar-dot" style="background:${SKILL_COLORS[skill]}"></span>
      <span>${SKILL_NAMES[skill]}</span>
      <strong>${scores[skill] || 0}</strong>
    </div>
  `).join('');
}

function renderSkills(scores) {
  drawRadar(scores);
  renderLegend(scores);

  const avgValueEl = document.getElementById('avgValue');
  if (avgValueEl) {
    const average = SKILL_KEYS.reduce((sum, skill) => sum + (scores[skill] || 0), 0) / SKILL_KEYS.length;
    avgValueEl.textContent = Math.round(average).toString();
  }
}

window.LinguaPathAbility = {
  computeSkills,
  renderSkills,
};
