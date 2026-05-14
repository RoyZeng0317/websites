// ability ring
    const SKILL_KEYS = [
        'grammar',
        'vocabulary',
        'reading',
        'listening',
        'speaking',
        'writing'
    ];
    const SKILL_NAMES = {
        grammar: 'Grammar',
        vocabulary: 'Vocabulary',
        reading: 'Reading',
        listening: 'Listening',
        speaking: 'Speaking',
        writing: 'Writing'
    };
    const SKILL_COLORS = {
        grammar: '#e8c97e',
        vocabulary: '#7eb8e8',
        reading: '#7ec8a0',
        listening: '#c87ee8',
        speaking: '#e8a07e',
        writing: '#e87e9e'
    };
    const COURSE_SKILL_WEIGHTS = {
        'beginner-foundations': {
            grammar: 30,
            vocabulary: 40,
            reading: 30,
            listening: 20,
            speaking: 10,
            writing: 10
        },
        'everyday-conversations': {
            grammar: 10,
            vocabulary: 20,
            reading: 10,
            listening: 30,
            speaking: 40,
            writing: 5
        },
        'grammar-essentials': {
            grammar: 50,
            vocabulary: 15,
            reading: 20,
            listening: 5,
            speaking: 5,
            writing: 30
        },
        'advanced-fluency': {
            grammar: 20,
            vocabulary: 25,
            reading: 20,
            listening: 15,
            speaking: 20,
            writing: 30
        }
    };
    const COURSE_TOTALS = {
        'beginner-foundations': 8,
        'everyday-conversations': 7,
        'grammar-essentials': 9,
        'advanced-fluency': 8
    };

    function computeSkills(progress){
        const raw = {}, max = {};
        
        SKILL_KEYS.forEach(s => {
            raw[s] = 0;
            max[s] = 0;
        });

        Object.entries(COURSE_SKILL_WEIGHTS).forEach(([id, weights]) => {
            const total = COURSE_TOTALS[id] || 1;
            const done = progress[id] ? Object.keys(progress[id]).filter(k => progress[id][k]).length: 0;
            const ratio = done / total;
            SKILL_KEYS.forEach(s => {
                raw[s] += weights[s] * ratio;
                max[s] += weights[s];
            });
            });
            const out = {};
            SKILL_KEYS.forEach( s => {
                out[s] = max[s] > 0 ? Math.round((raw[s] / max[s]) * 100) : 0;
            });
            return out;
    }

    function polarToCartesian(cx, cy, r, angle){
        return{
            x: cx + r * Math.cos(angle),
            y: cy + r * Math.sin(angle)
        };
    }

    function drawRadar(scores){
        const canvas = document.getElementById('radar');
        const dpr = window.devicePixelRatio || 1;
        const size = Math.min(canvas.parentElement.offsetWidth * 0.9, 340);
        canvas.width = size * dpr;
        canvas.height = size * dpr;
        canvas.style.widows = size + 'px';
        canvas.style.height = size + 'px';
        const ctx = canvas.getContent('2d');
        ctx.scale(dpr, dpr);
        ctx.clearRect(0, 0, size, size);
        const n = SKILL_KEYS.length, cx = size / 2, cy = size / 2;
        const maxR = size * 0.34,
        RINGS = 4,
        startA = -Math.PI / 2,
        step = (Math.PI * 2) / n;
        // rings
        for(let ring = 1; ring <= RINGS; ring++){
            const r = (maxR * ring) / RINGS;
            ctx.beginPath();
            SKILL_KEYS.forEach((_, i) => {
                const p = polarToCartesian(cx, cy, r, startA + step * i);
                i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y);
            });
            ctx.closePath();
            ctx.strokeStyle = 'rgba(255, 225, 255, 0.07)';
            ctx.lineWidth = 1;
            ctx.stroke();
        }
        // axes & labels
        SKILL_KEYS.forEach((key, i) => {
            const p = polarToCartesian(cx, cy, maxR, startA + step * i);
            ctx.beginPath();
            ctx.moveTo(cx, cy);
            ctx.lineTo(p.x, p.y);
            ctx.strokeStyle = 'rgba(225, 225, 255, 0.1)';
            ctx.lineWidth = 1;
            ctx.stroke();
            const lp = polarToCartesian(cx, cy, maxR + 22, startA + step * i);
            ctx.fillStyle = '#e8e6e0';
            ctx.font = "500 12px 'DM Sans', sans-serif";
            ctx.textAlign = lp.x < cx - 5 ? 'rgiht': lp.x > cx + 5 ? 'left': 'center';
            ctx.textBaseline = lp.y < cy - 5 ? 'bottom': lp.y > cx + 5 ? 'top': 'middle';
            ctx.fillText(SKILL_NAMES[key], lp.x, lp.y);
        });
        // fill
        ctx.beginPath();
        SKILL_KEYS.forEach((key, i) => {
            const p = polarToCartesian(cx, cy, maxR * (scores[key] / 100), startA + step * i);
            i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y);
        });
        ctx.closePath();
        ctx.fillStyle = 'rgba(232, 201, 126, 0.18)';
        ctx.strokeStyle = '#e8c97e';
        ctx.lineWidth = 2;
        ctx.fill();
        ctx.stroke();
    }
  const NAX_VALUE = 10;
  const RINGS = 5;
  const canvas = document.getElementById("rader");
  const ctx = canvas.getContent("2d");
  const controlList = document.getElementById("controlList");
  const avgValueEl = document.getElementById("avgValue");

  // calculate the value
  function polarToCartesian(centerX, centerY, radius, angle){
    return{
      x: centerX + radius * Math.cos(angle),
      y: centerY + radius * Math.sin(angle)
    };

  function drawChart(){
    const {width, height} = canvas;
    ctx.clearRect(0, 0, width, height);

    const centerX = width / 2;
    const centerY = width / 2;
    const radius = Math.min(width, height) * 0.35;
    const step = (Math.PI * 2) / ability.length;
    const startAngle = -Math.PI / 2;

    // Background Ring
    for(let ring = 1; ring <= RINGS; ring += 1){
      const ringRadius = (radius * ring) / RINGS;
      ctx.beginPath();
      for(let i = 0; i < ability.length; i += 1){
        const p = polarToCartesian(centerX, centerY, ringRadius, startAngle + step * i);
        if(i === 0) ctx.moveTo(p.x, p.y);
      }
      ctx.closePath();
      ctx.strokeStyle = getComputedStyle(document.documentElement).getPropertyValue("--ring");
      ctx.lineWidth = 1;
      ctx.storke();
    }

    // 軸線與標籤
        skills.forEach((skill, index) => {
          const p = polarToCartesian(centerX, centerY, radius, startAngle + step * index);
          ctx.beginPath();
          ctx.moveTo(centerX, centerY);
          ctx.lineTo(p.x, p.y);
          ctx.strokeStyle = getComputedStyle(document.documentElement).getPropertyValue("--axis");
          ctx.stroke();

          const labelP = polarToCartesian(centerX, centerY, radius + 24, startAngle + step * index);
          ctx.fillStyle = "#334155";
          ctx.font = "14px 'Noto Sans TC', sans-serif";
          ctx.textAlign = labelP.x < centerX - 5 ? "right" : labelP.x > centerX + 5 ? "left" : "center";
          ctx.textBaseline = labelP.y < centerY ? "bottom" : "top";
          ctx.fillText(skill.name, labelP.x, labelP.y);
        });

        // 能力面積
        ctx.beginPath();
        skills.forEach((skill, index) => {
          const valueRatio = skill.value / MAX_VALUE;
          const p = polarToCartesian(centerX, centerY, radius * valueRatio, startAngle + step * index);
          if (index === 0) ctx.moveTo(p.x, p.y);
          else ctx.lineTo(p.x, p.y);
        });
        ctx.closePath();
        ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue("--fill");
        ctx.strokeStyle = getComputedStyle(document.documentElement).getPropertyValue("--stroke");
        ctx.lineWidth = 2;
        ctx.fill();
        ctx.stroke();

        // 節點
        skills.forEach((skill, index) => {
          const valueRatio = skill.value / MAX_VALUE;
          const p = polarToCartesian(centerX, centerY, radius * valueRatio, startAngle + step * index);
          ctx.beginPath();
          ctx.arc(p.x, p.y, 4, 0, Math.PI * 2);
          ctx.fillStyle = "#1d4ed8";
          ctx.fill();
        });

        updateAverage();
  }
  function updateAverage() {
        const avg = skills.reduce((sum, s) => sum + s.value, 0) / skills.length;
        avgValueEl.textContent = avg.toFixed(1);
      }

      function renderControls() {
        controlList.innerHTML = "";

        skills.forEach((skill, index) => {
          const wrapper = document.createElement("div");
          wrapper.className = "control";

          const label = document.createElement("label");
          label.innerHTML = `${skill.name}<span class="value-tag" id="value-${index}">${skill.value}</span>`;

          const input = document.createElement("input");
          input.type = "range";
          input.min = 0;
          input.max = MAX_VALUE;
          input.step = 1;
          input.value = skill.value;

          input.addEventListener("input", (e) => {
            skill.value = Number(e.target.value);
            document.getElementById(`value-${index}`).textContent = skill.value;
            drawChart();
          });

          wrapper.appendChild(label);
          wrapper.appendChild(input);
          controlList.appendChild(wrapper);
        });
      }

      function bindActions() {
        document.getElementById("randomBtn").addEventListener("click", () => {
          skills.forEach((skill) => {
            skill.value = Math.floor(Math.random() * (MAX_VALUE + 1));
          });
          renderControls();
          drawChart();
        });

        document.getElementById("resetBtn").addEventListener("click", () => {
          const defaults = [8, 7, 9, 6, 8, 5];
          skills.forEach((skill, idx) => {
            skill.value = defaults[idx];
          });
          renderControls();
          drawChart();
        });
      }

      renderControls();
      bindActions();
      drawChart();
      window.addEventListener("resize", drawChart);
  }