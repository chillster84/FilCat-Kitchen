export function scaleLine(line, factor) {
  if (factor === 1) return line;

  // Match mixed fractions: "1 1/2 cups"
  const mixed = line.match(/^(\d+)\s+(\d+)\/(\d+)(.*)/);
  if (mixed) {
    const val = (parseInt(mixed[1]) + parseInt(mixed[2]) / parseInt(mixed[3])) * factor;
    return formatNum(val) + mixed[4];
  }

  // Match simple fractions: "1/2 tsp"
  const frac = line.match(/^(\d+)\/(\d+)(.*)/);
  if (frac) {
    const val = (parseInt(frac[1]) / parseInt(frac[2])) * factor;
    return formatNum(val) + frac[3];
  }

  // Match decimals / whole numbers: "2.5" or "2"
  const num = line.match(/^(\d*\.?\d+)(.*)/);
  if (num && num[1]) {
    const val = parseFloat(num[1]) * factor;
    return formatNum(val) + num[2];
  }

  return line;
}

function formatNum(val) {
  val = Math.round(val * 100) / 100;
  const whole = Math.floor(val);
  const remainder = val - whole;

  const fractions = [
    { val: 0.125, text: "1/8" },
    { val: 0.25, text: "1/4" },
    { val: 0.333, text: "1/3" },
    { val: 0.5, text: "1/2" },
    { val: 0.666, text: "2/3" },
    { val: 0.75, text: "3/4" }
  ];

  if (remainder < 0.05) return whole === 0 ? "0" : `${whole}`;
  if (remainder > 0.95) return `${whole + 1}`;

  const match = fractions.find(f => Math.abs(remainder - f.val) < 0.06);
  if (match) {
    return whole > 0 ? `${whole} ${match.text}` : match.text;
  }

  return parseFloat(val.toFixed(2)).toString();
}
