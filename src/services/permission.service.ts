import { PlanTier, PlanPermissions } from '../types/billing';

export class PermissionService {
  /**
   * Returns full permissions matrix for a plan tier
   */
  static getPermissions(plan: PlanTier = 'FREE'): PlanPermissions {
    switch (plan) {
      case 'CONTADOR':
        return {
          maxCompanies: 999,
          unlimitedReports: true,
          aiAdvisorAccess: true,
          pdfExport: true,
          multiUserPortfolio: true,
          whiteLabel: true,
        };
      case 'PRO':
        return {
          maxCompanies: 10,
          unlimitedReports: true,
          aiAdvisorAccess: true,
          pdfExport: true,
          multiUserPortfolio: false,
          whiteLabel: false,
        };
      case 'FREE':
      default:
        return {
          maxCompanies: 1,
          unlimitedReports: false,
          aiAdvisorAccess: false,
          pdfExport: false,
          multiUserPortfolio: false,
          whiteLabel: false,
        };
    }
  }

  static canCreateCompany(plan: PlanTier = 'FREE', currentCompanyCount: number = 0): boolean {
    const perms = this.getPermissions(plan);
    return currentCompanyCount < perms.maxCompanies;
  }

  static canAccessAiAdvisor(plan: PlanTier = 'FREE'): boolean {
    return this.getPermissions(plan).aiAdvisorAccess;
  }

  static canExportPdf(plan: PlanTier = 'FREE'): boolean {
    return this.getPermissions(plan).pdfExport;
  }

  static canAccessMultiUserPortfolio(plan: PlanTier = 'FREE'): boolean {
    return this.getPermissions(plan).multiUserPortfolio;
  }

  static canAccessWhiteLabel(plan: PlanTier = 'FREE'): boolean {
    return this.getPermissions(plan).whiteLabel;
  }

  static canAccessUnlimitedReports(plan: PlanTier = 'FREE'): boolean {
    return this.getPermissions(plan).unlimitedReports;
  }
}
