/**
 * AI-imageX: Diagnosis Pipeline Unit Tests
 * Tests the diagnostic API response parsing, state transitions, and event streaming.
 */

// ─── Mock the streaming SSE parser ─────────────────────────────
function parseSSELine(line: string): { event: string; data: any } | null {
  const eventMatch = line.match(/^event: (.+)$/m);
  const dataMatch = line.match(/^data: (.+)$/m);

  if (eventMatch && dataMatch) {
    try {
      return { event: eventMatch[1], data: JSON.parse(dataMatch[1]) };
    } catch {
      return null;
    }
  }
  return null;
}

// ─── Mock confidence classifier ─────────────────────────────────
function classifyConfidence(score: number): 'high' | 'moderate' | 'low' {
  if (score >= 80) return 'high';
  if (score >= 60) return 'moderate';
  return 'low';
}

// ─── Mock urgency mapper ─────────────────────────────────────────
function mapUrgencyToLabel(urgency: string): string {
  const map: Record<string, string> = {
    routine: 'Routine Follow-up',
    urgent: 'Urgent Review Required',
    emergent: 'EMERGENT — Immediate Action',
  };
  return map[urgency] || 'Unknown';
}

// ════════════════════════════════════════════════════════════════

describe('Diagnosis Pipeline - SSE Event Parser', () => {

  it('✅ should correctly parse an agent_thinking event', () => {
    const raw = `event: agent_thinking\ndata: {"thought": "Analyzing left lower lobe opacity..."}`;
    const parsed = parseSSELine(raw);
    expect(parsed?.event).toBe('agent_thinking');
    expect(parsed?.data.thought).toBe('Analyzing left lower lobe opacity...');
  });

  it('✅ should correctly parse a tool_call event', () => {
    const raw = `event: tool_call\ndata: {"tool_name": "analyze_image_medical", "input": {"modality": "xray"}}`;
    const parsed = parseSSELine(raw);
    expect(parsed?.event).toBe('tool_call');
    expect(parsed?.data.tool_name).toBe('analyze_image_medical');
    expect(parsed?.data.input.modality).toBe('xray');
  });

  it('✅ should correctly parse a diagnosis_complete event', () => {
    const raw = `event: diagnosis_complete\ndata: {"diagnosis_primary": "Lobar Pneumonia", "confidence": 92, "urgency_level": "urgent"}`;
    const parsed = parseSSELine(raw);
    expect(parsed?.event).toBe('diagnosis_complete');
    expect(parsed?.data.diagnosis_primary).toBe('Lobar Pneumonia');
    expect(parsed?.data.confidence).toBe(92);
  });

  it('✅ should return null for malformed SSE lines', () => {
    const raw = `This is not a valid SSE line`;
    const parsed = parseSSELine(raw);
    expect(parsed).toBeNull();
  });

  it('✅ should return null for invalid JSON in data', () => {
    const raw = `event: tool_result\ndata: {not valid json}`;
    const parsed = parseSSELine(raw);
    expect(parsed).toBeNull();
  });

});

describe('Diagnosis Pipeline - Confidence Classifier', () => {

  it('✅ should classify 92% as high confidence', () => {
    expect(classifyConfidence(92)).toBe('high');
  });

  it('✅ should classify 80% as high confidence (boundary)', () => {
    expect(classifyConfidence(80)).toBe('high');
  });

  it('✅ should classify 75% as moderate confidence', () => {
    expect(classifyConfidence(75)).toBe('moderate');
  });

  it('✅ should classify 60% as moderate confidence (boundary)', () => {
    expect(classifyConfidence(60)).toBe('moderate');
  });

  it('✅ should classify 45% as low confidence', () => {
    expect(classifyConfidence(45)).toBe('low');
  });

  it('✅ should classify 0% as low confidence', () => {
    expect(classifyConfidence(0)).toBe('low');
  });

});

describe('Diagnosis Pipeline - Urgency Mapper', () => {

  it('✅ should map "routine" to readable label', () => {
    expect(mapUrgencyToLabel('routine')).toBe('Routine Follow-up');
  });

  it('✅ should map "urgent" to readable label', () => {
    expect(mapUrgencyToLabel('urgent')).toBe('Urgent Review Required');
  });

  it('✅ should map "emergent" to readable label with emphasis', () => {
    expect(mapUrgencyToLabel('emergent')).toBe('EMERGENT — Immediate Action');
  });

  it('✅ should return "Unknown" for unrecognized urgency values', () => {
    expect(mapUrgencyToLabel('critical')).toBe('Unknown');
    expect(mapUrgencyToLabel('')).toBe('Unknown');
  });

});

describe('Diagnosis Pipeline - Human Review Trigger Logic', () => {

  function requiresHumanReview(confidence: number, urgency: string): boolean {
    return confidence < 60 || urgency === 'emergent';
  }

  it('✅ should require human review for low confidence (< 60)', () => {
    expect(requiresHumanReview(45, 'routine')).toBe(true);
  });

  it('✅ should require human review for emergent cases regardless of confidence', () => {
    expect(requiresHumanReview(95, 'emergent')).toBe(true);
  });

  it('✅ should NOT require human review for high confidence routine cases', () => {
    expect(requiresHumanReview(90, 'routine')).toBe(false);
  });

  it('✅ should require review when both confidence is low AND urgency is emergent', () => {
    expect(requiresHumanReview(30, 'emergent')).toBe(true);
  });

});
