import { DiagnosticSession } from '../../../types/diagnostic';

export class AdminAnalyticsService {
  static getSystemMetrics(sessions: DiagnosticSession[]) {
    const totalSimulations = sessions.length;
    const avgScore = totalSimulations > 0
      ? sessions.reduce((acc, s) => acc + s.metrics.splitReadyScore, 0) / totalSimulations
      : 0;

    const riskDistribution = {
      BAIXO: sessions.filter((s) => s.metrics.riscoNivel === 'BAIXO').length,
      MEDIO: sessions.filter((s) => s.metrics.riscoNivel === 'MEDIO').length,
      ALTO: sessions.filter((s) => s.metrics.riscoNivel === 'ALTO').length,
      CRITICO: sessions.filter((s) => s.metrics.riscoNivel === 'CRITICO').length,
    };

    return {
      totalSimulations,
      avgScore: Math.round(avgScore),
      riskDistribution,
    };
  }
}
