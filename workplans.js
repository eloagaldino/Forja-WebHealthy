/**
 * workoutPlans.js
 * Planos de treino pré-definidos, organizados por objetivo corporal.
 * Cada objetivo tem uma divisão (split) de dias, e cada dia uma lista
 * de exercícios com séries/repetições sugeridas.
 */

const WORKOUT_PLANS = {
    emagrecimento: {
      label: 'Emagrecimento',
      subtitle: 'Full body + foco cardiovascular · 4x por semana',
      days: [
        {
          id: 'a', title: 'Treino A — Full Body + Cardio', exercises: [
            { name: 'Agachamento livre', sets: 3, reps: '15' },
            { name: 'Flexão de braço', sets: 3, reps: '12' },
            { name: 'Remada com halteres', sets: 3, reps: '15' },
            { name: 'Afundo (passada)', sets: 3, reps: '12 cada perna' },
            { name: 'Prancha abdominal', sets: 3, reps: '40s' },
            { name: 'Esteira / bike — intervalado', sets: 1, reps: '15 min' },
          ],
        },
        {
          id: 'b', title: 'Treino B — Circuito Metabólico', exercises: [
            { name: 'Burpee', sets: 4, reps: '10' },
            { name: 'Mountain climber', sets: 4, reps: '30s' },
            { name: 'Elevação pélvica (glúteo)', sets: 3, reps: '15' },
            { name: 'Remada baixa (polia/elástico)', sets: 3, reps: '15' },
            { name: 'Abdominal bicicleta', sets: 3, reps: '20' },
            { name: 'Pular corda', sets: 3, reps: '1 min' },
          ],
        },
        {
          id: 'c', title: 'Treino C — Full Body + Core', exercises: [
            { name: 'Levantamento terra (leve)', sets: 3, reps: '12' },
            { name: 'Desenvolvimento com halteres', sets: 3, reps: '12' },
            { name: 'Puxada frontal', sets: 3, reps: '12' },
            { name: 'Step up no banco', sets: 3, reps: '12 cada perna' },
            { name: 'Prancha lateral', sets: 3, reps: '30s cada lado' },
            { name: 'Cardio contínuo (moderado)', sets: 1, reps: '20 min' },
          ],
        },
      ],
    },
  
    hipertrofia: {
      label: 'Ganho de Massa (Hipertrofia)',
      subtitle: 'Divisão ABC · cargas progressivas · 4-5x por semana',
      days: [
        {
          id: 'a', title: 'Treino A — Peito e Tríceps', exercises: [
            { name: 'Supino reto com barra', sets: 4, reps: '8-10' },
            { name: 'Supino inclinado com halteres', sets: 4, reps: '10' },
            { name: 'Crucifixo na máquina/peck deck', sets: 3, reps: '12' },
            { name: 'Tríceps testa', sets: 3, reps: '10' },
            { name: 'Tríceps corda na polia', sets: 3, reps: '12' },
            { name: 'Paralelas (mergulho)', sets: 3, reps: '10' },
          ],
        },
        {
          id: 'b', title: 'Treino B — Costas e Bíceps', exercises: [
            { name: 'Puxada frontal (pulley)', sets: 4, reps: '10' },
            { name: 'Remada curvada com barra', sets: 4, reps: '8-10' },
            { name: 'Remada unilateral (serrote)', sets: 3, reps: '10 cada' },
            { name: 'Rosca direta com barra', sets: 3, reps: '10' },
            { name: 'Rosca alternada com halteres', sets: 3, reps: '12' },
            { name: 'Rosca martelo', sets: 3, reps: '12' },
          ],
        },
        {
          id: 'c', title: 'Treino C — Pernas e Ombros', exercises: [
            { name: 'Agachamento livre', sets: 4, reps: '8-10' },
            { name: 'Leg press 45°', sets: 4, reps: '10' },
            { name: 'Cadeira extensora', sets: 3, reps: '12' },
            { name: 'Mesa flexora', sets: 3, reps: '12' },
            { name: 'Desenvolvimento com halteres', sets: 4, reps: '10' },
            { name: 'Elevação lateral', sets: 3, reps: '12' },
          ],
        },
      ],
    },
  
    definicao: {
      label: 'Definição Muscular',
      subtitle: 'Supersets + volume moderado-alto · 5x por semana',
      days: [
        {
          id: 'a', title: 'Treino A — Peito e Tríceps (superset)', exercises: [
            { name: 'Supino reto + Flexão (superset)', sets: 4, reps: '10 + falha' },
            { name: 'Crossover na polia', sets: 3, reps: '15' },
            { name: 'Supino inclinado com halteres', sets: 3, reps: '12' },
            { name: 'Tríceps corda + Tríceps francês', sets: 3, reps: '12 + 12' },
          ],
        },
        {
          id: 'b', title: 'Treino B — Costas e Bíceps (superset)', exercises: [
            { name: 'Puxada frontal + Remada baixa', sets: 4, reps: '12 + 12' },
            { name: 'Remada unilateral', sets: 3, reps: '12 cada' },
            { name: 'Pull-over na polia', sets: 3, reps: '15' },
            { name: 'Rosca direta + Rosca martelo', sets: 3, reps: '12 + 12' },
          ],
        },
        {
          id: 'c', title: 'Treino C — Pernas', exercises: [
            { name: 'Agachamento búlgaro', sets: 4, reps: '12 cada perna' },
            { name: 'Leg press 45°', sets: 4, reps: '15' },
            { name: 'Cadeira extensora + flexora (biset)', sets: 3, reps: '15 + 15' },
            { name: 'Panturrilha em pé', sets: 4, reps: '20' },
          ],
        },
        {
          id: 'd', title: 'Treino D — Ombros e Core', exercises: [
            { name: 'Desenvolvimento máquina', sets: 4, reps: '12' },
            { name: 'Elevação lateral + frontal (biset)', sets: 3, reps: '15 + 15' },
            { name: 'Encolhimento de trapézio', sets: 3, reps: '15' },
            { name: 'Prancha + abdominal infra (circuito)', sets: 3, reps: '40s + 15' },
          ],
        },
      ],
    },
  
    manutencao: {
      label: 'Manutenção',
      subtitle: 'Full body equilibrado · 3x por semana',
      days: [
        {
          id: 'a', title: 'Treino A — Full Body', exercises: [
            { name: 'Agachamento livre', sets: 3, reps: '12' },
            { name: 'Supino reto com barra', sets: 3, reps: '10' },
            { name: 'Remada curvada', sets: 3, reps: '10' },
            { name: 'Desenvolvimento com halteres', sets: 3, reps: '10' },
            { name: 'Prancha abdominal', sets: 3, reps: '40s' },
          ],
        },
        {
          id: 'b', title: 'Treino B — Full Body', exercises: [
            { name: 'Levantamento terra (leve)', sets: 3, reps: '10' },
            { name: 'Puxada frontal', sets: 3, reps: '10' },
            { name: 'Leg press 45°', sets: 3, reps: '12' },
            { name: 'Rosca direta', sets: 3, reps: '12' },
            { name: 'Abdominal remador', sets: 3, reps: '15' },
          ],
        },
        {
          id: 'c', title: 'Treino C — Full Body + Mobilidade', exercises: [
            { name: 'Afundo (passada)', sets: 3, reps: '12 cada perna' },
            { name: 'Remada unilateral', sets: 3, reps: '12 cada' },
            { name: 'Elevação lateral', sets: 3, reps: '12' },
            { name: 'Tríceps corda', sets: 3, reps: '12' },
            { name: 'Alongamento geral', sets: 1, reps: '10 min' },
          ],
        },
      ],
    },
  };